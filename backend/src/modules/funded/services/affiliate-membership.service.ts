import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

type RequestLike = {
  user?: {
    id?: string;
    userId?: string;
    sub?: string;
    email?: string;
    role?: string;
  };
  headers?: Record<string, string | string[] | undefined>;
};

function headerValue(req: RequestLike, name: string): string | undefined {
  const raw = req.headers?.[name] ?? req.headers?.[name.toLowerCase()];
  if (Array.isArray(raw)) return raw[0];
  return raw;
}

function slugifyCode(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
    .slice(0, 24);
}

@Injectable()
export class AffiliateMembershipService {
  constructor(private readonly prisma: PrismaService) {}

  async requireCurrentUser(req: RequestLike) {
    const authUserId =
      req.user?.id ||
      req.user?.userId ||
      req.user?.sub ||
      headerValue(req, 'x-member-user-id');

    const authEmail = req.user?.email || headerValue(req, 'x-member-email');

    if (authUserId) {
      const user = await this.prisma.user.findUnique({ where: { id: authUserId } });
      if (user) return user;
    }

    if (authEmail) {
      const user = await this.prisma.user.findFirst({ where: { email: authEmail } });
      if (user) return user;
    }

    throw new UnauthorizedException('member_auth_required');
  }

  async requireAdmin(req: RequestLike) {
    const role = req.user?.role || headerValue(req, 'x-member-role');
    const adminSecret = headerValue(req, 'x-admin-secret');

    if (role === 'admin' || role === 'super_admin') return true;

    if (
      process.env.ADMIN_API_KEY &&
      adminSecret &&
      adminSecret === process.env.ADMIN_API_KEY
    ) {
      return true;
    }

    throw new ForbiddenException('admin_required');
  }

  async apply(req: RequestLike, body: any) {
    const user = await this.requireCurrentUser(req);

    const existingProfile = await this.prisma.affiliateProfile.findUnique({
      where: { userId: user.id },
    });

    if (existingProfile?.isActive) {
      return {
        ok: true,
        alreadyApproved: true,
        affiliate: existingProfile,
      };
    }

    const displayName =
      typeof body?.displayName === 'string' && body.displayName.trim()
        ? body.displayName.trim().slice(0, 80)
        : user.fullName || user.email || 'Velmenora Partner';

    const audience =
      typeof body?.audience === 'string' && body.audience.trim()
        ? body.audience.trim().slice(0, 500)
        : null;

    const reason =
      typeof body?.reason === 'string' && body.reason.trim()
        ? body.reason.trim().slice(0, 1000)
        : null;

    const channelsJson =
      body?.channels && typeof body.channels === 'object' ? body.channels : undefined;

    const application = await this.prisma.affiliateApplication.upsert({
      where: { userId: user.id },
      update: {
        displayName,
        audience,
        reason,
        channelsJson,
        status: 'pending',
        rejectionReason: null,
      },
      create: {
        userId: user.id,
        displayName,
        audience,
        reason,
        channelsJson,
      },
    });

    return { ok: true, application };
  }

  async me(req: RequestLike) {
    const user = await this.requireCurrentUser(req);

    const application = await this.prisma.affiliateApplication.findUnique({
      where: { userId: user.id },
    });

    const affiliate = await this.prisma.affiliateProfile.findUnique({
      where: { userId: user.id },
    });

    return {
      ok: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.fullName,
      },
      application,
      affiliate,
      approved: Boolean(affiliate?.isActive),
    };
  }

  async stats(req: RequestLike) {
    const user = await this.requireCurrentUser(req);
    const affiliate = await this.prisma.affiliateProfile.findUnique({
      where: { userId: user.id },
    });

    if (!affiliate?.isActive) {
      throw new ForbiddenException('affiliate_not_approved');
    }

    const payouts = await this.prisma.affiliatePayoutRequest.groupBy({
      by: ['status'],
      where: { affiliateProfileId: affiliate.id },
      _sum: { amount: true },
      _count: { id: true },
    });

    return {
      ok: true,
      affiliate,
      stats: {
        totalEarned: affiliate.totalEarned,
        totalPaid: affiliate.totalPaid,
        payoutBalance: affiliate.payoutBalance,
        commissionRatePct: affiliate.commissionRatePct,
        payouts,
      },
    };
  }

  async payouts(req: RequestLike) {
    const user = await this.requireCurrentUser(req);
    const affiliate = await this.prisma.affiliateProfile.findUnique({
      where: { userId: user.id },
    });

    if (!affiliate?.isActive) {
      throw new ForbiddenException('affiliate_not_approved');
    }

    const payouts = await this.prisma.affiliatePayoutRequest.findMany({
      where: { affiliateProfileId: affiliate.id },
      orderBy: { requestedAt: 'desc' },
      take: 50,
    });

    return { ok: true, payouts };
  }

  async requestPayout(req: RequestLike, body: any) {
    const user = await this.requireCurrentUser(req);
    const affiliate = await this.prisma.affiliateProfile.findUnique({
      where: { userId: user.id },
    });

    if (!affiliate?.isActive) {
      throw new ForbiddenException('affiliate_not_approved');
    }

    const amount = Number(body?.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new BadRequestException('invalid_payout_amount');
    }

    const balance = Number(affiliate.payoutBalance);
    if (amount > balance) {
      throw new BadRequestException('amount_exceeds_available_balance');
    }

    const payoutMethod =
      typeof body?.payoutMethod === 'string' ? body.payoutMethod.slice(0, 80) : null;

    const payoutDetailsJson =
      body?.payoutDetails && typeof body.payoutDetails === 'object'
        ? body.payoutDetails
        : undefined;

    const payout = await this.prisma.affiliatePayoutRequest.create({
      data: {
        affiliateProfileId: affiliate.id,
        userId: user.id,
        amount,
        currency: 'TZS',
        payoutMethod,
        payoutDetailsJson,
      },
    });

    return { ok: true, payout };
  }

  async adminApplications(req: RequestLike) {
    await this.requireAdmin(req);

    const applications = await this.prisma.affiliateApplication.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: {
        user: true,
      },
    });

    return { ok: true, applications };
  }

  async approveApplication(req: RequestLike, applicationId: string, body: any) {
    await this.requireAdmin(req);

    const app = await this.prisma.affiliateApplication.findUnique({
      where: { id: applicationId },
      include: { user: true },
    });

    if (!app) throw new NotFoundException('application_not_found');

    const preferredCode =
      typeof body?.affiliateCode === 'string' && body.affiliateCode.trim()
        ? body.affiliateCode.trim()
        : app.displayName || app.user.email || app.userId;

    let baseCode = slugifyCode(preferredCode) || `partner${Date.now()}`;
    let code = baseCode;
    let suffix = 1;

    while (await this.prisma.affiliateProfile.findUnique({ where: { affiliateCode: code } })) {
      suffix += 1;
      code = `${baseCode}${suffix}`;
    }

    const commissionRatePct =
      body?.commissionRatePct !== undefined ? Number(body.commissionRatePct) : 20;

    if (!Number.isFinite(commissionRatePct) || commissionRatePct < 0 || commissionRatePct > 80) {
      throw new BadRequestException('invalid_commission_rate');
    }

    const result = await this.prisma.$transaction(async (tx: any) => {
      const updatedApplication = await tx.affiliateApplication.update({
        where: { id: applicationId },
        data: {
          status: 'approved',
          reviewedAt: new Date(),
          reviewedBy: req.user?.id || req.user?.email || 'admin',
          rejectionReason: null,
        },
      });

      const profile = await tx.affiliateProfile.upsert({
        where: { userId: app.userId },
        update: {
          isActive: true,
          displayName: app.displayName,
          commissionRatePct,
          applicationId: app.id,
        },
        create: {
          userId: app.userId,
          applicationId: app.id,
          affiliateCode: code,
          displayName: app.displayName,
          commissionRatePct,
        },
      });

      return { application: updatedApplication, affiliate: profile };
    });

    return { ok: true, ...result };
  }

  async rejectApplication(req: RequestLike, applicationId: string, body: any) {
    await this.requireAdmin(req);

    const reason =
      typeof body?.reason === 'string' && body.reason.trim()
        ? body.reason.trim().slice(0, 1000)
        : 'Application rejected';

    const application = await this.prisma.affiliateApplication.update({
      where: { id: applicationId },
      data: {
        status: 'rejected',
        reviewedAt: new Date(),
        reviewedBy: req.user?.id || req.user?.email || 'admin',
        rejectionReason: reason,
      },
    });

    return { ok: true, application };
  }
}
