import { Injectable, Logger } from '@nestjs/common';

type ApprovalEmailInput = {
  to: string;
  displayName?: string | null;
  affiliateCode: string;
  commissionRatePct: unknown;
};

type RejectionEmailInput = {
  to: string;
  displayName?: string | null;
  reason: string;
};

type RetakeDiscountEmailInput = {
  to: string;
  displayName?: string | null;
  planSlug: string;
  code: string;
  percentOff: unknown;
  originalPrice: unknown;
  discountedPrice: unknown;
  currency?: string | null;
  expiresAt: Date | string;
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

function escapeHtml(value: unknown) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

@Injectable()
export class AffiliateNotificationService {
  private readonly logger = new Logger(AffiliateNotificationService.name);

  private async sendEmail(input: {
    to: string;
    subject: string;
    html: string;
    text: string;
    logLabel: string;
  }) {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      this.logger.warn(
        `RESEND_API_KEY is not configured. Skipping ${input.logLabel} email.`,
      );
      return { ok: false, skipped: true, reason: 'resend_api_key_missing' };
    }

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
          subject: input.subject,
          html: input.html,
          text: input.text,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        this.logger.error(
          `${input.logLabel} email failed: ${res.status} ${JSON.stringify(data)}`,
        );
        return { ok: false, status: res.status, data };
      }

      this.logger.log(`${input.logLabel} email sent to ${input.to}`);
      return { ok: true, data };
    } catch (error) {
      this.logger.error(`${input.logLabel} email exception`, error as Error);
      return { ok: false, error: 'email_exception' };
    }
  }

  async sendApprovalEmail(input: ApprovalEmailInput) {
    const baseUrl = appBaseUrl();
    const dashboardUrl = `${baseUrl}/affiliate/sign-in`;
    const referralUrl = `${baseUrl}/funded?ref=${encodeURIComponent(
      input.affiliateCode,
    )}`;
    const signInUrl = `${baseUrl}/sign-in`;
    const forgotPasswordUrl = `${baseUrl}/forgot-password`;

    const partnerName = escapeHtml(input.displayName || 'Velmenora Partner');
    const affiliateCode = escapeHtml(input.affiliateCode);
    const rate = Number(input.commissionRatePct ?? 0);
    const rateLabel = Number.isFinite(rate) ? `${rate}%` : 'Active';

    const subject = 'Your Velmenora Affiliate Account Has Been Approved';

    const html = `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827;max-width:680px;margin:0 auto;padding:24px;">
        <h1 style="margin:0 0 16px;font-size:28px;">Your affiliate account is approved</h1>
        <p>Hello ${partnerName},</p>
        <p>Your Velmenora affiliate application has been approved. Your affiliate dashboard and referral link are now active.</p>

        <div style="background:#f3f4f6;border-radius:16px;padding:18px;margin:22px 0;">
          <p style="margin:0 0 8px;"><strong>Affiliate code:</strong> ${affiliateCode}</p>
          <p style="margin:0 0 8px;"><strong>Commission rate:</strong> ${escapeHtml(rateLabel)}</p>
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
      `Hello ${input.displayName || 'Velmenora Partner'},`,
      '',
      'Your Velmenora affiliate application has been approved.',
      '',
      `Affiliate code: ${input.affiliateCode}`,
      `Commission rate: ${rateLabel}`,
      `Referral link: ${referralUrl}`,
      '',
      `Dashboard: ${dashboardUrl}`,
      `Sign in: ${signInUrl}`,
      `Forgot password: ${forgotPasswordUrl}`,
      '',
      'Do not share your account password. Velmenora will never ask for your password by email.',
    ].join('\n');

    return this.sendEmail({
      to: input.to,
      subject,
      html,
      text,
      logLabel: 'Affiliate approval',
    });
  }

  async sendRejectionEmail(input: RejectionEmailInput) {
    const baseUrl = appBaseUrl();
    const applyUrl = `${baseUrl}/affiliate/apply`;

    const partnerName = escapeHtml(input.displayName || 'Velmenora Partner');
    const reason = escapeHtml(input.reason || 'Application rejected');

    const subject = 'Velmenora Affiliate Application Update';

    const html = `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827;max-width:680px;margin:0 auto;padding:24px;">
        <h1 style="margin:0 0 16px;font-size:28px;">Affiliate application update</h1>
        <p>Hello ${partnerName},</p>
        <p>Thank you for applying to the Velmenora Affiliate Program.</p>
        <p>Your application was not approved at this time.</p>

        <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:16px;padding:18px;margin:22px 0;">
          <p style="margin:0 0 8px;"><strong>Reason:</strong></p>
          <p style="margin:0;">${reason}</p>
        </div>

        <p>You may improve your audience details, promotion plan, or channel information and apply again.</p>

        <p>
          <a href="${applyUrl}" style="display:inline-block;background:#10b981;color:#000;text-decoration:none;font-weight:700;padding:14px 20px;border-radius:12px;">
            Review Affiliate Application
          </a>
        </p>
      </div>
    `;

    const text = [
      `Hello ${input.displayName || 'Velmenora Partner'},`,
      '',
      'Thank you for applying to the Velmenora Affiliate Program.',
      'Your application was not approved at this time.',
      '',
      `Reason: ${input.reason || 'Application rejected'}`,
      '',
      `You may review or apply again here: ${applyUrl}`,
    ].join('\n');

    return this.sendEmail({
      to: input.to,
      subject,
      html,
      text,
      logLabel: 'Affiliate rejection',
    });
  }
  async sendRetakeDiscountEmail(input: RetakeDiscountEmailInput) {
    const baseUrl = appBaseUrl();
    const fundedUrl = `${baseUrl}/funded`;
    const applyUrl = `${baseUrl}/funded/apply?retakeCode=${encodeURIComponent(
      input.code,
    )}`;

    const traderName = escapeHtml(input.displayName || 'Trader');
    const planSlug = escapeHtml(input.planSlug);
    const code = escapeHtml(input.code);
    const currency = escapeHtml(input.currency || 'USD');

    const percent = Number(input.percentOff ?? 0);
    const original = Number(input.originalPrice ?? 0);
    const discounted = Number(input.discountedPrice ?? 0);
    const expiresAt = new Date(input.expiresAt);
    const expiresLabel = Number.isNaN(expiresAt.getTime())
      ? String(input.expiresAt)
      : expiresAt.toUTCString();

    const percentLabel = Number.isFinite(percent) ? `${percent}%` : '20%';
    const originalLabel = Number.isFinite(original)
      ? `${currency} ${original.toFixed(2)}`
      : `${currency} ${input.originalPrice}`;
    const discountedLabel = Number.isFinite(discounted)
      ? `${currency} ${discounted.toFixed(2)}`
      : `${currency} ${input.discountedPrice}`;

    const subject = 'Your Velmenora Retake Discount Is Ready';

    const html = `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827;max-width:680px;margin:0 auto;padding:24px;">
        <h1 style="margin:0 0 16px;font-size:28px;">Your retake discount is ready</h1>
        <p>Hello ${traderName},</p>

        <p>Your Velmenora challenge has ended, but you are eligible for a private retake discount.</p>

        <div style="background:#f3f4f6;border-radius:16px;padding:18px;margin:22px 0;">
          <p style="margin:0 0 8px;"><strong>Plan:</strong> ${planSlug}</p>
          <p style="margin:0 0 8px;"><strong>Discount:</strong> ${escapeHtml(percentLabel)} off</p>
          <p style="margin:0 0 8px;"><strong>Original price:</strong> ${escapeHtml(originalLabel)}</p>
          <p style="margin:0 0 8px;"><strong>Your retake price:</strong> ${escapeHtml(discountedLabel)}</p>
          <p style="margin:0 0 8px;"><strong>Retake code:</strong> <span style="font-family:monospace;font-size:16px;">${code}</span></p>
          <p style="margin:0;"><strong>Valid until:</strong> ${escapeHtml(expiresLabel)}</p>
        </div>

        <p>
          <a href="${applyUrl}" style="display:inline-block;background:#10b981;color:#000;text-decoration:none;font-weight:700;padding:14px 20px;border-radius:12px;">
            Start Retake With Discount
          </a>
        </p>

        <p>If the button does not work, go to <a href="${fundedUrl}">${fundedUrl}</a> and enter your retake code during checkout.</p>

        <p style="color:#6b7280;font-size:14px;">
          This discount is linked to your registered email, valid for one use only, and cannot be transferred.
        </p>
      </div>
    `;

    const text = [
      `Hello ${input.displayName || 'Trader'},`,
      '',
      'Your Velmenora challenge has ended, but you are eligible for a private retake discount.',
      '',
      `Plan: ${input.planSlug}`,
      `Discount: ${percentLabel} off`,
      `Original price: ${originalLabel}`,
      `Your retake price: ${discountedLabel}`,
      `Retake code: ${input.code}`,
      `Valid until: ${expiresLabel}`,
      '',
      `Start retake: ${applyUrl}`,
      '',
      'This discount is linked to your registered email, valid for one use only, and cannot be transferred.',
    ].join('\n');

    return this.sendEmail({
      to: input.to,
      subject,
      html,
      text,
      logLabel: 'Retake discount',
    });
  }

}
