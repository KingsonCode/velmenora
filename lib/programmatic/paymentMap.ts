export type PaymentMethod =
    | "mpesa"
    | "tigopesa"
    | "airtel-money"
    | "bank"
    | "card"
    | "mobile-money"
    | "crypto"
    | "eft"
    | "upi"
    | "bkash"
    | "nagad";

export const COUNTRY_PAYMENT_MAP: Record<string, PaymentMethod[]> = {
    tanzania: ["mpesa", "tigopesa", "airtel-money", "bank", "card"],
    kenya: ["mpesa", "bank", "card"],
    uganda: ["bank", "card", "mobile-money"],
    nigeria: ["bank", "card", "crypto"],
    ghana: ["mobile-money", "bank", "card"],
    "south-africa": ["bank", "card", "eft"],
    india: ["upi", "bank", "card"],
    pakistan: ["bank", "card"],
    bangladesh: ["bkash", "nagad", "bank", "card"],
    uae: ["bank", "card"],
    "saudi-arabia": ["bank", "card"],
};