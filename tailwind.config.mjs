/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': theme('colors.slate[700]'),
            '--tw-prose-headings': theme('colors.slate[800]'),
            p: {
              marginTop: '1.25em',
              marginBottom: '1.25em',
            },
            h2: {
              marginTop: '2em',
              marginBottom: '1em',
            },
            h3: {
              marginTop: '1.75em',
              marginBottom: '0.75em',
            },
          },
        },
        xl: {
          css: {
            p: {
              marginTop: '1.25em',
              marginBottom: '1.25em',
            },
            h2: {
              marginTop: '2em',
              marginBottom: '1em',
            },
            h3: {
              marginTop: '1.75em',
              marginBottom: '0.75em',
            },
          },
        },
      }),
      fontFamily: {
        sans: ["var(--font-sans)"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
}

module.exports = config
