import { Body, Controller, Get, Headers, Param, Post, Req } from "@nestjs/common";
import { AffiliateMembershipService } from "./services/affiliate-membership.service";
import { assertAdminSecret } from "./security/admin-secret";

@Controller("funded/admin/affiliate/applications")
export class AdminAffiliateApplicationsController {
  constructor(private readonly affiliateMembership: AffiliateMembershipService) {}

  @Get()
  applications(@Req() req: any) {
    return this.affiliateMembership.adminApplications(req);
  }

  @Post(":id/approve")
  approve(
    @Headers("x-admin-secret") adminSecret: string | undefined,
    @Req() req: any,
    @Param("id") id: string,
    @Body() body: any,
  ) {
    assertAdminSecret(adminSecret);

    return this.affiliateMembership.approveApplication(req, id, body);
  }

  @Post(":id/reject")
  reject(
    @Headers("x-admin-secret") adminSecret: string | undefined,
    @Req() req: any,
    @Param("id") id: string,
    @Body() body: any,
  ) {
    assertAdminSecret(adminSecret);

    return this.affiliateMembership.rejectApplication(req, id, body);
  }
}
