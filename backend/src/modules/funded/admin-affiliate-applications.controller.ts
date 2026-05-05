import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { AffiliateMembershipService } from './services/affiliate-membership.service';

@Controller('funded/admin/affiliate/applications')
export class AdminAffiliateApplicationsController {
  constructor(private readonly affiliateMembership: AffiliateMembershipService) {}

  @Get()
  applications(@Req() req: any) {
    return this.affiliateMembership.adminApplications(req);
  }

  @Post(':id/approve')
  approve(@Req() req: any, @Param('id') id: string, @Body() body: any) {
    return this.affiliateMembership.approveApplication(req, id, body);
  }

  @Post(':id/reject')
  reject(@Req() req: any, @Param('id') id: string, @Body() body: any) {
    return this.affiliateMembership.rejectApplication(req, id, body);
  }
}
