/* global d3 */
import * as topojson from 'topojson';

const MONTHS = [
	'Jan',
	'Feb',
	'Mar',
	'Apr',
	'May',
	'Jun',
	'Jul',
	'Aug',
	'Sep',
	'Oct',
	'Nov',
	'Dec'
];
const PADDING = 12;
const USA_ID = 840;

let countryData = [];
let worldData = [];
let yearData = [];
let monthData = [];
let countries = [];

const $section = d3.select('#globe');
const $svg = $section.select('svg');
let $outline = null;
let $sphere = null;
let $pathCountry = null;
let $pathGrat = null;

let projection = null;
let path = null;
let radius = 0;
let scale = 0;

function resize() {
	const h = window.innerHeight;
	const w = $section.node().offsetWidth;
	const sz = Math.min(w, h) * 0.75;
	const width = sz;
	const height = sz;
	$svg.at({ width, height });
	radius = height / 2 - PADDING;
	scale = radius;

	projection
		.translate([width / 2, height / 2])
		.scale(scale)
		.clipAngle(90);

	$outline
		.at('cx', width / 2)
		.at('cy', height / 2)
		.at('r', projection.scale());

	$sphere.at('d', path({ type: 'Sphere' }));

	$pathGrat.at('d', path);
	$pathCountry.at('d', path);
}

function goTo({ ccn3, duration = 2000 }) {
	const c1 = countryData.find(d => d.ccn3 === ccn3);
	const c2 = countries.find(d => d.id === ccn3);
	if (c2) {
		$pathCountry.classed('is-active', d => ccn3 !== USA_ID && d.id === ccn3);
		d3.transition()
			.duration(duration)
			.ease(d3.easeCubicInOut)
			.tween('rotate', () => {
				const p1 = [c1.lng, c1.lat];
				// const p2 = d3.geoCentroid(c2);
				const r = d3.interpolate(projection.rotate(), [-p1[0], -p1[1]]);

				return t => {
					projection.rotate(r(t));
					$pathGrat.at('d', path);
					// $pathLand.at('d', path);
					$pathCountry.at('d', path);
					// context.clearRect(0, 0, width, height);
					// context.beginPath();
					// path(land);
					// context.fill();
					// context.beginPath();
					// context.arc(width / 2, height / 2, radius, 0, 2 * Math.PI, true);
					// context.lineWidth = 2.5;
					// context.stroke();
				};
			});
	} else console.log('--- no match ---');
}

function setup() {
	projection = d3.geoOrthographic();
	path = d3.geoPath().projection(projection);

	countries = topojson.feature(worldData, worldData.objects.countries).features;
	// const land = topojson.feature(worldData, worldData.objects.land);

	$sphere = $svg.append('path.sphere');
	$pathGrat = $svg.append('path.graticule');
	// const $pathLand = $svg.append('path.land');
	$pathCountry = $svg
		.selectAll('.country')
		.data(countries)
		.enter()
		.append('path.country');

	$outline = $svg.append('circle.outline');

	const graticule = d3.geoGraticule();
	$pathGrat.datum(graticule);

	// $pathLand.datum(land).at('d', path);
	goTo({ ccn3: USA_ID, duration: 0 }); // start at usa
}

function cleanCountry(data) {
	return data.map(d => ({
		...d,
		ccn3: +d.ccn3,
		lat: +d.latlng.split(',')[0].trim(),
		lng: +d.latlng.split(',')[1].trim()
	}));
}

function test() {
	let i = 0;
	setInterval(() => {
		const d = yearData[i];
		const { ccn3, flag } = countryData.find(c => c.common === d.country);
		goTo({ ccn3 });
		$section
			.select('h3')
			.html(`${yearData[i].year} <span class="flag">${flag}</span>`);
		i += 1;
	}, 2500);
}

function setupTimeline() {
	const nested = d3
		.nest()
		.key(d => d.year)
		.entries(monthData);

	const $year = d3
		.select('#timeline')
		.selectAll('.year')
		.data(nested)
		.enter()
		.append('div.year');
	const $hed = $year.append('h3').text(d => d.key);
	const $ul = $year.append('ul');

	const $li = $ul
		.selectAll('li')
		.data(d => d.values)
		.enter()
		.append('li');

	$li.append('span.month').text(d => MONTHS[+d.month - 1]);
	$li.append('span.flag').text(d => {
		const match = countryData.find(c => c.common === d.country);
		return match ? match.flag : '';
	});
}

function loadResults() {
	const suffix = 'page-one';
	const files = ['by-year', 'by-month'];
	const filepaths = files.map(d => `assets/data/result-${d}--${suffix}.csv`);
	d3.loadData(...filepaths, (err, response) => {
		if (err) console.log(err);
		yearData = response[0];
		monthData = response[1];

		test();
		setupTimeline();
	});
}

function init() {
	const files = ['countries.csv', 'world-110m.json'];
	const filepaths = files.map(d => `assets/data/${d}`);
	d3.loadData(...filepaths, (err, response) => {
		if (err) console.log(err);
		countryData = cleanCountry(response[0]);
		worldData = response[1];
		setup();
		resize();
		loadResults();
		// setInterval(() => {
		// 	const r = Math.floor(Math.random() * countryData.length);
		// 	console.log(countryData[r].common);
		// 	goTo({ id: countryData[r].ccn3 });
		// }, 3500);
	});
}

export default { init, resize };
