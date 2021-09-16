const colors = require('tailwindcss/colors');

const config = {
	mode: "jit",
	purge: [
		"./src/**/*.{html,js,svelte,ts}",
	],
	theme: {
		extend: {
			colors: {
				rose: colors.rose
			}
		},
	},
	plugins: [
		require('@tailwindcss/forms'),
	],
};

module.exports = config;
