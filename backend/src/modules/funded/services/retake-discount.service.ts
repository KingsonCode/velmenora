import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';

type RetakePlan = '10K' | '25K' | '50K';

const RETAKE_DISCOUNT_PERCENT = new Prisma.Decimal(20);

const RETAKE_PRICE_TABLE: Record<RetakePlan, { original: Prisma.Decimal; discounted: Prisma.Decimal }> = {
  '10K': {
    original: new Prisma.Decimal(35),
    discounted: new Prisma.Decimal(28),
  },
  '25K': {
    original: new Prisma.Decimal(79),
    discounted: new Prisma.Decimal(63.20),
  },
  '50K': {
    original: new Prisma.Decimal(149),
    discounted: new Prisma.Decimal(119.20),
  },
};

@Injectable()
export class RetakeDiscountService {
  constructor(private readonly prisma: PrismaService) {}

  getPolicy() {
    return {
      percentOff: RETAKE_DISCOUNT_PERCENT.toNumber(),
      plans: {
        '10K': { originalPrice: 35, discountedPrice: 28 },
        '25K': { originalPrice: 79, discountedPrice: 63.20 },
        '50K': { originalPrice: 149, discountedPrice: 119.20 },
      },
    };
  }

  normalizePlan(planSlug: string): RetakePlan {
    const raw = String(planSlug || '').toLowerCase();

    if (raw.includes('10k') || raw.includes('10000')) return '10K';
    if (raw.includes('25k') || raw.includes('25000')) return '25K';
    if (raw.includes('50k') || raw.includes('50000')) return '50K';

    throw new BadRequestException(`Unsupported retake discount plan: ${planSlug}`);
  }

  private generateCode(plan: RetakePlan): string {
    const random = Math.random().toString(36).slice(2, 8).toUpperCase();
    const stamp = Date.now().toString(36).slice(-5).toUpperCase();
    return `RETAKE-${plan}-${stamp}${random}`;
  }

  private async resolveEmailAndUser(account: any): Promise<{ email: string; userId?: string | null }> {
    const directEmail =
      account?.email ||
      account?.userEmail ||
      account?.customerEmail ||
      account?.traderEmail;

    const userId = account?.userId || account?.user_id || null;

    if (directEmail) {
      return { email: String(directEmail).trim().toLowerCase(), userId };
    }

    if (userId && (this.prisma as any).user?.findUnique) {
      const user = await (this.prisma as any).user.findUnique({
        where: { id: userId },
        select: { id: true, email: true },
      });

      if (user?.email) {
        return { email: String(user.email).trim().toLowerCase(), userId: user.id };
      }
    }

    throw new BadRequestException('Could not resolve customer email for failed challenge account.');
  }

  private async resolvePlanSlug(account: any): Promise<string> {
    const directPlan =
      account?.planSlug ||
      account?.plan ||
      account?.challengePlan ||
      account?.challengeSlug ||
      account?.accountSize;

    if (directPlan) return String(directPlan);

    const challengeId = account?.challengeId || account?.challenge_id;
    if (challengeId && (this.prisma as any).fundedChallenge?.findUnique) {
      const challenge = await (this.prisma as any).fundedChallenge.findUnique({
        where: { id: challengeId },
      });

      const challengePlan =
        challenge?.slug ||
        challenge?.planSlug ||
        challenge?.name ||
        challenge?.accountSize;

      if (challengePlan) return String(challengePlan);
    }

    throw new BadRequestException('Could not resolve plan slug for failed challenge account.');
  }

  async createForFailedAccount(challengeAccountId: string) {
    const existing = await (this.prisma as any).retakeDiscount.findUnique({
      where: { challengeAccountId },
    });

    if (existing) return existing;

    const account = await (this.prisma as any).challengeAccount.findUnique({
      where: { id: challengeAccountId },
    });

    if (!account) {
      throw new NotFoundException('Challenge account not found.');
    }

    const status = String(account.status || '').toLowerCase();
    if (status !== 'failed') {
      throw new BadRequestException('Retake discount can only be created for failed challenge accounts.');
    }

    const { email, userId } = await this.resolveEmailAndUser(account);
    const planSlug = await this.resolvePlanSlug(account);
    const plan = this.normalizePlan(planSlug);
    const price = RETAKE_PRICE_TABLE[plan];

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    return (this.prisma as any).retakeDiscount.create({
      data: {
        email,
        userId,
        challengeAccountId,
        challengeId: account.challengeId || account.challenge_id || null,
        planSlug: plan,
        code: this.generateCode(plan),
        percentOff: RETAKE_DISCOUNT_PERCENT,
        originalPrice: price.original,
        discountedPrice: price.discounted,
        currency: 'USD',
        status: 'active',
        expiresAt,
      },
    });
  }

  async validateForCheckout(params: { code: string; email: string; planSlug: string }) {
    const code = String(params.code || '').trim().toUpperCase();
    const email = String(params.email || '').trim().toLowerCase();
    const requestedPlan = this.normalizePlan(params.planSlug);

    const discount = await (this.prisma as any).retakeDiscount.findUnique({
      where: { code },
    });

    if (!discount) throw new NotFoundException('Retake discount code not found.');

    if (discount.status !== 'active') {
      throw new BadRequestException('Retake discount is no longer active.');
    }

    if (new Date(discount.expiresAt).getTime() < Date.now()) {
      await (this.prisma as any).retakeDiscount.update({
        where: { id: discount.id },
        data: { status: 'expired' },
      });

      throw new BadRequestException('Retake discount has expired.');
    }

    if (String(discount.email).toLowerCase() !== email) {
      throw new BadRequestException('Retake discount does not belong to this email.');
    }

    if (String(discount.planSlug).toUpperCase() !== requestedPlan) {
      throw new BadRequestException('Retake discount is not valid for this plan.');
    }

    return {
      id: discount.id,
      code: discount.code,
      email: discount.email,
      planSlug: discount.planSlug,
      percentOff: Number(discount.percentOff),
      originalPrice: Number(discount.originalPrice),
      discountedPrice: Number(discount.discountedPrice),
      currency: discount.currency,
      expiresAt: discount.expiresAt,
    };
  }

  async markUsed(code: string) {
    return (this.prisma as any).retakeDiscount.update({
      where: { code: String(code || '').trim().toUpperCase() },
      data: {
        status: 'used',
        usedAt: new Date(),
      },
    });
  }

  async expireOldDiscounts() {
    return (this.prisma as any).retakeDiscount.updateMany({
      where: {
        status: 'active',
        expiresAt: { lt: new Date() },
      },
      data: { status: 'expired' },
    });
  }
}
