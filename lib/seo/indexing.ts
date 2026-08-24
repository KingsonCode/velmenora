export const IS_INDEXABLE_DEPLOYMENT =
    process.env.NODE_ENV === "production" &&
    process.env.VERCEL_ENV !== "preview" &&
    process.env.VERCEL_ENV !== "development";
