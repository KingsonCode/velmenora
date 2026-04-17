import type { Broker } from "@/lib/types/broker";

export const BROKERS: Broker[] = [
    {
        name: "Exness",
        slug: "exness",
        logo: "/logos/exness.png",

        affiliate: {
            default: "https://one.exnessonelink.com/boarding/sign-up/303589/a/tmodpmod",
        },

        rating: 4.8,
        priority: 10,
        active: true,

        category: ["FOREX", "CRYPTO"],
        features: ["LOW_SPREAD", "FAST_EXECUTION", "INSTANT_WITHDRAWALS"],
        payments: ["MPESA", "BANK", "CARD", "CRYPTO"],

        countries: ["TZ", "KE", "UG"],
        regions: ["AFRICA", "GLOBAL"],
    },

    {
        name: "XM",
        slug: "xm",
        logo: "/logos/xm.png",

        affiliate: {
            default: "https://affs.click/eJwMj",
        },

        rating: 4.6,
        priority: 9,
        active: true,

        category: ["FOREX"],
        features: ["BONUSES", "BEGINNER_FRIENDLY"],
        payments: ["MPESA", "BANK", "CARD"],

        countries: ["TZ", "NG", "ZA"],
        regions: ["AFRICA", "GLOBAL"],
    },

    {
        name: "Deriv",
        slug: "deriv",
        logo: "/logos/deriv.png",

        affiliate: {
            default:
                "https://deriv.partners/rx?sidc=EF79F0A5-C511-47CB-8066-2A21ADA18FA7&utm_campaign=dynamicworks&utm_medium=affiliate&utm_source=CU319241",
        },

        rating: 4.7,
        priority: 9,
        active: true,

        category: ["FOREX", "CFD"],
        features: ["FAST_EXECUTION", "BEGINNER_FRIENDLY"],
        payments: ["MPESA", "BANK", "CRYPTO"],

        countries: ["TZ", "KE", "UG"],
        regions: ["AFRICA", "GLOBAL"],
    },

    {
        name: "Hantec Markets",
        slug: "hantec",
        logo: "/logos/hantec.png",

        affiliate: {
            default: "https://go.hmarkets.com/visit/?bta=35859&brand=hmarkets",
        },

        rating: 4.4,
        priority: 8,
        active: true,

        category: ["FOREX"],
        features: ["FAST_EXECUTION"],
        payments: ["BANK", "CARD"],

        countries: ["TZ", "KE"],
        regions: ["AFRICA"],
    },

    {
        name: "Octa",
        slug: "octa",
        logo: "/logos/octa.png",

        affiliate: {
            default: "https://clickto.trade/biBQonuoIgI?ib=47807441",
        },

        rating: 4.5,
        priority: 8,
        active: true,

        category: ["FOREX"],
        features: ["COPY_TRADING", "BEGINNER_FRIENDLY"],
        payments: ["MPESA", "BANK"],

        countries: ["TZ", "KE", "NG"],
        regions: ["AFRICA"],
    },

    {
        name: "AXI",
        slug: "axi",
        logo: "/logos/axi.png",

        affiliate: {
            default:
                "https://records.axiaffiliates.com/visit/?bta=42694&brand=axitrader",
        },

        rating: 4.5,
        priority: 7,
        active: true,

        category: ["FOREX"],
        features: ["LOW_SPREAD"],
        payments: ["BANK", "CARD"],

        regions: ["GLOBAL"],
    },

    {
        name: "AvaTrade",
        slug: "avatrade",
        logo: "/logos/avatrade.png",

        affiliate: {
            default:
                "https://www.avatrade.com/trading-account/?p=Webtrader&tag=220422",
        },

        rating: 4.6,
        priority: 7,
        active: true,

        category: ["FOREX", "CFD"],
        features: ["BEGINNER_FRIENDLY"],
        payments: ["CARD", "BANK"],

        regions: ["GLOBAL"],
    },

    {
        name: "RoboForex",
        slug: "roboforex",
        logo: "/logos/roboforex.png",

        affiliate: {
            default: "https://my.roboforex.com/?a=couzb",
        },

        rating: 4.4,
        priority: 6,
        active: true,

        category: ["FOREX"],
        features: ["BONUSES"],
        payments: ["BANK", "CARD"],

        regions: ["GLOBAL"],
    },

    {
        name: "Tickmill",
        slug: "tickmill",
        logo: "/logos/tickmill.png",

        affiliate: {
            default:
                "https://my.tickmill.com/?utm_campaign=ib_link&utm_content=IB75242421&utm_medium=ibdashboardrlw&utm_source=link",
        },

        rating: 4.6,
        priority: 7,
        active: true,

        category: ["FOREX"],
        features: ["LOW_SPREAD", "FAST_EXECUTION"],
        payments: ["BANK", "CARD"],

        regions: ["GLOBAL"],
    },

    {
        name: "Pepperstone",
        slug: "pepperstone",
        logo: "/logos/pepperstone.png",

        affiliate: {
            default:
                "https://pepperstone.com/global/go/refer-a-friend/?locale=en&promo_type=RAF&utm_source=557957",
        },

        rating: 4.7,
        priority: 7,
        active: true,

        category: ["FOREX"],
        features: ["RAZOR_ACCOUNT", "LOW_SPREAD"],
        payments: ["BANK", "CARD"],

        regions: ["GLOBAL"],
    },

    {
        name: "FxPro",
        slug: "fxpro",
        logo: "/logos/fxpro.png",

        affiliate: {
            default: "https://www.fxpro.com/?ib=2oWicYtJK",
        },

        rating: 4.5,
        priority: 6,
        active: true,

        category: ["FOREX"],
        features: ["FAST_EXECUTION"],
        payments: ["BANK", "CARD"],

        regions: ["GLOBAL"],
    },

    {
        name: "IC Markets",
        slug: "icmarkets",
        logo: "/logos/icmarkets.png",

        affiliate: {
            default:
                "https://icmarkets.com/trading-accounts/overview/?camp=91420",
        },

        rating: 4.8,
        priority: 8,
        active: true,

        category: ["FOREX"],
        features: ["RAW_SPREAD", "LOW_SPREAD"],
        payments: ["BANK", "CARD"],

        regions: ["GLOBAL"],
    },
];