type Props = {
    broker: string;
    text?: string;
};

export default function CTAButton({ broker, text }: Props) {
    return (
        <a
            href="https://one.exnessonelink.com/a/tmodpmod"
            target="_blank"
            rel="noopener noreferrer"
            className="cta-button"
        >
            {text || "🚀 Start Trading Now"}
        </a>
    );
}