export type Template = {
    type: string;
    pattern: string;
};

export const templates: Template[] = [
    {
        type: "best-brokers",
        pattern: "best forex brokers in {country}",
    },
    {
        type: "legality",
        pattern: "is forex trading legal in {country}",
    },
    {
        type: "how-to",
        pattern: "how to start forex trading in {country}",
    },
    {
        type: "payments",
        pattern: "forex brokers with mpesa in {country}",
    },
    {
        type: "low-spread",
        pattern: "low spread forex brokers in {country}",
    },
];