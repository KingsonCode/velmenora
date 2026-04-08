// lib/brokers.ts

export type BrokerConfig = {
    name: string;
    slug: string;
    url: string;
    active: boolean;
};

export const brokers: Record<string, BrokerConfig> = {
    exness: {
        name: "Exness",
        slug: "exness",
        url: "https://one.exnessonelink.com/a/tmodpmod",
        active: true,
    },
    xm: {
        name: "XM",
        slug: "xm",
        url: "https://affs.click/eJwMj",
        active: true,
    },
};