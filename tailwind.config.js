/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}"
    ],

    theme: {
        extend: {
            colors: {
                primary: "#2563eb",
                secondary: "#06b6d4",
                accent: "#9333ea",
                dark: "#0b0f19"
            },

            backgroundImage: {
                "hero-forex": "url('/images/forex-hero.jpg')",
                "gradient-primary": "linear-gradient(135deg, #2563eb, #06b6d4)",
                "gradient-accent": "linear-gradient(135deg, #9333ea, #2563eb)",
                "gradient-dark": "linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.95))"
            },

            boxShadow: {
                glow: "0 0 40px rgba(59,130,246,0.4)",
                "glow-lg": "0 0 80px rgba(59,130,246,0.35)",
                soft: "0 10px 30px rgba(0,0,0,0.25)",
                card: "0 4px 20px rgba(0,0,0,0.3)",
                premium: "0 10px 40px rgba(0,0,0,0.4), 0 0 20px rgba(59,130,246,0.2)"
            },

            borderRadius: {
                xl2: "1.25rem",
                xl3: "1.5rem"
            },

            backdropBlur: {
                xs: "2px"
            },

            fontSize: {
                "hero-sm": ["2.5rem", { lineHeight: "3rem" }],
                "hero-md": ["3.5rem", { lineHeight: "4rem" }],
                "hero-lg": ["4.5rem", { lineHeight: "5rem" }]
            },

            keyframes: {
                float: {
                    "0%, 100%": { transform: "translateY(0px)" },
                    "50%": { transform: "translateY(-10px)" }
                },
                fadeUp: {
                    "0%": { opacity: 0, transform: "translateY(20px)" },
                    "100%": { opacity: 1, transform: "translateY(0)" }
                },
                glowPulse: {
                    "0%, 100%": { boxShadow: "0 0 20px rgba(59,130,246,0.3)" },
                    "50%": { boxShadow: "0 0 40px rgba(59,130,246,0.6)" }
                }
            },

            animation: {
                float: "float 6s ease-in-out infinite",
                fadeUp: "fadeUp 0.8s ease forwards",
                glow: "glowPulse 2.5s infinite"
            }
        }
    },

    plugins: []
};