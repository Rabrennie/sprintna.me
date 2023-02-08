/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{js,ts,jsx,tsx,svelte,html}'],
    theme: {
        extend: {},
    },
    plugins: [require("daisyui")],
};

