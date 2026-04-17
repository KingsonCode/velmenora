type SchemaMarkupProps = {
    data: Record<string, any>;
};

export default function SchemaMarkup({ data }: SchemaMarkupProps) {
    if (!data) return null;

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(data),
            }}
        />
    );
}