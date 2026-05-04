import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { CtaTrackingService } from './cta-tracking.service';

@Controller('funded/cta')
export class CtaTrackingController {
  constructor(private readonly ctaTracking: CtaTrackingService) {}

  @Post('track')
  async track(@Body() body: any, @Req() req: any) {
    const headers = req.headers || {};

    const forwardedFor = headers['x-forwarded-for'];
    const ip =
      (typeof forwardedFor === 'string' ? forwardedFor.split(',')?.[0]?.trim() : null) ||
      headers['x-real-ip'] ||
      req.ip ||
      null;

    return this.ctaTracking.track({
      placement: body?.placement,
      label: body?.label,
      href: body?.href,
      pagePath: body?.pagePath,
      referrer: headers.referer || body?.referrer,
      userAgent: headers['user-agent'],
      country:
        headers['x-vercel-ip-country'] ||
        headers['cf-ipcountry'] ||
        headers['x-geo-country'] ||
        body?.country,
      ip,
    });
  }

  @Get('summary')
  async summary() {
    return this.ctaTracking.summary();
  }
}
