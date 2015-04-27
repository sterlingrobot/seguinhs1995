'use strict';

module.exports = {
	db: process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 'mongodb://' + (process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost') + '/mean',
	assets: {
		lib: {
			css: [
				'public/lib/bootstrap/dist/css/bootstrap.min.css',
				'public/lib/bootstrap/dist/css/bootstrap-theme.min.css',
			],
			js: [
				'public/lib/angular/angular.min.js',
				'public/lib/angular-resource/angular-resource.min.js',
				'public/lib/angular-animate/angular-animate.min.js',
				'public/lib/angular-ui-router/release/angular-ui-router.min.js',
				'public/lib/angular-ui-utils/ui-utils.min.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.min.js'
			]
		},
		css: 'public/dist/application.min.css',
		js: 'public/dist/application.min.js'
	},
	facebook: {
		clientID: process.env.FACEBOOK_ID || '667672676688130',
		clientSecret: process.env.FACEBOOK_SECRET || 'b1c0a7a19098319cac51e02a695a4fa6',
		callbackURL: '/auth/facebook/callback'
	},
	twitter: {
		clientID: process.env.TWITTER_KEY || '7n5dVvhR74h2nnyzrJjNhPhj7',
		clientSecret: process.env.TWITTER_SECRET || 'WmJKvHXd9NffVwQjFu1iVnACthE438RRLgo1hEwrLKH2nPpjCL',
		callbackURL: '/auth/twitter/callback'
	},
	google: {
		clientID: process.env.GOOGLE_ID || '417104889681-cgqfchhdqgi7p5jp6s7llv861gk93jtc.apps.googleusercontent.com',
		clientSecret: process.env.GOOGLE_SECRET || 'zM9OmAnUcyRJJJquOBdX7k2P',
		callbackURL: '/auth/google/callback'
	},
	linkedin: {
		clientID: process.env.LINKEDIN_ID || '78m118wpems6mt',
		clientSecret: process.env.LINKEDIN_SECRET || 'EsJuvxKwtBGTo2HI',
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
    stripe: {
        clientID: process.env.STRIPE_ID || 'pk_live_oyRzRBuqYlM57kEhO95t7TZX',
        clientSecret: process.env.STRIPE_SECRET || 'sk_live_HFjJfi7dulNqiXiT9ZdVEQtP',
        callbackURL: ''
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