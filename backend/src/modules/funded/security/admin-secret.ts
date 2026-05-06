import { UnauthorizedException } from "@nestjs/common";

export function assertAdminSecret(adminSecret: string | undefined): void {
  const expectedSecret = process.env.FUNDED_ADMIN_SECRET;

  if (!expectedSecret || adminSecret !== expectedSecret) {
    throw new UnauthorizedException("Invalid admin secret");
  }
}
