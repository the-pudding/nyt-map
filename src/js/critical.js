import Promise from 'promise-polyfill';
import './polyfills/startsWith';
import './polyfills/endsWith';
import './polyfills/findIndex';
import './polyfills/find';
import './polyfills/includes';
import { loadFontGroup } from './utils/load-font';

const national = [
	{ family: 'National 2 Narrow Web', weight: 500 },
	{ family: 'National 2 Narrow Web', weight: 700 }
];

const tiempos = [
	{ family: 'Tiempos Text Web', weight: 500 },
	{ family: 'Tiempos Text Web', weight: 700 }
];

// const atlas = [
// 	{ family: 'Atlas Grotesk Web', weight: 400 },
// 	{ family: 'Atlas Grotesk Web', weight: 500 },
// 	{ family: 'Atlas Grotesk Web', weight: 600 }
// ];

// polyfill promise
if (!window.Promise) window.Promise = Promise;

// load fonts
loadFontGroup(national);
loadFontGroup(tiempos);
// loadFontGroup(atlas);
