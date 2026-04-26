import { Body, Controller, Inject, Param, Post } from "@nestjs/common";
import { ReviewDecisionService } from "./services/review-decision.service";

@Controller("funded/account")
export class ReviewController {
  constructor(
    @Inject(ReviewDecisionService)
    private readonly reviewDecisionService: ReviewDecisionService,
  ) {}

  @Post(":id/review/pass")
  async passAccount(@Param("id") accountId: string, @Body() body: any) {
    return this.reviewDecisionService.pass(accountId, body);
  }

  @Post(":id/review/fail")
  async failAccount(@Param("id") accountId: string, @Body() body: any) {
    return this.reviewDecisionService.fail(accountId, body);
  }
}
