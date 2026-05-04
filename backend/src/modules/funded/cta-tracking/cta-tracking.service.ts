import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import { PrismaService } from '../../../prisma/prisma.service';

type TrackCtaInput = {
  placement: string;
  label?: string;
  href?: string;
  pagePath?: string;
  referrer?: string;
  userAgent?: string;
  country?: string;
  ip?: string;
};

@Injectable()
export class CtaTrackingService {
  constructor(private readonly prisma: PrismaService) {}

  async track(input: TrackCtaInput) {
    const placement = String(input.placement || '').trim();

    if (!placement) {
      return { ok: false, reason: 'missing_placement' };
    }

    const ipHash = input.ip
      ? createHash('sha256')
          .update(input.ip + (process.env.CTA_TRACKING_SALT || 'velmenora'))
          .digest('hex')
      : null;

    const event = await this.prisma.ctaClickEvent.create({
      data: {
        placement,
        label: input.label || null,
        href: input.href || null,
        pagePath: input.pagePath || null,
        referrer: input.referrer || null,
        userAgent: input.userAgent || null,
        country: input.country || null,
        ipHash,
      },
    });

    return { ok: true, eventId: event.id };
  }

  async summary() {
    const rows = await this.prisma.ctaClickEvent.groupBy({
      by: ['placement'],
      _count: {
        placement: true,
      },
      orderBy: {
        _count: {
          placement: 'desc',
        },
      },
    });

    return {
      ok: true,
      placements: rows.map((row) => ({
        placement: row.placement,
        clicks: row._count.placement,
      })),
    };
  }
}
