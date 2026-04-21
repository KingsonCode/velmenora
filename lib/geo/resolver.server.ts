// Server-only geo resolver wrapper.
// Do not import this file into client components or shared browser code.

import { headers, cookies } from "next/headers";
import { resolveGeo, type AnyRequest, type GeoResult } from "./resolver";
import type { CountryCode } from "./countries";

type ServerGeoResult = Omit<GeoResult, "source"> & {
    source: GeoResult["source"] | "server";
};

async function getServerRequestLike(): Promise<AnyRequest> {
    const h = await headers();
    const c = await cookies();

    return {
        headers: {
            get: (key: string) => h.get(key),
        },
        cookies: {
            get: (key: string) => {
                const item = c.get(key);
                return item ? { value: item.value } : undefined;
            },
        },
    };
}

export async function resolveGeoFromServer(): Promise<ServerGeoResult> {
    const reqLike = await getServerRequestLike();
    const result = resolveGeo(reqLike);

    return {
        ...result,
        source: result.source === "fallback" ? "server" : result.source,
    } as ServerGeoResult;
}

export async function resolveCountry(): Promise<CountryCode | "GLOBAL"> {
    const geo = await resolveGeoFromServer();
    return geo.country ?? "GLOBAL";
}

export async function resolveRegionLabel(): Promise<string> {
    const geo = await resolveGeoFromServer();
    return geo.meta?.name || geo.country || "your region";
}