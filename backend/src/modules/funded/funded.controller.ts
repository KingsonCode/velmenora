import { Body, Controller, Get, Inject, Param, Post } from "@nestjs/common";
import { ChallengeLifecycleService } from "./ChallengeLifecycleService";
import { PayoutRequestService } from "./services/payout-request.service";

type ApplyBody = {
  email: string;
  fullName: string;
  phone?: string;
  planSlug: string;
};

type RequestPayoutBody = {
  requestedAmount?: number;
};

@Controller("funded")
export class FundedController {
  constructor(
    @Inject(ChallengeLifecycleService)
    private readonly lifecycle: ChallengeLifecycleService,
    @Inject(PayoutRequestService)
    private readonly payoutRequestService: PayoutRequestService,
  ) {}

  @Get("ping")
  async ping() {
    return {
      ok: true,
      module: "funded",
      timestamp: new Date().toISOString(),
    };
  }

  @Post("apply")
  async apply(@Body() body: ApplyBody) {
    return this.lifecycle.apply({
      email: body.email,
      fullName: body.fullName,
      phone: body.phone,
      planSlug: body.planSlug,
    });
  }

  @Post("account/:id/payout/request")
  async requestPayout(
    @Param("id") id: string,
    @Body() body: RequestPayoutBody,
  ) {
    return this.payoutRequestService.requestPayout({
      challengeAccountId: id,
      requestedAmount: body.requestedAmount,
    });
  }
}
