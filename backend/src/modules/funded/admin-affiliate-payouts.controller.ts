import { Body, Controller, Get, Headers, Post, Query } from "@nestjs/common";
import { AffiliatePayoutService } from "./services/affiliate-payout.service";
import { assertAdminSecret } from "./security/admin-secret";

type AffiliatePayoutAdminBody = {
  payoutId?: string;
  reviewerId?: string;
  method?: string;
  reference?: string;
  notes?: string;
};

@Controller("funded/admin/affiliate/payouts")
export class AdminAffiliatePayoutsController {
  constructor(private readonly affiliatePayoutService: AffiliatePayoutService) {}

  @Get()
  async list(
    @Headers("x-admin-secret") adminSecret: string | undefined,
    @Query("ref") ref?: string,
  ) {
    assertAdminSecret(adminSecret);

    return this.affiliatePayoutService.adminListPayouts({
      ref,
    });
  }

  @Post("approve")
  async approve(
    @Headers("x-admin-secret") adminSecret: string | undefined,
    @Body() body: AffiliatePayoutAdminBody,
  ) {
    assertAdminSecret(adminSecret);

    return this.affiliatePayoutService.approvePayout({
      payoutId: body.payoutId ?? "",
      reviewerId: body.reviewerId,
      notes: body.notes,
    });
  }

  @Post("pay")
  async pay(
    @Headers("x-admin-secret") adminSecret: string | undefined,
    @Body() body: AffiliatePayoutAdminBody,
  ) {
    assertAdminSecret(adminSecret);

    return this.affiliatePayoutService.payPayout({
      payoutId: body.payoutId ?? "",
      reviewerId: body.reviewerId,
      method: body.method,
      reference: body.reference,
      notes: body.notes,
    });
  }

  @Post("reject")
  async reject(
    @Headers("x-admin-secret") adminSecret: string | undefined,
    @Body() body: AffiliatePayoutAdminBody,
  ) {
    assertAdminSecret(adminSecret);

    return this.affiliatePayoutService.rejectPayout({
      payoutId: body.payoutId ?? "",
      reviewerId: body.reviewerId,
      notes: body.notes,
    });
  }
}
