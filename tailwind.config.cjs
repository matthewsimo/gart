const daisyui = require('daisyui');

const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			boxShadow: {
				page: `
  0px 6.8px 2.4px -3px rgba(0, 0, 0, 0.02),
  0px 12.8px 5.9px -3px rgba(0, 0, 0, 0.029),
  0px 18.3px 11.1px -3px rgba(0, 0, 0, 0.036),
  0px 23.5px 19px -3px rgba(0, 0, 0, 0.044),
  0px 30.8px 32.4px -3px rgba(0, 0, 0, 0.058),
  0px 60px 80px -3px rgba(0, 0, 0, 0.1)
				`
			}
		}
	},

	daisyui: {
		themes: [
			{
				mine: {
					primary: '#057AFF',
					secondary: '#67e8f9',
					accent: '#d8b4fe',
					neutral: '#021431',
					'base-100': '#FFFFFF',
					info: '#2563eb',
					success: '#22c55e',
					warning: '#eab308',
					error: '#f87171'
				}
			}
		],
		dark: 'mine'
	},

	plugins: [daisyui]
};

module.exports = config;
