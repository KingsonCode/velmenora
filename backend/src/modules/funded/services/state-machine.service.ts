import { BadRequestException, Injectable } from "@nestjs/common";

@Injectable()
export class StateMachineService {
  private readonly transitions: Record<string, string[]> = {
    pending_payment: ["payment_confirmed", "cancelled"],
    payment_confirmed: ["assigned", "active", "cancelled"],
    assigned: ["active", "cancelled"],
    active: ["active", "under_review", "failed", "suspended"],
    under_review: ["under_review", "passed", "failed", "suspended"],
    passed: ["payout_pending"],
    payout_pending: ["payout_approved", "payout_rejected"],
    payout_approved: ["payout_paid"],
    payout_paid: [],
    payout_rejected: [],
    failed: [],
    suspended: ["active", "cancelled"],
    cancelled: [],
  };

  canTransition(from: string, to: string) {
    if (from === to) return true;
    return this.transitions[from]?.includes(to) ?? false;
  }

  enforce(from: string, to: string) {
    if (!this.canTransition(from, to)) {
      throw new BadRequestException(`Invalid transition: ${from} -> ${to}`);
    }
  }
}
