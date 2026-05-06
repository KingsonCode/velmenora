import {
  Body,
  Controller,
  Headers,
  HttpCode,
  Inject,
  Param,
  Post,
} from "@nestjs/common";
import { MetricsOrchestrator } from "./orchestrators/metrics-orchestrator.service";
import { assertAdminSecret } from "./security/admin-secret";

@Controller("funded/account")
export class MetricsController {
  constructor(
    @Inject(MetricsOrchestrator)
    private readonly orchestrator: MetricsOrchestrator,
  ) {}

  @Post(":id/metrics")
  @HttpCode(200) // ✅ muhimu: avoid 201 for rejected metrics
  async ingestMetrics(
    @Headers("x-admin-secret") adminSecret: string | undefined,
    @Param("id") accountId: string,
    @Body() body: any,
  ) {
    assertAdminSecret(adminSecret);

    return this.orchestrator.process(accountId, body);
  }
}
