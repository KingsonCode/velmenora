import { Injectable, Logger } from '@nestjs/common';

type ApprovalEmailInput = {
  to: string;
  displayName?: string | null;
  affiliateCode: string;
  commissionRatePct: unknown;
};

function appBaseUrl() {
  return (
    process.env.APP_BASE_URL ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    'https://velmenora.com'
  ).replace(/\/$/, '');
}

function emailFrom() {
  return (
    process.env.EMAIL_FROM ||
    process.env.AFFILIATE_FROM_EMAIL ||
    'Velmenora Affiliate Program <affiliate@velmenora.com>'
  );
}

@Injectable()
export class AffiliateNotificationService {
  private readonly logger = new Logger(AffiliateNotificationService.name);

  async sendApprovalEmail(input: ApprovalEmailInput) {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      this.logger.warn('RESEND_API_KEY is not configured. Skipping affiliate approval email.');
      return { ok: false, skipped: true, reason: 'resend_api_key_missing' };
    }

    const baseUrl = appBaseUrl();
    const dashboardUrl = `${baseUrl}/affiliate/sign-in`;
    const referralUrl = `${baseUrl}/funded?ref=${encodeURIComponent(input.affiliateCode)}`;
    const signInUrl = `${baseUrl}/sign-in`;
    const forgotPasswordUrl = `${baseUrl}/forgot-password`;

    const partnerName = input.displayName || 'Velmenora Partner';
    const rate = Number(input.commissionRatePct ?? 0);

    const subject = 'Your Velmenora Affiliate Account Has Been Approved';

    const html = `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827;max-width:680px;margin:0 auto;padding:24px;">
        <h1 style="margin:0 0 16px;font-size:28px;">Your affiliate account is approved</h1>
        <p>Hello ${partnerName},</p>
        <p>Your Velmenora affiliate application has been approved. Your affiliate dashboard and referral link are now active.</p>

        <div style="background:#f3f4f6;border-radius:16px;padding:18px;margin:22px 0;">
          <p style="margin:0 0 8px;"><strong>Affiliate code:</strong> ${input.affiliateCode}</p>
          <p style="margin:0 0 8px;"><strong>Commission rate:</strong> ${Number.isFinite(rate) ? `${rate}%` : 'Active'}</p>
          <p style="margin:0;"><strong>Referral link:</strong><br><a href="${referralUrl}">${referralUrl}</a></p>
        </div>

        <p>
          <a href="${dashboardUrl}" style="display:inline-block;background:#10b981;color:#000;text-decoration:none;font-weight:700;padding:14px 20px;border-radius:12px;">
            Open Affiliate Dashboard
          </a>
        </p>

        <p><strong>Useful links</strong></p>
        <ul>
          <li>Affiliate dashboard: <a href="${dashboardUrl}">${dashboardUrl}</a></li>
          <li>Sign in: <a href="${signInUrl}">${signInUrl}</a></li>
          <li>Forgot password: <a href="${forgotPasswordUrl}">${forgotPasswordUrl}</a></li>
        </ul>

        <p style="color:#6b7280;font-size:14px;">
          Do not share your account password. Velmenora will never ask for your password by email.
        </p>
      </div>
    `;

    const text = [
      `Hello ${partnerName},`,
      '',
      'Your Velmenora affiliate application has been approved.',
      '',
      `Affiliate code: ${input.affiliateCode}`,
      `Commission rate: ${Number.isFinite(rate) ? `${rate}%` : 'Active'}`,
      `Referral link: ${referralUrl}`,
      '',
      `Dashboard: ${dashboardUrl}`,
      `Sign in: ${signInUrl}`,
      `Forgot password: ${forgotPasswordUrl}`,
      '',
      'Do not share your account password. Velmenora will never ask for your password by email.',
    ].join('\n');

    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: emailFrom(),
          to: [input.to],
          subject,
          html,
          text,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        this.logger.error(
          `Affiliate approval email failed: ${res.status} ${JSON.stringify(data)}`,
        );
        return { ok: false, status: res.status, data };
      }

      this.logger.log(`Affiliate approval email sent to ${input.to}`);
      return { ok: true, data };
    } catch (error) {
      this.logger.error('Affiliate approval email exception', error as Error);
      return { ok: false, error: 'email_exception' };
    }
  }
}
