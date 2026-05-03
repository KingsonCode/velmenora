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
import { PaymentProcessingService } from "./payments/payment-processing.service";
import { NowPaymentsService } from "./payments/nowpayments.service";
import { PrismaService } from "../../prisma/prisma.service";

type ApplyBody = {
  email: string;
  fullName: string;
  phone?: string;
  planSlug: string;
};

type RequestPayoutBody = {
  requestedAmount?: number;
};


@Controller("funded")
export class FundedController {
  constructor(
    @Inject(ChallengeLifecycleService)
    private readonly lifecycle: ChallengeLifecycleService,
    @Inject(PayoutRequestService)
    private readonly payoutRequestService: PayoutRequestService,
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
  async apply(@Body() body: ApplyBody) {
    return this.lifecycle.apply({
      email: body.email,
      fullName: body.fullName,
      phone: body.phone,
      planSlug: body.planSlug,
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
