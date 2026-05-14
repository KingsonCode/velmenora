import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  Inject,
  NotFoundException,
  ForbiddenException,
  Param,
  Post,
  Query,
  Res,
  UnauthorizedException,
} from "@nestjs/common";
import type { Response } from "express";
import { PrismaService } from "../prisma/prisma.service";
import { validateBroker } from "../config/brokers";
import { encrypt, decrypt } from "../utils/crypto";
import { MetricsOrchestrator } from "../modules/funded/orchestrators/metrics-orchestrator.service";

type AdminAction = "review" | "approve" | "pay";

@Controller()
export class AdminController {
  constructor(
    @Inject(PrismaService)
    private readonly prisma: PrismaService,

    @Inject(MetricsOrchestrator)
    private readonly metricsOrchestrator: MetricsOrchestrator,
  ) {}

  private assertAdmin(token?: string) {
    if (!process.env.ADMIN_TOKEN || token !== process.env.ADMIN_TOKEN) {
      throw new UnauthorizedException("Unauthorized");
    }
  }

  private computeFraudFlags(snapshot: Record<string, any>, tradingDaysCount: number) {
    return {
      suspiciousProfit: Number(snapshot.profit || 0) > 5000,
      equityMismatch:
        Number(snapshot.currentEquity || 0) !== Number(snapshot.currentBalance || 0),
      tooFastPass: Number(snapshot.tradingDaysCount || tradingDaysCount || 0) < 2,
    };
  }

  private getCriticalFraudFlags(flags: Record<string, boolean>) {
    return Object.entries(flags)
      .filter(([, value]) => value === true)
      .map(([key]) => key);
  }

  private evaluateFraud(snapshot: any, tradingDays: number) {
    let score = 0;
    const flags: string[] = [];

    const profit = Number(snapshot?.profit || 0);
    const initial = Number(snapshot?.initialBalance || 0);
    const equity = Number(snapshot?.currentEquity || 0);
    const balance = Number(snapshot?.currentBalance || 0);

    const profitPct = initial > 0 ? (profit / initial) * 100 : 0;

    if (tradingDays <= 0) {
      flags.push("tooFastPass");
      score += 50;
    }

    if (profitPct > 15) {
      flags.push("highProfitSpike");
      score += 20;
    }

    if (Math.abs(equity - balance) < 1 && profitPct > 10) {
      flags.push("noDrawdownPattern");
      score += 15;
    }

    if (profit % 100 === 0 && profit > 1000) {
      flags.push("roundedProfitPattern");
      score += 10;
    }

    if (snapshot?.requestCount && snapshot.requestCount > 3) {
      flags.push("multiRequestAbuse");
      score += 25;
    }

    let decision: "allow" | "review" | "block" = "allow";

    if (score > 70) decision = "block";
    else if (score >= 30) decision = "review";

    return { score, flags, decision };
  }

  @Get("admin/payouts")
  page(@Res() res: Response) {
    res.type("html").send(`<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Velmenora Admin - Payouts</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 24px; background: #f7f7f7; }
    h1 { margin-bottom: 16px; }
    table { width: 100%; border-collapse: collapse; background: white; }
    th, td { border: 1px solid #ddd; padding: 8px; font-size: 14px; text-align: left; }
    th { background: #eee; }
    button { padding: 6px 10px; margin: 2px; cursor: pointer; }
    button:disabled { opacity: .5; cursor: not-allowed; }
    .filters { margin: 12px 0 18px; }
    .badge { padding: 4px 8px; border-radius: 999px; font-weight: bold; font-size: 12px; display: inline-block; }
    .badge-requested { background: #fff7d6; color: #7a5a00; }
    .badge-under_review { background: #e8f0ff; color: #174ea6; }
    .badge-approved { background: #e8fff0; color: #0b6b2b; }
    .badge-paid { background: #e9f7ef; color: #146c43; }
    .badge-rejected { background: #fdecea; color: #b00020; }
    .badge-default { background: #eee; color: #333; }
    pre { background: #111; color: #eee; padding: 12px; overflow: auto; font-size: 12px; }
    .modal-bg { display:none; position:fixed; inset:0; background:rgba(0,0,0,.45); align-items:center; justify-content:center; }
    .modal { background:white; width:850px; max-height:90vh; overflow:auto; padding:20px; border:1px solid #ccc; }
    .danger { border:1px solid #c00; background:#ffecec; color:#900; padding:10px; margin-bottom:12px; }
    .safe { border:1px solid #0a0; background:#eefbee; color:#060; padding:10px; margin-bottom:12px; }
    .topbar { margin-bottom: 12px; }
    textarea { width:100%; min-height:70px; }
  </style>
</head>
<body>
  <div class="topbar">
    <button onclick="logout()">Logout</button>
  </div>

  <h1>Velmenora Admin - Payout Requests</h1>

<input id="searchInput" placeholder="Search email or ID" style="margin-bottom:10px;padding:6px;width:250px;" oninput="debouncedLoad()" />

  <div class="filters">
    <button onclick="setFilter('all')">All</button>
    <button onclick="setFilter('requested')">Requested</button>
    <button onclick="setFilter('under_review')">Under Review</button>
    <button onclick="setFilter('approved')">Approved</button>
    <button onclick="setFilter('paid')">Paid</button>
    <button onclick="setFilter('rejected')">Rejected</button>
  </div>

  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>User</th>
        <th>Amount</th>
        <th>Status</th>
        <th>Requested</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody id="rows"></tbody>
  </table>

<div style="margin-top:10px;">
  <button onclick="prevPage()">Prev</button>
  <span id="pageInfo"></span>
  <button onclick="nextPage()">Next</button>
</div>

  <div id="modalBg" class="modal-bg">
    <div class="modal">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <h2>Payout Detail</h2>
        <button onclick="closeModal()">Close</button>
      </div>

      <div id="fraudBox"></div>
      <div id="detailBox"></div>

      <h3>Eligibility Snapshot</h3>
      <pre id="snapshotBox"></pre>

      <h3>Audit Timeline</h3>
      <div id="auditBox"></div>

      <div id="modalActions"></div>
    </div>
  </div>

<script>
let selected = null;
let allPayouts = [];
let currentFilter = "all";

let page = 1;
let totalPages = 1;
let debounceTimer = null;

function debouncedLoad() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    page = 1;
    load();
  }, 400);
}

function prevPage() {
  if (page > 1) {
    page--;
    load();
  }
}

function nextPage() {
  if (page < totalPages) {
    page++;
    load();
  }
}


function statusBadge(status) {
  const safe = String(status || "default").replace(/[^a-zA-Z0-9_]/g, "");
  return '<span class="badge badge-' + safe + '">' + status + '</span>';
}

function setFilter(status) {
  currentFilter = status;
  renderRows();
}

function token() {
  let t = localStorage.getItem("admin_token");
  if (!t) {
    t = prompt("Enter admin token") || "";
    localStorage.setItem("admin_token", t);
  }
  return t;
}

function logout() {
  localStorage.removeItem("admin_token");
  location.reload();
}

async function api(path, options = {}) {
  return fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "x-admin-token": token(),
      ...(options.headers || {})
    }
  });
}

async function load() {
  const q = document.getElementById("searchInput")?.value || "";
  const res = await api("/api/admin/payouts-list?page=" + page + "&status=" + currentFilter + "&q=" + encodeURIComponent(q));
  const json = await res.json();

  if (!res.ok) {
    alert(json.message || json.error || "Failed to load payouts");
    return;
  }

  allPayouts = Array.isArray(json.items) ? json.items : [];
  totalPages = json.pages || 1;
  document.getElementById("pageInfo").innerText = "Page " + page + " / " + totalPages;
  renderRows();
}

function renderRows() {
  const rows = document.getElementById("rows");
  rows.innerHTML = "";

  const filtered = currentFilter === "all"
    ? allPayouts
    : allPayouts.filter((p) => p.status === currentFilter);

  filtered.forEach((p) => {
    rows.innerHTML += \`
      <tr>
        <td><code>\${p.id.slice(0, 8)}</code></td>
        <td>\${p.userEmail || "-"}</td>
        <td>$\${p.amount}</td>
        <td>\${statusBadge(p.status)}</td>
        <td>\${new Date(p.requestedAt).toLocaleString()}</td>
        <td>
          <button onclick="viewDetail('\${p.id}')">View</button>
          \${p.status === "requested" ? \`<button onclick="runAction('\${p.id}', 'review')">Review</button>\` : ""}
          \${p.status === "under_review" ? \`<button onclick="runAction('\${p.id}', 'approve')">Approve</button>\` : ""}
          \${p.status === "approved" ? \`<button onclick="runAction('\${p.id}', 'pay')">Mark Paid</button>\` : ""}
        </td>
      </tr>
    \`;
  });

  if (!filtered.length) {
    rows.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:20px;">No payouts for this status.</td></tr>';
  }
}

async function viewDetail(id) {
  const res = await api("/api/admin/payouts/" + id);
  const json = await res.json();

  if (!res.ok) {
    alert(json.message || json.error || "Failed to load detail");
    return;
  }

  selected = json;

  const flags = Object.entries(json.fraudFlags || {}).filter(([, v]) => v);
  const isBlocked = flags.length > 0;

  document.getElementById("fraudBox").innerHTML = flags.length
    ? \`<div class="danger"><b>AUTO-BLOCKED: Fraud Flags Detected</b><ul>\${flags.map(([k]) => \`<li>\${k}</li>\`).join("")}</ul><p>Approval and payment are disabled until flags are resolved.</p></div>\`
    : \`<div class="safe"><b>No fraud flags detected</b></div>\`;

  document.getElementById("detailBox").innerHTML = \`
    <p><b>User:</b> \${json.user.email}</p>
    <p><b>Status:</b> \${json.payout.status}</p>
    <p><b>Amount:</b> $\${json.payout.amount}</p>
    <p><b>Account:</b> \${json.account.id}</p>
    <p><b>Initial Balance:</b> $\${json.account.initialBalance}</p>
    <p><b>Current Balance:</b> $\${json.account.currentBalance}</p>
    <p><b>Current Equity:</b> $\${json.account.currentEquity}</p>
    <p><b>Trading Days:</b> \${json.account.tradingDaysCount}</p>
  \`;

  document.getElementById("snapshotBox").textContent = JSON.stringify(json.snapshot, null, 2);



  const auditLogs = Array.isArray(json.auditLogs) ? json.auditLogs : [];
  if (auditLogs.length) {
    let html = "";
    auditLogs.forEach((log) => {
      html += "<div style='border-left:3px solid #333;padding:8px 12px;margin-bottom:8px;background:#fafafa;'>";
      html += "<b>" + log.eventType + "</b>";
      html += "<div style='font-size:12px;color:#555;'>" + new Date(log.createdAt).toLocaleString() + "</div>";
      html += "<pre style='background:#f1f1f1;color:#111;'>" + JSON.stringify(log.metadataJson, null, 2) + "</pre>";
      html += "</div>";
    });
    document.getElementById("auditBox").innerHTML = html;
  } else {
    document.getElementById("auditBox").innerHTML = "<p>No audit logs found.</p>";
  }

  let actions = "";

  if (json.payout.status === "requested") {
    actions += \`<button onclick="runAction('\${json.payout.id}', 'review')">Start Review</button>\`;
  }

  if (json.payout.status === "under_review") {
    actions += isBlocked
      ? \`
        <button disabled>Approve Blocked</button>
        <h3>Reject Reason</h3>
        <textarea id="rejectReason">Blocked by fraud flags: \${flags.map(([k]) => k).join(", ")}</textarea>
        <br/>
        <button onclick="rejectPayout('\${json.payout.id}')">Reject With Reason</button>
      \`
      : \`
        <button onclick="runAction('\${json.payout.id}', 'approve')">Approve</button>
        <h3>Reject Reason</h3>
        <textarea id="rejectReason" placeholder="Reason..."></textarea>
        <br/>
        <button onclick="rejectPayout('\${json.payout.id}')">Reject With Reason</button>
      \`;
  }

  if (json.payout.status === "approved") {
    actions += isBlocked
      ? \`<button disabled>Payment Blocked</button>\`
      : \`<button onclick="runAction('\${json.payout.id}', 'pay')">Mark Paid</button>\`;
  }

  document.getElementById("modalActions").innerHTML = actions;
  document.getElementById("modalBg").style.display = "flex";
}

function closeModal() {
  selected = null;
  document.getElementById("modalBg").style.display = "none";
}

async function runAction(id, action) {
  const res = await api("/api/admin/payouts/" + id + "/action", {
    method: "POST",
    body: JSON.stringify({ action })
  });

  const json = await res.json();

  if (!res.ok) {
    alert(json.message || json.error || "Action failed");
    return;
  }

  await load();
  await viewDetail(id);
}

async function rejectPayout(id) {
  const reason = document.getElementById("rejectReason").value.trim();

  if (!reason) {
    alert("Reject reason is required");
    return;
  }

  const res = await api("/api/admin/payouts/" + id + "/reject", {
    method: "POST",
    body: JSON.stringify({ reason })
  });

  const json = await res.json();

  if (!res.ok) {
    alert(json.message || json.error || "Reject failed");
    return;
  }

  closeModal();
  await load();
}

load();
</script>
</body>
</html>`);
  }

  @Get("admin/payouts-list")
  async list(
    @Headers("x-admin-token") token?: string,
    @Query("q") q?: string,
    @Query("status") status?: string,
    @Query("page") pageStr?: string,
    @Query("limit") limitStr?: string,
  ) {
    this.assertAdmin(token);

    const page = Math.max(1, Number(pageStr || 1));
    const limit = Math.min(50, Math.max(5, Number(limitStr || 10)));
    const skip = (page - 1) * limit;

    const where: any = {};

    if (status && status !== "all") {
      where.status = status;
    }

    if (q) {
      where.OR = [
        { id: { contains: q } },
        { user: { email: { contains: q, mode: "insensitive" } } },
      ];
    }

    const [items, total] = await this.prisma.$transaction([
      this.prisma.payoutRequest.findMany({
        where,
        orderBy: { requestedAt: "desc" },
        include: { user: true },
        skip,
        take: limit,
      }),
      this.prisma.payoutRequest.count({ where }),
    ]);

    return {
      items: items.map((p) => ({
        id: p.id,
        userEmail: p.user?.email,
        challengeAccountId: p.challengeAccountId,
        amount: p.requestedAmount.toString(),
        status: p.status,
        requestedAt: p.requestedAt,
      })),
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    };
  }

  @Get("admin/payouts/:id")
  async detail(
    @Param("id") id: string,
    @Headers("x-admin-token") token?: string,
  ) {
    this.assertAdmin(token);

    const payout = await this.prisma.payoutRequest.findUnique({
      where: { id },
      include: {
        user: true,
        challengeAccount: true,
      },
    });

    if (!payout) throw new NotFoundException("Payout not found");

    const snapshot = (payout.eligibilitySnapshotJson || {}) as Record<string, any>;
    const fraud = this.evaluateFraud(
      snapshot,
      payout.challengeAccount.tradingDaysCount,
    );

    const auditLogs = await this.prisma.auditLog.findMany({
      where: { entityId: id },
      orderBy: { createdAt: "asc" },
      take: 50,
    });

    return {
      payout: {
        id: payout.id,
        status: payout.status,
        amount: payout.requestedAmount.toString(),
        requestedAt: payout.requestedAt,
      },
      user: {
        email: payout.user.email,
      },
      account: {
        id: payout.challengeAccount.id,
        initialBalance: payout.challengeAccount.initialBalance.toString(),
        currentBalance: payout.challengeAccount.currentBalance.toString(),
        currentEquity: payout.challengeAccount.currentEquity.toString(),
        tradingDaysCount: payout.challengeAccount.tradingDaysCount,
      },
      snapshot,
      fraudFlags: fraud.flags,
      fraudScore: fraud.score,
      fraudDecision: fraud.decision,
      auditLogs: auditLogs.map((log) => ({
        eventType: log.eventType,
        entityType: log.entityType,
        entityId: log.entityId,
        metadataJson: log.metadataJson,
        createdAt: log.createdAt,
      })),
    };
  }

  @Post("admin/payouts/:id/action")
  async action(
    @Param("id") id: string,
    @Body() body: { action: AdminAction },
    @Headers("x-admin-token") token?: string,
  ) {
    this.assertAdmin(token);

    const payout = await this.prisma.payoutRequest.findUnique({
      where: { id },
      include: {
        challengeAccount: true,
      },
    });

    if (!payout) throw new NotFoundException("Payout not found");

    const action = body.action;
    let nextStatus = payout.status;
    let nextAccountStatus: any | undefined;

    if (action === "review" && payout.status === "requested") {
      nextStatus = "under_review";
      nextAccountStatus = "payout_under_review";
    } else if (action === "approve" && payout.status === "under_review") {
      nextStatus = "approved";
      nextAccountStatus = "payout_approved";
    } else if (action === "pay" && payout.status === "approved") {
      nextStatus = "paid";
      nextAccountStatus = "payout_paid";
    } else {
      throw new BadRequestException("Invalid payout transition");
    }

    if (action === "approve") {
      const brokerAccount = await this.prisma.brokerAccount.findFirst({
        where: {
          challengeAccountId: payout.challengeAccountId,
          verificationStatus: "verified",
        },
        orderBy: { createdAt: "desc" },
      });

      if (!brokerAccount) {
        throw new BadRequestException("Broker account not verified");
      }
    }

    if (action === "approve" || action === "pay") {
      const snapshot = (payout.eligibilitySnapshotJson || {}) as Record<string, any>;
      const fraudFlags = this.computeFraudFlags(
        snapshot,
        payout.challengeAccount.tradingDaysCount,
      );
      const criticalFlags = this.getCriticalFraudFlags(fraudFlags);

      if (criticalFlags.length > 0) {
        throw new BadRequestException({
          message: "Payout blocked due to fraud flags",
          fraudFlags: criticalFlags,
        });
      }
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      const reviewerId =
        (body as any)?.reviewerId ??
        process.env.ADMIN_REVIEWER_ID ??
        "cmoc3li2q0000c3kitgfuxj3m";

      const result = await tx.payoutRequest.update({
        where: { id },
        data: {
          status: nextStatus as any,
          reviewerId:
            action === "approve" || action === "pay" ? reviewerId : undefined,
          reviewedAt: action === "approve" ? new Date() : undefined,
          paidAt: action === "pay" ? new Date() : undefined,
        },
      });

      if (nextAccountStatus) {
        await tx.challengeAccount.update({
          where: { id: payout.challengeAccountId },
          data: { status: nextAccountStatus },
        });
      }

      await tx.auditLog.create({
        data: {
          eventType:
            action === "review"
              ? "admin_action"
              : action === "approve"
                ? "payout_approved"
                : "payout_paid",
          entityType: "payout_request",
          entityId: id,
          metadataJson: {
            source: "admin_dashboard",
            action,
            previousPayoutStatus: payout.status,
            nextPayoutStatus: nextStatus,
            nextAccountStatus,
            challengeAccountId: payout.challengeAccountId,
          },
        },
      });

      return result;
    });

    const safeUpdated = {
      ...updated,
      investorPasswordEnc: undefined,
    };

    return { ok: true, updated: safeUpdated };
  }

  @Post("admin/payouts/:id/reject")
  async reject(
    @Param("id") id: string,
    @Body() body: { reason?: string },
    @Headers("x-admin-token") token?: string,
  ) {
    this.assertAdmin(token);

    const reason = body.reason?.trim();

    if (!reason) throw new BadRequestException("Reject reason required");

    const payout = await this.prisma.payoutRequest.findUnique({
      where: { id },
    });

    if (!payout) throw new NotFoundException("Payout not found");

    if (payout.status !== "under_review") {
      throw new BadRequestException("Only under_review payouts can be rejected");
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      const result = await tx.payoutRequest.update({
        where: { id },
        data: {
          status: "rejected" as any,
          rejectionReason: reason,
          reviewedAt: new Date(),
        },
      });

      await tx.challengeAccount.update({
        where: { id: payout.challengeAccountId },
        data: { status: "payout_pending" as any },
      });

      await tx.auditLog.create({
        data: {
          eventType: "payout_rejected",
          entityType: "payout_request",
          entityId: id,
          metadataJson: {
            source: "admin_dashboard",
            reason,
            previousPayoutStatus: payout.status,
            nextPayoutStatus: "rejected",
            nextAccountStatus: "payout_pending",
            challengeAccountId: payout.challengeAccountId,
          },
        },
      });

      return result;
    });

    return { ok: true, updated };
  }
  @Post("broker-account/submit")
  async submitBroker(@Body() body: any) {
    const {
      challengeAccountId,
      brokerName,
      accountType,
      platformType,
      accountLogin,
      serverName,
      investorPassword,
    } = body;

    if (
      !challengeAccountId ||
      !brokerName ||
      !accountType ||
      !platformType ||
      !accountLogin ||
      !serverName ||
      !investorPassword
    ) {
      throw new BadRequestException("Missing broker account fields");
    }

    const isValid = validateBroker(
      brokerName,
      accountType,
      platformType,
      serverName,
    );

    if (!isValid) {
      throw new BadRequestException("Invalid broker, account type, platform, or server");
    }

    const challengeAccount = await this.prisma.challengeAccount.findUnique({
      where: { id: challengeAccountId },
    });

    if (!challengeAccount) {
      throw new NotFoundException("Challenge account not found");
    }

    if (challengeAccount.paymentStatus !== "paid") {
      throw new ForbiddenException(
        "Payment must be completed before submitting broker account details.",
      );
    }

    const existingPending = await this.prisma.brokerAccount.findFirst({
      where: {
        challengeAccountId,
        brokerName,
        accountType,
        platformType,
        accountLogin,
        serverName,
        verificationStatus: "pending",
      },
      orderBy: { createdAt: "desc" },
    });

    if (existingPending) {
      return {
        ok: true,
        duplicate: true,
        message: "Broker account submission is already pending verification.",
        record: {
          id: existingPending.id,
          challengeAccountId: existingPending.challengeAccountId,
          brokerName: existingPending.brokerName,
          accountType: existingPending.accountType,
          platformType: existingPending.platformType,
          accountLogin: existingPending.accountLogin,
          serverName: existingPending.serverName,
          verificationStatus: existingPending.verificationStatus,
          verificationNotes: existingPending.verificationNotes,
          verifiedAt: existingPending.verifiedAt,
          createdAt: existingPending.createdAt,
          updatedAt: existingPending.updatedAt,
        },
      };
    }

    const record = await this.prisma.brokerAccount.create({
      data: {
        challengeAccountId,
        brokerName,
        accountType,
        platformType,
        accountLogin,
        serverName,
        investorPasswordEnc: encrypt(investorPassword),
      },
    });

    await this.prisma.auditLog.create({
      data: {
        eventType: "admin_action",
        entityType: "challenge_account",
        entityId: record.id,
        metadataJson: {
          source: "broker_account_submit",
          challengeAccountId,
          brokerName,
          accountType,
          platformType,
          serverName,
          verificationStatus: "pending",
        },
      },
    });

    return {
      ok: true,
      record: {
        ...record,
        investorPasswordEnc: undefined,
      },
    };
  }

  @Get("admin/broker-accounts")
  brokerAccountsPage(@Res() res: Response) {
    res.type("html").send(`<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Velmenora Admin - Broker Accounts</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 24px; background: #f7f7f7; color:#111; }
    h1 { margin-bottom: 8px; }
    .topbar { display:flex; gap:8px; align-items:center; margin-bottom:16px; }
    .filters { margin: 12px 0 18px; display:flex; gap:8px; flex-wrap:wrap; }
    table { width: 100%; border-collapse: collapse; background: white; }
    th, td { border: 1px solid #ddd; padding: 8px; font-size: 13px; text-align: left; vertical-align: top; }
    th { background: #eee; }
    button { padding: 6px 10px; margin: 2px; cursor: pointer; border:1px solid #bbb; border-radius:6px; background:#fff; }
    button.primary { background:#16a34a; color:#fff; border-color:#16a34a; }
    button.danger { background:#dc2626; color:#fff; border-color:#dc2626; }
    button.blue { background:#2563eb; color:#fff; border-color:#2563eb; }
    input, select { padding: 7px; border:1px solid #ccc; border-radius:6px; }
    .badge { padding: 4px 8px; border-radius: 999px; font-weight: bold; font-size: 12px; display: inline-block; }
    .badge-pending { background: #fff7d6; color: #7a5a00; }
    .badge-verified { background: #e8fff0; color: #0b6b2b; }
    .badge-failed { background: #fdecea; color: #b00020; }
    .badge-default { background: #eee; color: #333; }
    .muted { color:#666; font-size:12px; }
    .card { background:#fff; border:1px solid #ddd; padding:14px; border-radius:10px; margin-bottom:14px; }
    pre { background:#111; color:#eee; padding:12px; overflow:auto; font-size:12px; }
  </style>
</head>
<body>
  <div class="topbar">
    <button onclick="location.href='/admin/payouts'">Payouts</button>
    <button onclick="loadRows()">Reload</button>
    <button onclick="logout()">Logout</button>
  </div>

  <h1>Velmenora Admin - Broker Accounts</h1>
  <p class="muted">Verify or reject submitted MT4/MT5 investor access. Passwords are never displayed here.</p>

  <div class="card">
    <label>Status filter:</label>
    <select id="statusFilter" onchange="loadRows()">
      <option value="pending">Pending</option>
      <option value="verified">Verified</option>
      <option value="failed">Failed</option>
      <option value="all">All</option>
    </select>

    <input id="searchInput" placeholder="Search email, login, broker, account ID" style="width:320px;" oninput="debouncedLoad()" />
  </div>

  <table>
    <thead>
      <tr>
        <th>Submitted</th>
        <th>Trader</th>
        <th>Challenge Account</th>
        <th>Broker</th>
        <th>Platform</th>
        <th>Server</th>
        <th>Login</th>
        <th>Status</th>
        <th>Notes</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody id="rows"></tbody>
  </table>

  <h3>Last response</h3>
  <pre id="resultBox">Ready.</pre>

<script>
let timer = null;

function token() {
  let t = localStorage.getItem("admin_token");
  if (!t) {
    t = prompt("Enter admin token") || "";
    localStorage.setItem("admin_token", t);
  }
  return t;
}

function logout() {
  localStorage.removeItem("admin_token");
  location.reload();
}

function badge(status) {
  const cls =
    status === "pending" ? "badge-pending" :
    status === "verified" ? "badge-verified" :
    status === "failed" ? "badge-failed" :
    "badge-default";
  return '<span class="badge ' + cls + '">' + String(status || "unknown") + '</span>';
}

function esc(v) {
  return String(v ?? "").replace(/[&<>"']/g, function (c) {
    return ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" })[c];
  });
}

async function api(url, options) {
  const res = await fetch(url, {
    ...(options || {}),
    headers: {
      "Content-Type": "application/json",
      "x-admin-token": token(),
      ...((options && options.headers) || {}),
    },
  });

  const text = await res.text();
  let data = null;

  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text };
  }

  if (!res.ok) {
    throw new Error(data.message || data.error || text || "Request failed");
  }

  return data;
}

function debouncedLoad() {
  clearTimeout(timer);
  timer = setTimeout(loadRows, 250);
}

function actionButtons(item) {
  const id = esc(item.id);

  if (item.verificationStatus === "pending") {
    return '' +
      '<button class="primary" onclick="verifyBroker(\\'' + id + '\\')">Verify</button>' +
      '<button class="danger" onclick="rejectBroker(\\'' + id + '\\')">Reject</button>';
  }

  if (item.verificationStatus === "verified") {
    return '<button class="blue" onclick="openSync(\\'' + id + '\\')">Sync Metrics</button>';
  }

  if (item.verificationStatus === "failed") {
    return '<span class="muted">No action</span>';
  }

  return '<span class="muted">Unknown status</span>';
}


async function loadRows() {
  const status = document.getElementById("statusFilter").value;
  const q = encodeURIComponent(document.getElementById("searchInput").value || "");
  const rows = document.getElementById("rows");
  const resultBox = document.getElementById("resultBox");

  rows.innerHTML = '<tr><td colspan="10">Loading...</td></tr>';

  try {
    const data = await api("/api/admin/broker-accounts-list?status=" + status + "&q=" + q);
    resultBox.textContent = JSON.stringify({ ok: true, count: data.items.length }, null, 2);

    if (!data.items.length) {
      rows.innerHTML = '<tr><td colspan="10">No broker accounts found.</td></tr>';
      return;
    }

    rows.innerHTML = data.items.map(function (item) {
      const user = item.challengeAccount && item.challengeAccount.user ? item.challengeAccount.user : {};
      const account = item.challengeAccount || {};
      return '<tr>' +
        '<td>' + esc(new Date(item.createdAt).toLocaleString()) + '</td>' +
        '<td><b>' + esc(user.fullName || "—") + '</b><br><span class="muted">' + esc(user.email || "—") + '</span></td>' +
        '<td><a href="/api/admin/broker-account/' + esc(item.id) + '" target="_blank">' + esc(item.challengeAccountId) + '</a><br><span class="muted">' + esc(account.status || "") + '</span></td>' +
        '<td>' + esc(item.brokerName) + '<br><span class="muted">' + esc(item.accountType) + '</span></td>' +
        '<td>' + esc(item.platformType) + '</td>' +
        '<td>' + esc(item.serverName) + '</td>' +
        '<td>' + esc(item.accountLogin) + '</td>' +
        '<td>' + badge(item.verificationStatus) + '</td>' +
        '<td>' + esc(item.verificationNotes || "") + '</td>' +
        '<td>' + actionButtons(item) + '</td>' +
      '</tr>';
    }).join("");
  } catch (e) {
    rows.innerHTML = '<tr><td colspan="10" style="color:#b00020;">' + esc(e.message) + '</td></tr>';
    resultBox.textContent = e.message;
  }
}

async function verifyBroker(id) {
  const notes = prompt("Verification notes", "Investor access accepted by admin.");
  if (notes === null) return;

  try {
    const data = await api("/api/admin/broker-account/" + id + "/verify", {
      method: "POST",
      body: JSON.stringify({ status: "verified", notes }),
    });
    document.getElementById("resultBox").textContent = JSON.stringify(data, null, 2);
    await loadRows();
  } catch (e) {
    alert(e.message);
  }
}

async function rejectBroker(id) {
  const notes = prompt("Rejection reason", "Investor credentials could not be verified.");
  if (notes === null) return;

  try {
    const data = await api("/api/admin/broker-account/" + id + "/verify", {
      method: "POST",
      body: JSON.stringify({ status: "failed", notes }),
    });
    document.getElementById("resultBox").textContent = JSON.stringify(data, null, 2);
    await loadRows();
  } catch (e) {
    alert(e.message);
  }
}

function openSync(id) {
  const currentBalance = prompt("Current balance");
  if (currentBalance === null) return;

  const currentEquity = prompt("Current equity");
  if (currentEquity === null) return;

  syncMetrics(id, currentBalance, currentEquity);
}

async function syncMetrics(id, currentBalance, currentEquity) {
  try {
    const data = await api("/api/admin/broker-account/" + id + "/sync-metrics", {
      method: "POST",
      body: JSON.stringify({
        currentBalance: Number(currentBalance),
        currentEquity: Number(currentEquity),
        pnl: Number(currentEquity) - 10000,
        tradeCount: 0,
        closedTrades: 0,
        volume: 0,
        tradingDurationMinutes: 0
      }),
    });
    document.getElementById("resultBox").textContent = JSON.stringify(data, null, 2);
    await loadRows();
  } catch (e) {
    alert(e.message);
  }
}

loadRows();
</script>
</body>
</html>`);
  }

  @Get("admin/broker-accounts-list")
  async listBrokerAccounts(
    @Headers("x-admin-token") token?: string,
    @Query("status") status?: string,
    @Query("q") q?: string,
  ) {
    this.assertAdmin(token);

    const allowedStatuses = ["pending", "verified", "failed"];
    const normalizedStatus = status && status !== "all" ? status : undefined;

    if (normalizedStatus && !allowedStatuses.includes(normalizedStatus)) {
      throw new BadRequestException("Invalid broker account status");
    }

    const search = String(q || "").trim();

    const where: any = {
      ...(normalizedStatus ? { verificationStatus: normalizedStatus } : {}),
      ...(search
        ? {
            OR: [
              { id: { contains: search, mode: "insensitive" } },
              { challengeAccountId: { contains: search, mode: "insensitive" } },
              { brokerName: { contains: search, mode: "insensitive" } },
              { accountLogin: { contains: search, mode: "insensitive" } },
              { serverName: { contains: search, mode: "insensitive" } },
              {
                challengeAccount: {
                  user: {
                    OR: [
                      { email: { contains: search, mode: "insensitive" } },
                      { fullName: { contains: search, mode: "insensitive" } },
                    ],
                  },
                },
              },
            ],
          }
        : {}),
    };

    const items = await this.prisma.brokerAccount.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 100,
      select: {
        id: true,
        challengeAccountId: true,
        brokerName: true,
        accountType: true,
        platformType: true,
        accountLogin: true,
        serverName: true,
        verificationStatus: true,
        verificationNotes: true,
        verifiedAt: true,
        createdAt: true,
        updatedAt: true,
        challengeAccount: {
          select: {
            id: true,
            status: true,
            paymentStatus: true,
            currentBalance: true,
            currentEquity: true,
            totalPnl: true,
            tradingDaysCount: true,
            user: {
              select: {
                id: true,
                email: true,
                fullName: true,
                phone: true,
              },
            },
          },
        },
      },
    });

    return { ok: true, items };
  }

  @Get("admin/broker-account/:id")
  async getBroker(
    @Param("id") id: string,
    @Headers("x-admin-token") token?: string,
  ) {
    this.assertAdmin(token);

    const acc = await this.prisma.brokerAccount.findUnique({
      where: { id },
    });

    if (!acc) throw new NotFoundException("Broker account not found");

    return {
      id: acc.id,
      challengeAccountId: acc.challengeAccountId,
      brokerName: acc.brokerName,
      accountType: acc.accountType,
      platformType: acc.platformType,
      accountLogin: acc.accountLogin,
      serverName: acc.serverName,
      verificationStatus: acc.verificationStatus,
      verificationNotes: acc.verificationNotes,
      verifiedAt: acc.verifiedAt,
      createdAt: acc.createdAt,
      updatedAt: acc.updatedAt,
      hasInvestorPassword: Boolean(acc.investorPasswordEnc),
    };
  }

  @Post("admin/broker-account/:id/verify")
  async verifyBroker(
    @Param("id") id: string,
    @Body() body: { status: "verified" | "failed"; notes?: string },
    @Headers("x-admin-token") token?: string,
  ) {
    this.assertAdmin(token);

    if (!["verified", "failed"].includes(body.status)) {
      throw new BadRequestException("Invalid verification status");
    }

    const updated = await this.prisma.brokerAccount.update({
      where: { id },
      data: {
        verificationStatus: body.status,
        verificationNotes: body.notes,
        verifiedAt: new Date(),
      },
    });

    await this.prisma.auditLog.create({
      data: {
        eventType: "admin_action",
        entityType: "challenge_account",
        entityId: id,
        metadataJson: {
          source: "broker_account_verification",
          status: body.status,
          notes: body.notes || null,
          challengeAccountId: updated.challengeAccountId,
        },
      },
    });

    return {
      ok: true,
      updated: {
        id: updated.id,
        challengeAccountId: updated.challengeAccountId,
        brokerName: updated.brokerName,
        accountType: updated.accountType,
        platformType: updated.platformType,
        accountLogin: updated.accountLogin,
        serverName: updated.serverName,
        verificationStatus: updated.verificationStatus,
        verificationNotes: updated.verificationNotes,
        verifiedAt: updated.verifiedAt,
        createdAt: updated.createdAt,
        updatedAt: updated.updatedAt,
      },
    };
  }

  @Post("admin/broker-account/:id/sync-metrics")
  async syncBrokerMetrics(
    @Param("id") id: string,
    @Body() body: any,
    @Headers("x-admin-token") token?: string,
  ) {
    this.assertAdmin(token);

    const brokerAccount = await this.prisma.brokerAccount.findUnique({
      where: { id },
      include: {
        challengeAccount: true,
      },
    });

    if (!brokerAccount) {
      throw new NotFoundException("Broker account not found");
    }

    if (brokerAccount.verificationStatus !== "verified") {
      throw new BadRequestException("Broker account must be verified before syncing metrics");
    }

    if (!brokerAccount.challengeAccountId || !brokerAccount.challengeAccount) {
      throw new BadRequestException("Broker account is not linked to a challenge account");
    }

    const currentBalance = Number(body.currentBalance);
    const currentEquity = Number(body.currentEquity);

    if (!Number.isFinite(currentBalance) || !Number.isFinite(currentEquity)) {
      throw new BadRequestException("currentBalance and currentEquity are required numbers");
    }

    const result = await this.metricsOrchestrator.process(
      brokerAccount.challengeAccountId,
      {
        ...body,
        currentBalance,
        currentEquity,
        source: "admin_broker_metrics_sync",
        brokerAccountId: brokerAccount.id,
        brokerName: brokerAccount.brokerName,
        platformType: brokerAccount.platformType,
        serverName: brokerAccount.serverName,
        accountLogin: brokerAccount.accountLogin,
      },
    );

    await this.prisma.auditLog.create({
      data: {
        eventType: "admin_action",
        entityType: "challenge_account",
        entityId: brokerAccount.challengeAccountId,
        metadataJson: {
          source: "broker_account_metrics_sync",
          brokerAccountId: brokerAccount.id,
          brokerName: brokerAccount.brokerName,
          platformType: brokerAccount.platformType,
          serverName: brokerAccount.serverName,
          accountLogin: brokerAccount.accountLogin,
          metrics: body,
        },
      },
    });

    return {
      ok: true,
      brokerAccount: {
        id: brokerAccount.id,
        challengeAccountId: brokerAccount.challengeAccountId,
        brokerName: brokerAccount.brokerName,
        platformType: brokerAccount.platformType,
        accountLogin: brokerAccount.accountLogin,
        serverName: brokerAccount.serverName,
        verificationStatus: brokerAccount.verificationStatus,
      },
      result,
    };
  }

}
