const withSass = require('@zeit/next-sass')
const withCSS = require('@zeit/next-css');
const withFonts = require('next-fonts');
const withPlugins = require('next-compose-plugins');
const optimizedImages = require('next-optimized-images');

const config = {
    env: {
        baseURL: 'https://mage.fabricandsewing.com/index.php/rest/V1/',
        graphQL: 'https://mage.fabricandsewing.com/graphql',
        user: 'admin',
        password: 'admin1020',
        tokenPath: 'integration/admin/token',
        productImage: 'https://www.fabricandsewing.com/media/catalog/product/',
        mageToken: 'Bearer h8bmzp96te5ko1pk3i8tpqysqh94krc4',
        AUTH_CLIENTKEY: '3UwLXKEtz3V2c9kHAzpbds6xgS4e3tPwn5W432e2RV332zx2JT6HXZCYQ9fYuSSx',
        AUTH_LOGINID: '27NzJ8n4BS',
        GOOGLE_API_KEY: "AIzaSyD5h9ocfBubL7zRe2MxjidEFJlzo-7lqsc"
    },
    distDir: '_next',
    pageExtension: ['jsx', 'js'],
    generateBuildId: async () => {
        if(process.env.BUILD_ID) {
            return process.env.BUILD_ID
        }
        return `${new Date().getTime()}`
    }
}

module.exports = withPlugins([
    [optimizedImages, {
        inlineImageLimit: 8192,
        imagesFolder: 'images',
        imagesName: '[name]-[hash].[ext]',
        handleImages: ['jpeg', 'jpg', 'png', 'svg', 'webp', 'gif', 'ico'],
        optimizeImages: true,
        optimizeImagesInDev: false,
        mozjpeg: {
            quality: 80,
        },
        optipng: {
            optimizationLevel: 3,
        },
        pngquant: false,
        gifsicle: {
            interlaced: true,
            optimizationLevel: 3,
        },
        webp: {
            preset: 'default',
            quality: 75,
        },
    }],
    [withCSS],
    [withFonts],
    [withSass]
], config);