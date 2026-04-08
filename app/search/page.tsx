import { Suspense } from "react";
import SearchClient from "./SearchClient";

/* 🔥 Always dynamic (search queries change) */
export const dynamic = "force-dynamic";

export default function Page() {
    return (
        <Suspense
            fallback={
                <div className="p-10 text-center text-white">
                    🔎 Loading search results...
                </div>
            }
        >
            <SearchClient />
        </Suspense>
    );
}