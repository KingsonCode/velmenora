import { Controller, Get, Inject } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Controller("health")
export class HealthController {
  constructor(
    @Inject(PrismaService)
    private readonly prisma: PrismaService,
  ) { }

  @Get()
  async getHealth() {
    await this.prisma.$queryRaw`SELECT 1`;

    return {
      ok: true,
      service: "funded-backend",
      db: "up",
      timestamp: new Date().toISOString(),
    };
  }
}