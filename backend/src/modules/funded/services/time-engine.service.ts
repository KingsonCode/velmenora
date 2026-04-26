import { Injectable } from "@nestjs/common";

@Injectable()
export class TimeEngineService {
  isExpired(account: any) {
    const startedAt = account.startedAt;

    const maxDurationDays = Number(
      account.maxDurationDays ?? account.challenge?.maxDurationDays ?? 30,
    );

    if (!startedAt) return false;

    const start = new Date(startedAt).getTime();
    const now = Date.now();
    const durationMs = maxDurationDays * 24 * 60 * 60 * 1000;

    return now > start + durationMs;
  }

  getExpiry(account: any) {
    const startedAt = account.startedAt;

    const maxDurationDays = Number(
      account.maxDurationDays ?? account.challenge?.maxDurationDays ?? 30,
    );

    if (!startedAt) return null;

    const start = new Date(startedAt).getTime();

    return new Date(start + maxDurationDays * 86400000);
  }
}
