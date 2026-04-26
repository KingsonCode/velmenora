import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  Inject,
  NotFoundException,
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

type AdminAction = "review" | "approve" | "pay";

@Controller()
export class AdminController {
  constructor(
    @Inject(PrismaService)
    private readonly prisma: PrismaService,
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
      const result = await tx.payoutRequest.update({
        where: { id },
        data: {
          status: nextStatus as any,
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
      ...acc,
      investorPasswordEnc: undefined,
      investorPassword: decrypt(acc.investorPasswordEnc),
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

}
