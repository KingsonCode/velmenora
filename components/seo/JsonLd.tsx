import type { JsonLd as JsonLdType } from "@/lib/content";

type JsonLdProps = {
    data?: JsonLdType | null;
};

export default function JsonLd({ data }: JsonLdProps) {
    if (!data) return null;

    const schemas = Array.isArray(data) ? data : [data];

    if (!schemas.length) return null;

    return (
        <>
            {schemas.map((schema, index) => (
                <script
                    key={`jsonld-${index}`}
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(schema),
                    }}
                />
            ))}
        </>
    );
}