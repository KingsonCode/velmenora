import { Body, Controller, Headers, Inject, Param, Post } from "@nestjs/common";
import { ReviewDecisionService } from "./services/review-decision.service";
import { assertAdminSecret } from "./security/admin-secret";

@Controller("funded/account")
export class ReviewController {
  constructor(
    @Inject(ReviewDecisionService)
    private readonly reviewDecisionService: ReviewDecisionService,
  ) {}

  @Post(":id/review/pass")
  async passAccount(
    @Headers("x-admin-secret") adminSecret: string | undefined,
    @Param("id") accountId: string,
    @Body() body: any,
  ) {
    assertAdminSecret(adminSecret);

    return this.reviewDecisionService.pass(accountId, body);
  }

  @Post(":id/review/fail")
  async failAccount(
    @Headers("x-admin-secret") adminSecret: string | undefined,
    @Param("id") accountId: string,
    @Body() body: any,
  ) {
    assertAdminSecret(adminSecret);

    return this.reviewDecisionService.fail(accountId, body);
  }
}
