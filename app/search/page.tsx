// app/search/page.tsx

import { Suspense } from "react";
import SearchClient from "./SearchClient";

/* 🔥 OPTIONAL: make it dynamic (recommended for search) */
export const dynamic = "force-dynamic";

export default function Page() {
    return (
        <Suspense fallback={<div className="p-10 text-center">Loading search...</div>}>
            <SearchClient />
        </Suspense>
    );
}