export type Country = {
    name: string;
    slug: string;
    code: string; // ISO (important for future APIs)
    region: "africa" | "europe" | "asia" | "latam" | "middle-east" | "global";
    tier: 1 | 2 | 3 | 4 | 5;
};

export const countries: Country[] = [

    // 🌍 TIER 1 (GLOBAL HIGH VALUE)
    { name: "United States", slug: "usa", code: "US", region: "global", tier: 1 },
    { name: "United Kingdom", slug: "uk", code: "GB", region: "europe", tier: 1 },
    { name: "Canada", slug: "canada", code: "CA", region: "global", tier: 1 },
    { name: "Australia", slug: "australia", code: "AU", region: "global", tier: 1 },
    { name: "Germany", slug: "germany", code: "DE", region: "europe", tier: 1 },
    { name: "France", slug: "france", code: "FR", region: "europe", tier: 1 },
    { name: "Netherlands", slug: "netherlands", code: "NL", region: "europe", tier: 1 },
    { name: "Sweden", slug: "sweden", code: "SE", region: "europe", tier: 1 },
    { name: "Norway", slug: "norway", code: "NO", region: "europe", tier: 1 },
    { name: "Denmark", slug: "denmark", code: "DK", region: "europe", tier: 1 },

    // 🌍 TIER 2 (AFRICA 🔥)
    { name: "South Africa", slug: "south-africa", code: "ZA", region: "africa", tier: 2 },
    { name: "Nigeria", slug: "nigeria", code: "NG", region: "africa", tier: 2 },
    { name: "Kenya", slug: "kenya", code: "KE", region: "africa", tier: 2 },
    { name: "Ghana", slug: "ghana", code: "GH", region: "africa", tier: 2 },
    { name: "Uganda", slug: "uganda", code: "UG", region: "africa", tier: 2 },
    { name: "Tanzania", slug: "tanzania", code: "TZ", region: "africa", tier: 2 },
    { name: "Rwanda", slug: "rwanda", code: "RW", region: "africa", tier: 2 },
    { name: "Zambia", slug: "zambia", code: "ZM", region: "africa", tier: 2 },
    { name: "Zimbabwe", slug: "zimbabwe", code: "ZW", region: "africa", tier: 2 },
    { name: "Botswana", slug: "botswana", code: "BW", region: "africa", tier: 2 },

    // 🌏 TIER 3 (ASIA)
    { name: "India", slug: "india", code: "IN", region: "asia", tier: 3 },
    { name: "Pakistan", slug: "pakistan", code: "PK", region: "asia", tier: 3 },
    { name: "Bangladesh", slug: "bangladesh", code: "BD", region: "asia", tier: 3 },
    { name: "Indonesia", slug: "indonesia", code: "ID", region: "asia", tier: 3 },
    { name: "Malaysia", slug: "malaysia", code: "MY", region: "asia", tier: 3 },
    { name: "Philippines", slug: "philippines", code: "PH", region: "asia", tier: 3 },
    { name: "Thailand", slug: "thailand", code: "TH", region: "asia", tier: 3 },
    { name: "Vietnam", slug: "vietnam", code: "VN", region: "asia", tier: 3 },
    { name: "Singapore", slug: "singapore", code: "SG", region: "asia", tier: 3 },
    { name: "UAE", slug: "uae", code: "AE", region: "middle-east", tier: 3 },

    // 🌎 TIER 4 (LATAM)
    { name: "Brazil", slug: "brazil", code: "BR", region: "latam", tier: 4 },
    { name: "Mexico", slug: "mexico", code: "MX", region: "latam", tier: 4 },
    { name: "Argentina", slug: "argentina", code: "AR", region: "latam", tier: 4 },
    { name: "Chile", slug: "chile", code: "CL", region: "latam", tier: 4 },
    { name: "Colombia", slug: "colombia", code: "CO", region: "latam", tier: 4 },
    { name: "Peru", slug: "peru", code: "PE", region: "latam", tier: 4 },

    // 🌐 TIER 5 (EXTRA SCALE)
    { name: "Turkey", slug: "turkey", code: "TR", region: "middle-east", tier: 5 },
    { name: "Egypt", slug: "egypt", code: "EG", region: "africa", tier: 5 },
    { name: "Morocco", slug: "morocco", code: "MA", region: "africa", tier: 5 },
    { name: "Algeria", slug: "algeria", code: "DZ", region: "africa", tier: 5 },
    { name: "Saudi Arabia", slug: "saudi-arabia", code: "SA", region: "middle-east", tier: 5 },
    { name: "Qatar", slug: "qatar", code: "QA", region: "middle-east", tier: 5 },
    { name: "Kuwait", slug: "kuwait", code: "KW", region: "middle-east", tier: 5 },
    { name: "Japan", slug: "japan", code: "JP", region: "asia", tier: 5 },
    { name: "South Korea", slug: "south-korea", code: "KR", region: "asia", tier: 5 },
    { name: "Spain", slug: "spain", code: "ES", region: "europe", tier: 5 },
    { name: "Italy", slug: "italy", code: "IT", region: "europe", tier: 5 },
    { name: "Poland", slug: "poland", code: "PL", region: "europe", tier: 5 },
    { name: "Belgium", slug: "belgium", code: "BE", region: "europe", tier: 5 },
    { name: "Switzerland", slug: "switzerland", code: "CH", region: "europe", tier: 5 },
];