/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
    env: {
        APPURL: process.env.APP_URL,
    }
}

module.exports = nextConfig
