import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { AffiliateMembershipService } from './services/affiliate-membership.service';

@Controller('funded/affiliate')
export class AffiliateMeController {
  constructor(private readonly affiliateMembership: AffiliateMembershipService) {}

  @Post('apply')
  apply(@Req() req: any, @Body() body: any) {
    return this.affiliateMembership.apply(req, body);
  }

  @Get('me')
  me(@Req() req: any) {
    return this.affiliateMembership.me(req);
  }

  @Get('me/stats')
  stats(@Req() req: any) {
    return this.affiliateMembership.stats(req);
  }

  @Get('me/payouts')
  payouts(@Req() req: any) {
    return this.affiliateMembership.payouts(req);
  }

  @Post('me/payout/request')
  requestPayout(@Req() req: any, @Body() body: any) {
    return this.affiliateMembership.requestPayout(req, body);
  }
}
