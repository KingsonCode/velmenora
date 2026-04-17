// lib/blog/countryRegistry.ts

export type BlogCountry = {
    name: string;
    slug: string;
};

export const BLOG_COUNTRIES: BlogCountry[] = [
    { name: "Tanzania", slug: "tanzania" },
    { name: "Kenya", slug: "kenya" },
    { name: "Uganda", slug: "uganda" },
    { name: "Nigeria", slug: "nigeria" },
    { name: "Ghana", slug: "ghana" },
    { name: "South Africa", slug: "south-africa" },
    { name: "Egypt", slug: "egypt" },
    { name: "Morocco", slug: "morocco" },
    { name: "Ethiopia", slug: "ethiopia" },
    { name: "Rwanda", slug: "rwanda" },
    { name: "Zambia", slug: "zambia" },
    { name: "Malawi", slug: "malawi" },
    { name: "Namibia", slug: "namibia" },
    { name: "Botswana", slug: "botswana" },
    { name: "Algeria", slug: "algeria" },

    { name: "India", slug: "india" },
    { name: "Pakistan", slug: "pakistan" },
    { name: "Bangladesh", slug: "bangladesh" },
    { name: "Sri Lanka", slug: "sri-lanka" },
    { name: "Nepal", slug: "nepal" },

    { name: "Indonesia", slug: "indonesia" },
    { name: "Philippines", slug: "philippines" },
    { name: "Vietnam", slug: "vietnam" },
    { name: "Thailand", slug: "thailand" },
    { name: "Malaysia", slug: "malaysia" },
    { name: "Singapore", slug: "singapore" },

    { name: "United Arab Emirates", slug: "united-arab-emirates" },
    { name: "Saudi Arabia", slug: "saudi-arabia" },
    { name: "Qatar", slug: "qatar" },
    { name: "Kuwait", slug: "kuwait" },
    { name: "Oman", slug: "oman" },

    { name: "Turkey", slug: "turkey" },

    { name: "Germany", slug: "germany" },
    { name: "France", slug: "france" },
    { name: "Italy", slug: "italy" },
    { name: "Spain", slug: "spain" },
    { name: "Netherlands", slug: "netherlands" },
    { name: "Sweden", slug: "sweden" },
    { name: "Norway", slug: "norway" },
    { name: "Poland", slug: "poland" },

    { name: "United Kingdom", slug: "united-kingdom" },
    { name: "Australia", slug: "australia" },
    { name: "Canada", slug: "canada" },
    { name: "United States", slug: "united-states" },

    { name: "Brazil", slug: "brazil" },
    { name: "Mexico", slug: "mexico" },
    { name: "Colombia", slug: "colombia" },
    { name: "Argentina", slug: "argentina" },
    { name: "Chile", slug: "chile" },
];

export function getBlogCountryBySlug(slug: string): BlogCountry | null {
    return BLOG_COUNTRIES.find((country) => country.slug === slug) || null;
}