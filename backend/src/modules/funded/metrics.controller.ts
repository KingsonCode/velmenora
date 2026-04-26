import {
  Body,
  Controller,
  HttpCode,
  Inject,
  Param,
  Post,
} from "@nestjs/common";
import { MetricsOrchestrator } from "./orchestrators/metrics-orchestrator.service";

@Controller("funded/account")
export class MetricsController {
  constructor(
    @Inject(MetricsOrchestrator)
    private readonly orchestrator: MetricsOrchestrator,
  ) {}

  @Post(":id/metrics")
  @HttpCode(200) // ✅ muhimu: avoid 201 for rejected metrics
  async ingestMetrics(
    @Param("id") accountId: string,
    @Body() body: any,
  ) {
    return this.orchestrator.process(accountId, body);
  }
}
