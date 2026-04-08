import { Suspense } from "react";
import ExplorerClient from "./ExplorerClient";

export const dynamic = "force-dynamic";

export default function ExplorePage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center text-white">
                    🔄 Loading brokers...
                </div>
            }
        >
            <ExplorerClient />
        </Suspense>
    );
}