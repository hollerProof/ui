/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    env: {
        APP_URL: process.env.APP_URL,
    },
    swcMinify: false,
    pageExtensions: ['page.tsx', 'page.ts', 'page.jsx', 'page.js'],
    webpack(config) {
        config.resolve.alias = {
            ...config.resolve.alias,
            snarkyjs: require('path').resolve('node_modules/snarkyjs'),
        }
        config.optimization.minimizer = [];
        return config;
    },
    // async headers() {
    //     return [
    //         {
    //             source: '/(.*)',
    //             headers: [
    //                 {
    //                     key: 'Cross-Origin-Opener-Policy',
    //                     value: 'same-origin',
    //                 },
    //                 {
    //                     key: 'Cross-Origin-Embedder-Policy',
    //                     value: 'require-corp',
    //                 },
    //             ],
    //         },
    //     ];
    // },
}

module.exports = nextConfig
