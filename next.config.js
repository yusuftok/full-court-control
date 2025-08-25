const withNextIntl = require('next-intl/plugin')(
  './src/i18n/request.ts'
)

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
};

module.exports = withNextIntl(nextConfig);