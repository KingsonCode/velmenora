import { Body, Controller, Inject, Param, Post } from "@nestjs/common";
import { PayoutReviewService } from "./services/payout-review.service";
import { PayoutExecutionService } from "./services/payout-execution.service";

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
  async startReview(@Param("id") id: string, @Body() body: ReviewerBody) {
    return this.payoutReviewService.startReview({
      payoutRequestId: id,
      reviewerId: body.reviewerId,
    });
  }

  @Post(":id/approve")
  async approve(@Param("id") id: string, @Body() body: ReviewerBody) {
    return this.payoutReviewService.approve({
      payoutRequestId: id,
      reviewerId: body.reviewerId,
    });
  }

  @Post(":id/reject")
  async reject(@Param("id") id: string, @Body() body: RejectBody) {
    return this.payoutReviewService.reject({
      payoutRequestId: id,
      reviewerId: body.reviewerId,
      rejectionReason: body.rejectionReason,
    });
  }

  @Post(":id/pay")
  async pay(@Param("id") id: string, @Body() body: PayBody) {
    return this.payoutExecutionService.markPaid({
      payoutRequestId: id,
      actorUserId: body.actorUserId,
      paymentReference: body.paymentReference,
    });
  }
}
