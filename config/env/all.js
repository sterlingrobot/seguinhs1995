'use strict';

module.exports = {
	app: {
		title: 'Seguin H.S. Class of 1995 - 20 Year Reunion!',
		description: 'News and Resources for our 20 Year Reunion Celebration to be held October 9-11, 2015',
		keywords: 'seguin high school, class of 1995, matadors, 20 year reunion'
	},
	port: process.env.PORT || 3000,
	templateEngine: 'swig',
	sessionSecret: 'SHS95',
	sessionCollection: 'sessions',
	assets: {
		lib: {
			css: [
				'public/lib/bootstrap/dist/css/bootstrap.css',
				'public/lib/bootstrap/dist/css/bootstrap-theme.css',
				'public/lib/ng-ckeditor/ng-ckeditor.css',
				'//fonts.googleapis.com/css?family=Open+Sans:400,300,700'
			],
			js: [
				'public/lib/angular/angular.js',
				'public/lib/angular-resource/angular-resource.js',
				'public/lib/angular-animate/angular-animate.js',
				'public/lib/angular-sanitize/angular-sanitize.js',
				'public/lib/angular-ui-router/release/angular-ui-router.js',
				'public/lib/angular-ui-utils/ui-utils.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
				'public/lib/angular-spotify/src/angular-spotify.js',
				'public/lib/angular-payments/lib/angular-payments.js',
				'public/lib/lodash/dist/lodash.js',
				'public/lib/angular-google-maps/dist/angular-google-maps.js',
				'public/lib/ng-ckeditor/libs/ckeditor/ckeditor.js',
				'public/lib/ng-ckeditor/ng-ckeditor.min.js',
				'https://js.stripe.com/v2/'
			]
		},
		css: [
			'public/modules/**/css/*.css'
		],
		js: [
			'public/config.js',
			'public/application.js',
			'public/modules/*/*.js',
			'public/modules/*/*[!tests]*/*.js'
		],
		tests: [
			'public/lib/angular-mocks/angular-mocks.js',
			'public/modules/*/tests/*.js'
		]
	}
};
