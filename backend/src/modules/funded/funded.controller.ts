import {
  Body,
  Controller,
  Get,
  Headers,
  Inject,
  Param,
  Post,
  Query,
  Req,
} from "@nestjs/common";
import { Request } from "express";

import { ChallengeLifecycleService } from "./ChallengeLifecycleService";
import { PayoutRequestService } from "./services/payout-request.service";
import { AffiliatePayoutService } from "./services/affiliate-payout.service";
import { PaymentProcessingService } from "./payments/payment-processing.service";
import { NowPaymentsService } from "./payments/nowpayments.service";
import { PrismaService } from "../../prisma/prisma.service";

type HeaderMap = Record<string, string | string[] | undefined>;

function headerValue(headers: HeaderMap, key: string): string | undefined {
  const value = headers[key] ?? headers[key.toLowerCase()];
  if (Array.isArray(value)) return value[0];
  return value;
}

function normalizeIp(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const first = value.split(",")[0]?.trim();
  if (!first) return undefined;
  return first.replace(/^::ffff:/, "").slice(0, 80);
}

function extractClientIp(req: Request, headers: HeaderMap): string | undefined {
  return normalizeIp(
    headerValue(headers, "cf-connecting-ip") ??
      headerValue(headers, "x-vercel-forwarded-for") ??
      headerValue(headers, "x-forwarded-for") ??
      headerValue(headers, "x-real-ip") ??
      req.ip ??
      req.socket.remoteAddress,
  );
}

type ApplyBody = {
  email: string;
  fullName: string;
  phone?: string;
  password?: string;
  planSlug: string;
  ref?: string;
};

type RequestPayoutBody = {
  requestedAmount?: number;
};

type AffiliatePayoutRequestBody = {
  ref?: string;
  method?: string;
  notes?: string;
};

type AffiliatePayoutAdminBody = {
  payoutId?: string;
  reviewerId?: string;
  method?: string;
  reference?: string;
  notes?: string;
};

@Controller("funded")
export class FundedController {
  constructor(
    @Inject(ChallengeLifecycleService)
    private readonly lifecycle: ChallengeLifecycleService,
    @Inject(PayoutRequestService)
    private readonly payoutRequestService: PayoutRequestService,
    @Inject(AffiliatePayoutService)
    private readonly affiliatePayoutService: AffiliatePayoutService,
    @Inject(PaymentProcessingService)
    private readonly paymentProcessingService: PaymentProcessingService,
    @Inject(NowPaymentsService)
    private readonly nowPaymentsService: NowPaymentsService,
    @Inject(PrismaService)
    private readonly prisma: PrismaService,
  ) {}

  @Get("ping")
  async ping() {
    return {
      ok: true,
      module: "funded",
      timestamp: new Date().toISOString(),
    };
  }

  @Post("apply")
  async apply(
    @Body() body: ApplyBody,
    @Req() req: Request,
    @Headers() headers: HeaderMap,
  ) {
    return this.lifecycle.apply({
      email: body.email,
      fullName: body.fullName,
      phone: body.phone,
      password: body.password,
      planSlug: body.planSlug,
      ref: body.ref,
      ipAddress: extractClientIp(req, headers),
      userAgent: headerValue(headers, "user-agent"),
    });
  }

  @Get("account/:id")
  async getAccount(@Param("id") id: string) {
    const account = await this.prisma.challengeAccount.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
            phone: true,
            role: true,
            isActive: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        challenge: true,
        payments: {
          orderBy: { createdAt: "desc" },
          take: 5,
        },
        payoutRequests: {
          orderBy: { requestedAt: "desc" },
          take: 5,
        },
        metricSnapshots: {
          orderBy: { snapshotTime: "desc" },
          take: 10,
        },
        brokerAccounts: {
          orderBy: { createdAt: "desc" },
          take: 3,
          select: {
            id: true,
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
          },
        },
      },
    });

    if (!account) {
      return {
        ok: false,
        error: "account_not_found",
      };
    }

    return {
      ok: true,
      challengeAccount: account,
    };
  }

  @Post("payment/initiate")
  async initiatePayment(@Body() body: { challengeAccountId: string }) {
    return this.paymentProcessingService.initiateNowPaymentsPayment(
      body.challengeAccountId,
    );
  }

  @Post("payment/nowpayments/ipn")
  async nowPaymentsIpn(
    @Req() req: Request & { rawBody?: string },
    @Headers("x-nowpayments-sig") signature: string | string[] | undefined,
    @Body() body: Record<string, unknown>,
  ) {
    const rawBody = req.rawBody ?? JSON.stringify(body);

    const valid = this.nowPaymentsService.verifyIpnSignature(
      rawBody,
      signature,
    );

    if (!valid) {
      return {
        ok: false,
        error: "invalid_ipn_signature",
      };
    }

    return this.paymentProcessingService.handleNowPaymentsIpn(body);
  }

  @Post("payment/manual-confirm")
  async manualConfirmPayment(@Body() body: { paymentId: string }) {
    if (!body.paymentId) {
      return {
        ok: false,
        error: "missing_payment_id",
      };
    }

    return this.paymentProcessingService.confirmPaymentAndActivate(
      body.paymentId,
      "manual_confirm",
      {
        sourceEndpoint: "POST /api/funded/payment/manual-confirm",
      },
    );
  }

  @Post("payment/nowpayments/reconcile")
  async reconcileNowPaymentsPayment(@Body() body: { paymentId: string }) {
    if (!body.paymentId) {
      return {
        ok: false,
        error: "missing_payment_id",
      };
    }

    return this.paymentProcessingService.reconcileNowPaymentsPayment(
      body.paymentId,
    );
  }

  @Get("payment/status")
  async paymentStatus(@Query("paymentId") paymentId?: string) {
    if (!paymentId) {
      return {
        ok: false,
        error: "missing_payment_id",
      };
    }

    return this.paymentProcessingService.getPaymentStatus(paymentId);
  }

  @Get("affiliate/my-stats")
  async affiliateMyStats(@Query("ref") ref?: string) {
    return this.affiliatePayoutService.myStats(ref ?? "");
  }

  @Get("affiliate/payouts")
  async affiliatePayouts(@Query("ref") ref?: string) {
    return this.affiliatePayoutService.listPayouts(ref ?? "");
  }

  @Post("affiliate/payout/request")
  async requestAffiliatePayout(@Body() body: AffiliatePayoutRequestBody) {
    return this.affiliatePayoutService.requestPayout({
      ref: body.ref ?? "",
      method: body.method,
      notes: body.notes,
    });
  }

  @Post("affiliate/payout/approve")
  async approveAffiliatePayout(@Body() body: AffiliatePayoutAdminBody) {
    return this.affiliatePayoutService.approvePayout({
      payoutId: body.payoutId ?? "",
      reviewerId: body.reviewerId,
      notes: body.notes,
    });
  }

  @Post("affiliate/payout/pay")
  async payAffiliatePayout(@Body() body: AffiliatePayoutAdminBody) {
    return this.affiliatePayoutService.payPayout({
      payoutId: body.payoutId ?? "",
      reviewerId: body.reviewerId,
      method: body.method,
      reference: body.reference,
      notes: body.notes,
    });
  }

  @Post("affiliate/payout/reject")
  async rejectAffiliatePayout(@Body() body: AffiliatePayoutAdminBody) {
    return this.affiliatePayoutService.rejectPayout({
      payoutId: body.payoutId ?? "",
      reviewerId: body.reviewerId,
      notes: body.notes,
    });
  }

  @Get("affiliate/summary")
  async affiliateSummary() {
    const [
      total,
      pending,
      approved,
      payoutRequested,
      paid,
      fraudNone,
      fraudReview,
      fraudBlocked,
    ] = await Promise.all([
      this.prisma.affiliateCommission.aggregate({
        _sum: { amount: true },
        _count: { id: true },
      }),
      this.prisma.affiliateCommission.aggregate({
        where: { status: "pending" },
        _sum: { amount: true },
        _count: { id: true },
      }),
      this.prisma.affiliateCommission.aggregate({
        where: { status: "approved" },
        _sum: { amount: true },
        _count: { id: true },
      }),
      this.prisma.affiliateCommission.aggregate({
        where: { status: "payout_requested" },
        _sum: { amount: true },
        _count: { id: true },
      }),
      this.prisma.affiliateCommission.aggregate({
        where: { status: "paid" },
        _sum: { amount: true },
        _count: { id: true },
      }),
      this.prisma.affiliateCommission.aggregate({
        where: { fraudFlag: "none" },
        _sum: { amount: true },
        _count: { id: true },
      }),
      this.prisma.affiliateCommission.aggregate({
        where: { fraudFlag: "review" },
        _sum: { amount: true },
        _count: { id: true },
      }),
      this.prisma.affiliateCommission.aggregate({
        where: { fraudFlag: "blocked" },
        _sum: { amount: true },
        _count: { id: true },
      }),
    ]);

    return {
      ok: true,
      summary: {
        totalCommissions: String(total._sum.amount ?? 0),
        totalCount: total._count.id,
        pendingCommissions: String(pending._sum.amount ?? 0),
        pendingCount: pending._count.id,
        approvedCommissions: String(approved._sum.amount ?? 0),
        approvedCount: approved._count.id,
        payoutRequestedCommissions: String(payoutRequested._sum.amount ?? 0),
        payoutRequestedCount: payoutRequested._count.id,
        paidCommissions: String(paid._sum.amount ?? 0),
        paidCount: paid._count.id,
        fraudNoneCommissions: String(fraudNone._sum.amount ?? 0),
        fraudNoneCount: fraudNone._count.id,
        fraudReviewCommissions: String(fraudReview._sum.amount ?? 0),
        fraudReviewCount: fraudReview._count.id,
        fraudBlockedCommissions: String(fraudBlocked._sum.amount ?? 0),
        fraudBlockedCount: fraudBlocked._count.id,
      },
    };
  }

  @Get("affiliate/leaderboard")
  async affiliateLeaderboard() {
    const rows = await this.prisma.affiliateCommission.groupBy({
      by: ["affiliateId", "ref"],
      _sum: { amount: true },
      _count: { id: true },
      orderBy: {
        _sum: {
          amount: "desc",
        },
      },
      take: 20,
    });

    return {
      ok: true,
      affiliates: rows.map((row) => ({
        affiliateId: row.affiliateId,
        ref: row.ref,
        totalCommissions: String(row._sum.amount ?? 0),
        conversions: row._count.id,
      })),
    };
  }

  @Get("public/activity")
  async publicActivity() {
    const accounts = await this.prisma.challengeAccount.findMany({
      orderBy: { updatedAt: "desc" },
      take: 12,
      include: {
        challenge: {
          select: {
            name: true,
            slug: true,
          },
        },
        payoutRequests: {
          orderBy: { updatedAt: "desc" },
          take: 1,
          select: {
            status: true,
            requestedAmount: true,
            currency: true,
            updatedAt: true,
          },
        },
      },
    });

    const items = accounts.map((account) => {
      const payout = account.payoutRequests?.[0];
      const planName = account.challenge?.name ?? "Velmenora Challenge";

      let label = `${planName} account created`;
      let type = "challenge";

      if (account.status === "active") {
        label = `${planName} account is active`;
        type = "active";
      }

      if (account.status === "under_review") {
        label = `${planName} account submitted for review`;
        type = "review";
      }

      if (account.status === "failed") {
        label = `${planName} account closed after rule review`;
        type = "rules";
      }

      if (account.status === "payout_requested") {
        label = `${planName} reward request submitted`;
        type = "reward";
      }

      if (account.status === "payout_approved") {
        label = `${planName} reward approved after review`;
        type = "reward";
      }

      if (account.status === "payout_paid") {
        label = `${planName} reward marked as paid`;
        type = "reward";
      }

      if (payout?.status === "approved") {
        label = `${planName} reward approved`;
        type = "reward";
      }

      if (payout?.status === "paid") {
        label = `${planName} reward paid`;
        type = "reward";
      }

      return {
        id: account.id,
        type,
        label,
        plan: planName,
        status: account.status,
        updatedAt: account.updatedAt,
      };
    });

    return {
      ok: true,
      items,
    };
  }

  @Post("account/:id/payout/request")
  async requestPayout(
    @Param("id") id: string,
    @Body() body: RequestPayoutBody,
  ) {
    return this.payoutRequestService.requestPayout({
      challengeAccountId: id,
      requestedAmount: body.requestedAmount,
    });
  }
}
