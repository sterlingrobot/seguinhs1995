'use strict';
module.exports = {
    db: 'mongodb://localhost/mean-dev',
    app: {
        title: 'MEAN.JS - Development Environment'
    },
    facebook: {
        clientID: process.env.FACEBOOK_ID || '667672676688130',
        clientSecret: process.env.FACEBOOK_SECRET || 'b1c0a7a19098319cac51e02a695a4fa6',
        callbackURL: '/auth/facebook/callback'
    },
    twitter: {
        clientID: process.env.TWITTER_KEY || 'CONSUMER_KEY',
        clientSecret: process.env.TWITTER_SECRET || 'CONSUMER_SECRET',
        callbackURL: '/auth/twitter/callback'
    },
    google: {
        clientID: process.env.GOOGLE_ID || '417104889681-cgqfchhdqgi7p5jp6s7llv861gk93jtc.apps.googleusercontent.com',
        clientSecret: process.env.GOOGLE_SECRET || 'zM9OmAnUcyRJJJquOBdX7k2P',
        callbackURL: '/auth/google/callback'
    },
    linkedin: {
        clientID: process.env.LINKEDIN_ID || 'APP_ID',
        clientSecret: process.env.LINKEDIN_SECRET || 'APP_SECRET',
        callbackURL: '/auth/linkedin/callback'
    },
    github: {
        clientID: process.env.GITHUB_ID || 'APP_ID',
        clientSecret: process.env.GITHUB_SECRET || 'APP_SECRET',
        callbackURL: '/auth/github/callback'
    },
    spotify: {
        clientID: process.env.SPOTIFY_ID || '777a8702b1b042ddac3c8f53f02291dc',
        clientSecret: process.env.SPOTIFY_SECRET || 'a938f65f259e45ad95c98ea4367e68fd',
        callbackURL: '/auth/spotify/callback'
    },
    mailer: {
        from: process.env.MAILER_FROM || 'MAILER_FROM',
        options: {
            service: process.env.MAILER_SERVICE_PROVIDER || 'MAILER_SERVICE_PROVIDER',
            auth: {
                user: process.env.MAILER_EMAIL_ID || 'MAILER_EMAIL_ID',
                pass: process.env.MAILER_PASSWORD || 'MAILER_PASSWORD'
            }
        }
    }
};