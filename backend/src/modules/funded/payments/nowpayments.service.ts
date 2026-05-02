import { Injectable } from "@nestjs/common";
import * as crypto from "crypto";

export type NowPaymentsInvoiceResponse = {
  id?: string;
  invoice_id?: string;
  order_id?: string;
  order_description?: string;
  price_amount?: number;
  price_currency?: string;
  ipn_callback_url?: string;
  invoice_url?: string;
  success_url?: string;
  cancel_url?: string;
  created_at?: string;
  updated_at?: string;
};

export type NowPaymentsIpnPayload = {
  payment_id?: string | number;
  invoice_id?: string | number;
  payment_status?: string;
  pay_address?: string;
  price_amount?: number;
  price_currency?: string;
  pay_amount?: number;
  actually_paid?: number;
  pay_currency?: string;
  order_id?: string;
  order_description?: string;
  purchase_id?: string;
  outcome_amount?: number;
  outcome_currency?: string;
};

@Injectable()
export class NowPaymentsService {
  private readonly baseUrl = "https://api.nowpayments.io/v1";

  private get apiKey(): string {
    const key = process.env.NOWPAYMENTS_API_KEY;

    if (!key) {
      throw new Error("Missing NOWPAYMENTS_API_KEY");
    }

    return key;
  }

  private get ipnSecret(): string {
    const secret = process.env.NOWPAYMENTS_IPN_SECRET;

    if (!secret) {
      throw new Error("Missing NOWPAYMENTS_IPN_SECRET");
    }

    return secret;
  }

  async createInvoice(input: {
    priceAmount: number;
    priceCurrency: string;
    orderId: string;
    orderDescription: string;
    successUrl: string;
    cancelUrl: string;
    ipnCallbackUrl: string;
  }): Promise<NowPaymentsInvoiceResponse> {
    const res = await fetch(`${this.baseUrl}/invoice`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.apiKey,
      },
      body: JSON.stringify({
        price_amount: input.priceAmount,
        price_currency: input.priceCurrency,
        order_id: input.orderId,
        order_description: input.orderDescription,
        ipn_callback_url: input.ipnCallbackUrl,
        success_url: input.successUrl,
        cancel_url: input.cancelUrl,
      }),
    });

    const data = (await res.json()) as NowPaymentsInvoiceResponse & {
      message?: string;
      errors?: unknown;
    };

    if (!res.ok || !data.invoice_url) {
      throw new Error(`NOWPayments invoice creation failed: ${JSON.stringify(data)}`);
    }

    return data;
  }


  async getPaymentStatus(paymentId: string): Promise<NowPaymentsIpnPayload> {
    const res = await fetch(
      `${this.baseUrl}/payment/${encodeURIComponent(paymentId)}`,
      {
        method: "GET",
        headers: {
          "x-api-key": this.apiKey,
        },
      },
    );

    const data = (await res.json()) as NowPaymentsIpnPayload & {
      message?: string;
      errors?: unknown;
    };

    if (!res.ok) {
      throw new Error(`NOWPayments status check failed: ${JSON.stringify(data)}`);
    }

    return data;
  }

  verifyIpnSignature(
    rawBody: string,
    signature: string | string[] | undefined,
  ): boolean {
    const receivedSignature = Array.isArray(signature) ? signature[0] : signature;

    if (!receivedSignature) {
      return false;
    }

    const expectedSignature = crypto
      .createHmac("sha512", this.ipnSecret)
      .update(rawBody)
      .digest("hex");

    const expected = Buffer.from(expectedSignature, "hex");
    const received = Buffer.from(receivedSignature, "hex");

    if (expected.length !== received.length) {
      return false;
    }

    return crypto.timingSafeEqual(expected, received);
  }
}
