import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['firebasestorage.googleapis.com', 'storage.googleapis.com', 'localhost', 'pets.nitg-eg.com'],
    },
};

export default withNextIntl(nextConfig);