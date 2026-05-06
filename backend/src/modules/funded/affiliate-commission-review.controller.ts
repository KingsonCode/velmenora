import {
  Body,
  Controller,
  Get,
  Headers,
  Inject,
  Param,
  Post,
  Query,
} from "@nestjs/common";

import { AffiliateCommissionReviewService } from "./services/affiliate-commission-review.service";
import { assertAdminSecret } from "./security/admin-secret";

type ReviewBody = {
  reviewerId?: string;
  notes?: string;
  rejectionReason?: string;
};

@Controller("funded/admin/affiliate/commissions")
export class AffiliateCommissionReviewController {
  constructor(
    @Inject(AffiliateCommissionReviewService)
    private readonly reviewService: AffiliateCommissionReviewService,
  ) {}

  @Get()
  async list(
    @Query("status") status?: string,
    @Query("fraudFlag") fraudFlag?: string,
    @Query("ref") ref?: string,
    @Query("take") take?: string,
  ) {
    return this.reviewService.list({
      status,
      fraudFlag,
      ref,
      take: take ? Number(take) : undefined,
    });
  }

  @Post(":id/approve")
  async approve(
    @Headers("x-admin-secret") adminSecret: string | undefined,
    @Param("id") id: string,
    @Body() body: ReviewBody,
  ) {
    assertAdminSecret(adminSecret);

    return this.reviewService.approve({
      commissionId: id,
      reviewerId: body.reviewerId ?? "",
      notes: body.notes,
    });
  }

  @Post(":id/reject")
  async reject(
    @Headers("x-admin-secret") adminSecret: string | undefined,
    @Param("id") id: string,
    @Body() body: ReviewBody,
  ) {
    assertAdminSecret(adminSecret);

    return this.reviewService.reject({
      commissionId: id,
      reviewerId: body.reviewerId ?? "",
      rejectionReason: body.rejectionReason ?? body.notes,
    });
  }
}
