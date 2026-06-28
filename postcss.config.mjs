/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    // Tailwind 4 ships its own PostCSS plugin and handles imports + vendor
    // prefixing internally (no separate postcss-import / autoprefixer needed).
    '@tailwindcss/postcss': {},
  },
};

export default config;
