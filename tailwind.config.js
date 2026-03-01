/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.{ejs,html,js}", "./public/**/*.{ejs,html,js}"],
  theme: { extend: {} },
  plugins: [require("daisyui")],
  daisyui: { themes: ["light", "dark"] },
}