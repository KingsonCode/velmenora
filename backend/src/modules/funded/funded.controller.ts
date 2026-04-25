import { Body, Controller, Get, Post } from "@nestjs/common";
import { ChallengeLifecycleService } from "./ChallengeLifecycleService";

type ApplyBody = {
  email: string;
  fullName: string;
  phone?: string;
  planSlug: string;
};

@Controller("funded")
export class FundedController {
  constructor(private readonly lifecycle: ChallengeLifecycleService) { }

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
}