import { Suspense } from "react";
import FundedApplyClient from "./_components/FundedApplyClient";

export default function ApplyPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-black px-6 py-12 text-white">
          <div className="mx-auto max-w-md">
            <div className="rounded-lg border border-gray-800 bg-gray-900 p-4 text-sm text-gray-300">
              Loading challenge application...
            </div>
          </div>
        </main>
      }
    >
      <FundedApplyClient />
    </Suspense>
  );
}
