import { Body, Controller, Headers, Inject, Param, Post } from "@nestjs/common";
import { PayoutReviewService } from "./services/payout-review.service";
import { PayoutExecutionService } from "./services/payout-execution.service";
import { assertAdminSecret } from "./security/admin-secret";

type ReviewerBody = {
  reviewerId: string;
};

type RejectBody = ReviewerBody & {
  rejectionReason: string;
};

type PayBody = {
  actorUserId: string;
  paymentReference?: string;
};

@Controller("funded/payout")
export class PayoutController {
  constructor(
    @Inject(PayoutReviewService)
    private readonly payoutReviewService: PayoutReviewService,
    @Inject(PayoutExecutionService)
    private readonly payoutExecutionService: PayoutExecutionService,
  ) {}

  @Post(":id/review/start")
  async startReview(
    @Headers("x-admin-secret") adminSecret: string | undefined,
    @Param("id") id: string,
    @Body() body: ReviewerBody,
  ) {
    assertAdminSecret(adminSecret);

    return this.payoutReviewService.startReview({
      payoutRequestId: id,
      reviewerId: body.reviewerId,
    });
  }

  @Post(":id/approve")
  async approve(
    @Headers("x-admin-secret") adminSecret: string | undefined,
    @Param("id") id: string,
    @Body() body: ReviewerBody,
  ) {
    assertAdminSecret(adminSecret);

    return this.payoutReviewService.approve({
      payoutRequestId: id,
      reviewerId: body.reviewerId,
    });
  }

  @Post(":id/reject")
  async reject(
    @Headers("x-admin-secret") adminSecret: string | undefined,
    @Param("id") id: string,
    @Body() body: RejectBody,
  ) {
    assertAdminSecret(adminSecret);

    return this.payoutReviewService.reject({
      payoutRequestId: id,
      reviewerId: body.reviewerId,
      rejectionReason: body.rejectionReason,
    });
  }

  @Post(":id/pay")
  async pay(
    @Headers("x-admin-secret") adminSecret: string | undefined,
    @Param("id") id: string,
    @Body() body: PayBody,
  ) {
    assertAdminSecret(adminSecret);

    return this.payoutExecutionService.markPaid({
      payoutRequestId: id,
      actorUserId: body.actorUserId,
      paymentReference: body.paymentReference,
    });
  }
}
