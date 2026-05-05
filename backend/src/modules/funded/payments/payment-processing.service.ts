import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Prisma, PaymentProvider, PaymentStatus, ChallengeStatus } from "@prisma/client";
import { PrismaService } from "../../../prisma/prisma.service";
import { calculateFundedAffiliateCommission } from "../affiliates/commission-rules";
import {
  NowPaymentsIpnPayload,
  NowPaymentsService,
} from "./nowpayments.service";

function jsonObject(value: Prisma.JsonValue | null): Prisma.JsonObject {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Prisma.JsonObject;
  }

  return {};
}

@Injectable()
export class PaymentProcessingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly nowPayments: NowPaymentsService,
  ) {}

  async initiateNowPaymentsPayment(challengeAccountId: string) {
    const account = await this.prisma.challengeAccount.findUnique({
      where: { id: challengeAccountId },
      include: {
        user: true,
        challenge: true,
        payments: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    if (!account) {
      throw new NotFoundException("Challenge account not found");
    }

    if (
      account.paymentStatus === PaymentStatus.paid ||
      account.status === ChallengeStatus.active
    ) {
      return {
        ok: true,
        alreadyPaid: true,
        challengeAccount: account,
      };
    }

    const payment = account.payments[0];

    if (!payment) {
      throw new BadRequestException(
        "No payment record found for this challenge account",
      );
    }

    if (payment.status === PaymentStatus.paid) {
      return {
        ok: true,
        alreadyPaid: true,
        challengeAccount: account,
      };
    }

    const backendUrl = process.env.FUNDED_BACKEND_PUBLIC_URL;
    const appUrl = process.env.PUBLIC_APP_URL;

    if (!backendUrl || !appUrl) {
      throw new Error("Missing FUNDED_BACKEND_PUBLIC_URL or PUBLIC_APP_URL");
    }

    const orderId = `VEL-${payment.id}`;

    const invoice = await this.nowPayments.createInvoice({
      priceAmount: Number(payment.amount),
      priceCurrency: payment.currency.toLowerCase(),
      orderId,
      orderDescription: `${account.challenge.name} - Velmenora funded challenge access`,
      ipnCallbackUrl: `${backendUrl}/funded/payment/nowpayments/ipn`,
      successUrl: `${appUrl}/funded/payment/success?paymentId=${payment.id}`,
      cancelUrl: `${appUrl}/funded/payment/cancel?paymentId=${payment.id}`,
    });

    const providerReference = String(invoice.id ?? invoice.invoice_id ?? orderId);

    const updatedPayment = await this.prisma.payment.update({
      where: { id: payment.id },
      data: {
        provider: PaymentProvider.nowpayments,
        providerReference,
        checkoutUrl: invoice.invoice_url,
        rawPayloadJson: {
          ...jsonObject(payment.rawPayloadJson),
          nowpaymentsInvoice: invoice as Prisma.InputJsonValue,
          orderId,
        },
      },
    });

    await this.prisma.auditLog.create({
      data: {
        eventType: "payment_checkout_created",
        entityType: "payment",
        entityId: payment.id,
        metadataJson: {
          source: "nowpayments",
          challengeAccountId: account.id,
          providerReference,
          orderId,
          checkoutUrl: invoice.invoice_url,
        },
      },
    });

    return {
      ok: true,
      provider: "nowpayments",
      payment: updatedPayment,
      checkoutUrl: invoice.invoice_url,
    };
  }

  async handleNowPaymentsIpn(payload: NowPaymentsIpnPayload) {
    const orderId = payload.order_id;

    if (!orderId || !orderId.startsWith("VEL-")) {
      throw new BadRequestException("Invalid NOWPayments order_id");
    }

    const paymentId = orderId.replace("VEL-", "");

    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        challengeAccount: true,
      },
    });

    if (!payment) {
      throw new NotFoundException("Payment not found");
    }

    if (payment.provider !== PaymentProvider.nowpayments) {
      throw new BadRequestException("Payment provider mismatch");
    }

    const providerStatus = String(payload.payment_status ?? "unknown").toLowerCase();

    const paidStatuses = new Set(["confirmed", "sending", "finished"]);
    const failedStatuses = new Set(["failed", "expired", "refunded"]);

    const expectedAmount = Number(payment.amount);
    const actualPriceAmount = Number(payload.price_amount ?? 0);
    const expectedCurrency = payment.currency.toLowerCase();
    const actualPriceCurrency = String(payload.price_currency ?? "").toLowerCase();

    const amountMatches =
      actualPriceAmount === expectedAmount ||
      Math.abs(actualPriceAmount - expectedAmount) < 0.01;

    const currencyMatches = actualPriceCurrency === expectedCurrency;

    if (failedStatuses.has(providerStatus)) {
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: PaymentStatus.failed,
          rawPayloadJson: {
            ...jsonObject(payment.rawPayloadJson),
            lastNowPaymentsIpn: payload as Prisma.InputJsonValue,
          },
        },
      });

      await this.prisma.auditLog.create({
        data: {
          eventType: "payment_failed",
          entityType: "payment",
          entityId: payment.id,
          metadataJson: {
            source: "nowpayments_ipn",
            challengeAccountId: payment.challengeAccountId,
            providerStatus,
            payload: payload as Prisma.InputJsonValue,
          },
        },
      });

      return {
        ok: true,
        paid: false,
        providerStatus,
      };
    }

    if (providerStatus === "partially_paid") {
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: PaymentStatus.manual_review,
          rawPayloadJson: {
            ...jsonObject(payment.rawPayloadJson),
            lastNowPaymentsIpn: payload as Prisma.InputJsonValue,
          },
        },
      });

      await this.prisma.auditLog.create({
        data: {
          eventType: "admin_action",
          entityType: "payment",
          entityId: payment.id,
          metadataJson: {
            source: "nowpayments_ipn",
            action: "payment_partially_paid_manual_review",
            challengeAccountId: payment.challengeAccountId,
            providerStatus,
            expectedAmount,
            actualPriceAmount,
            expectedCurrency,
            actualPriceCurrency,
            actuallyPaid: payload.actually_paid ?? null,
            outcomeAmount: payload.outcome_amount ?? null,
            payCurrency: payload.pay_currency ?? null,
          },
        },
      });

      return {
        ok: true,
        paid: false,
        manualReview: true,
        providerStatus,
      };
    }

    if (!paidStatuses.has(providerStatus)) {
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: {
          rawPayloadJson: {
            ...jsonObject(payment.rawPayloadJson),
            lastNowPaymentsIpn: payload as Prisma.InputJsonValue,
          },
        },
      });

      return {
        ok: true,
        paid: false,
        providerStatus,
      };
    }

    if (!amountMatches || !currencyMatches) {
      await this.prisma.auditLog.create({
        data: {
          eventType: "payment_mismatch_detected",
          entityType: "payment",
          entityId: payment.id,
          metadataJson: {
            source: "nowpayments_ipn",
            expectedAmount,
            actualPriceAmount,
            expectedCurrency,
            actualPriceCurrency,
            providerStatus,
            payload: payload as Prisma.InputJsonValue,
          },
        },
      });

      throw new BadRequestException("Payment amount or currency mismatch");
    }

    const result = await this.prisma.$transaction(async (tx) => {
      const freshPayment = await tx.payment.findUniqueOrThrow({
        where: { id: payment.id },
      });

      const freshAccount = await tx.challengeAccount.findUniqueOrThrow({
        where: { id: payment.challengeAccountId ?? "" },
        include: {
          challenge: {
            select: {
              slug: true,
            },
          },
        },
      });

      if (
        freshPayment.status === PaymentStatus.paid &&
        freshAccount.status === ChallengeStatus.active
      ) {
        return {
          idempotent: true,
          payment: freshPayment,
          challengeAccount: freshAccount,
        };
      }

      const paidPayment = await tx.payment.update({
        where: { id: payment.id },
        data: {
          status: PaymentStatus.paid,
          paidAt: freshPayment.paidAt ?? new Date(),
          rawPayloadJson: {
            ...jsonObject(freshPayment.rawPayloadJson),
            lastNowPaymentsIpn: payload as Prisma.InputJsonValue,
          },
        },
      });

      const activatedAccount = await tx.challengeAccount.update({
        where: { id: freshAccount.id },
        data: {
          paymentStatus: PaymentStatus.paid,
          status: ChallengeStatus.active,
          assignedAt: freshAccount.assignedAt ?? new Date(),
          startedAt: freshAccount.startedAt ?? new Date(),
        },
      });

      if (freshAccount.ref) {
        const affiliate = await tx.affiliate.findFirst({
          where: {
            slug: freshAccount.ref,
            isActive: true,
          },
          select: {
            id: true,
            slug: true,
          },
        });

        const commissionAmount = calculateFundedAffiliateCommission(
          freshAccount.challenge.slug,
        );

        if (affiliate && commissionAmount > 0) {
          await tx.affiliateCommission.upsert({
            where: {
              paymentId: paidPayment.id,
            },
            update: {},
            create: {
              affiliateId: affiliate.id,
              challengeAccountId: freshAccount.id,
              paymentId: paidPayment.id,
              ref: affiliate.slug,
              planSlug: freshAccount.challenge.slug,
              amount: commissionAmount,
              currency: paidPayment.currency,
              status: "approved",
            },
          });
        }
      }

      await tx.auditLog.createMany({
        data: [
          {
            eventType: "payment_received",
            entityType: "payment",
            entityId: payment.id,
            metadataJson: {
              source: "nowpayments_ipn",
              challengeAccountId: freshAccount.id,
              providerStatus,
              paymentId: payload.payment_id ?? null,
              invoiceId: payload.invoice_id ?? null,
              payCurrency: payload.pay_currency ?? null,
              actuallyPaid: payload.actually_paid ?? null,
            },
          },
          {
            eventType: "challenge_started",
            entityType: "challenge_account",
            entityId: freshAccount.id,
            metadataJson: {
              source: "nowpayments_payment",
              paymentId: payment.id,
              previousStatus: freshAccount.status,
              nextStatus: "active",
            },
          },
        ],
      });

      return {
        idempotent: false,
        payment: paidPayment,
        challengeAccount: activatedAccount,
      };
    });

    return {
      ok: true,
      paid: true,
      providerStatus,
      ...result,
    };
  }


  async confirmPaymentAndActivate(
    paymentId: string,
    source: string,
    metadata: Prisma.JsonObject = {},
  ) {
    const result = await this.prisma.$transaction(async (tx) => {
      const freshPayment = await tx.payment.findUniqueOrThrow({
        where: { id: paymentId },
      });

      const freshAccount = await tx.challengeAccount.findUniqueOrThrow({
        where: { id: freshPayment.challengeAccountId ?? "" },
        include: {
          challenge: {
            select: {
              id: true,
              slug: true,
            },
          },
        },
      });

      if (
        freshPayment.status === PaymentStatus.paid &&
        freshAccount.status === ChallengeStatus.active
      ) {
        return {
          idempotent: true,
          payment: freshPayment,
          challengeAccount: freshAccount,
        };
      }

      const paidPayment = await tx.payment.update({
        where: { id: freshPayment.id },
        data: {
          status: PaymentStatus.paid,
          paidAt: freshPayment.paidAt ?? new Date(),
        },
      });

      const activatedAccount = await tx.challengeAccount.update({
        where: { id: freshAccount.id },
        data: {
          paymentStatus: PaymentStatus.paid,
          status: ChallengeStatus.active,
          assignedAt: freshAccount.assignedAt ?? new Date(),
          startedAt: freshAccount.startedAt ?? new Date(),
        },
      });

      if (freshAccount.ref) {
        const affiliate = await tx.affiliate.findFirst({
          where: {
            slug: freshAccount.ref,
            isActive: true,
          },
          select: {
            id: true,
            slug: true,
          },
        });

        const commissionAmount = calculateFundedAffiliateCommission(
          freshAccount.challenge.slug,
        );

        if (affiliate && commissionAmount > 0) {
          await tx.affiliateCommission.upsert({
            where: {
              paymentId: paidPayment.id,
            },
            update: {},
            create: {
              affiliateId: affiliate.id,
              challengeAccountId: freshAccount.id,
              paymentId: paidPayment.id,
              ref: affiliate.slug,
              planSlug: freshAccount.challenge.slug,
              amount: commissionAmount,
              currency: paidPayment.currency,
              status: "approved",
            },
          });
        }
      }

      await tx.auditLog.createMany({
        data: [
          {
            eventType: "payment_received",
            entityType: "payment",
            entityId: paidPayment.id,
            metadataJson: {
              source,
              challengeAccountId: freshAccount.id,
              ...metadata,
            },
          },
          {
            eventType: "challenge_started",
            entityType: "challenge_account",
            entityId: freshAccount.id,
            metadataJson: {
              source,
              paymentId: paidPayment.id,
              previousStatus: freshAccount.status,
              nextStatus: "active",
            },
          },
        ],
      });

      return {
        idempotent: false,
        payment: paidPayment,
        challengeAccount: activatedAccount,
      };
    });

    return {
      ok: true,
      paid: true,
      ...result,
    };
  }


  async reconcileNowPaymentsPayment(paymentId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      throw new NotFoundException("Payment not found");
    }

    if (payment.provider !== PaymentProvider.nowpayments) {
      throw new BadRequestException("Payment provider mismatch");
    }

    if (!payment.providerReference) {
      throw new BadRequestException("Missing NOWPayments provider reference");
    }

    const providerStatus = await this.nowPayments.getPaymentStatus(
      payment.providerReference,
    );

    return this.handleNowPaymentsIpn({
      ...providerStatus,
      order_id: `VEL-${payment.id}`,
      price_amount: Number(payment.amount),
      price_currency: payment.currency,
    });
  }

  async getPaymentStatus(paymentId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        challengeAccount: true,
      },
    });

    if (!payment) {
      throw new NotFoundException("Payment not found");
    }

    return {
      ok: true,
      payment,
      paid: payment.status === PaymentStatus.paid,
      challengeAccount: payment.challengeAccount,
    };
  }
}
