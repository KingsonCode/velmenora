import {
  Controller,
  Get,
  Headers,
  Inject,
  UnauthorizedException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { getSessionFromCookie } from "../auth/auth-utils";

@Controller("member")
export class MemberController {
  constructor(
    @Inject(PrismaService)
    private readonly prisma: PrismaService,
  ) {}

  @Get("challenges")
  async challenges(@Headers("cookie") cookieHeader?: string) {
    const session = getSessionFromCookie(cookieHeader);

    if (!session) {
      throw new UnauthorizedException("Unauthorized");
    }

    const accounts = await this.prisma.challengeAccount.findMany({
      where: {
        userId: session.userId,
      },
      orderBy: { createdAt: "desc" },
      take: 50,
      select: {
        id: true,
        status: true,
        paymentStatus: true,
        initialBalance: true,
        currentBalance: true,
        currentEquity: true,
        totalPnl: true,
        tradingDaysCount: true,
        passedAt: true,
        failedAt: true,
        failureReason: true,
        createdAt: true,
        updatedAt: true,
        challenge: {
          select: {
            id: true,
            slug: true,
            name: true,
            feeAmount: true,
            currency: true,
            virtualBalance: true,
            rewardAmount: true,
            profitTargetPct: true,
            maxDailyLossPct: true,
            maxOverallDrawdownPct: true,
            minTradingDays: true,
          },
        },
        brokerAccounts: {
          orderBy: { createdAt: "desc" },
          take: 1,
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
        payoutRequests: {
          orderBy: { requestedAt: "desc" },
          take: 1,
          select: {
            id: true,
            requestedAmount: true,
            currency: true,
            status: true,
            requestedAt: true,
            reviewedAt: true,
            paidAt: true,
            rejectionReason: true,
          },
        },
      },
    });

    return {
      ok: true,
      accounts,
    };
  }
}
