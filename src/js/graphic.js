/* global d3 */
import * as topojson from 'topojson';
import * as noUiSlider from 'nouislider';

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
const $svg = $section.select('.globe__svg');
const $current = $section.select('.globe__current');
const $byMonthList = $section.select('.globe__by-month ul');
const $subregionList = $section.select('.globe__subregion ul');
const $slider = $section.select('.globe__slider');
const $sliderNode = $slider.node();

let $outline = null;
let $sphere = null;
let $pathCountry = null;
let $pathGrat = null;

let projection = null;
let path = null;
let radius = 0;
let scale = 0;

let currentIndex = 0;

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

function updateSubregion() {
	const sliced = yearData
		.slice(0, currentIndex + 1)
		.map(d => countryData.find(c => c.common === d.country));
	const nested = d3
		.nest()
		.key(d => d.subregion)
		.rollup(values => values.length)
		.entries(sliced);

	const $li = $subregionList.selectAll('li').data(nested, d => d.key);
	const $liEnter = $li.enter().append('li');
	$liEnter.merge($li).text(d => `${d.key}: ${d.value}`);
	$li.exit().remove();
}

function update() {
	const datum = yearData[currentIndex];
	const match = countryData.find(c => c.common === datum.country);
	goTo({ ccn3: match.ccn3 || USA_ID });
	const { year } = datum;

	updateSubregion();

	$current.select('.current__year').text(year);
	$current.select('.current__flag').text(match.flag);
	const monthInYearData = monthData.filter(m => m.year === year);
	const $li = $byMonthList.selectAll('li').data(monthInYearData);
	const $liEnter = $li.enter().append('li');
	$liEnter
		.merge($li)
		.html(
			(d, i) =>
				`<span class="month">${MONTHS[i]}:</span> <span class="country">${
					datum.country
				}</span>`
		);

	$li.exit().remove();
}

function handleChange(value) {
	currentIndex = +value;
	update();
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
	$li.append('span.name').text(d => d.country);
}

function setupSlider() {
	const min = 0;
	const max = yearData.length - 1;
	const start = 0;

	const slider = noUiSlider.create($sliderNode, {
		start,
		step: 1,
		// pips: {
		// 	filter: value => {
		// 		const data = nestedData[Math.round(value)];
		// 		return data.key.endsWith('01') ? 1 : 0;
		// 	},
		// 	mode: 'steps',
		// 	format: {
		// 		to: value => {
		// 			const data = nestedData[Math.round(value)];
		// 			if (data.key.endsWith('01')) return data.dateDisplay.substring(4, 7);
		// 		}
		// 	}
		// },
		tooltips: [
			{
				to: value => {
					const data = yearData[Math.round(value)];
					return data.year;
				}
			}
		],
		range: {
			min,
			max
		}
	});

	// slider.on('slide', handleSlide);
	slider.on('change', handleChange);
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
	setInterval(() => {
		update();
		// $sliderNode.noUiSlider.set(currentDay);
		currentIndex += 1;
	}, 3000);
}

function loadResults() {
	// const suffix = 'page-one';
	// const suffix = 'all';
	const files = [
		// 'by-year--all',
		// 'by-month--all',
		// 'by-year--page-one',
		// 'by-month--page-one',
		// 'by-year--weighted-2',
		// 'by-month--weighted-2',
		'by-year--weighted-10',
		'by-month--weighted-10'
	];
	const filepaths = files.map(d => `assets/data/result-${d}.csv`);
	d3.loadData(...filepaths, (err, response) => {
		if (err) console.log(err);
		yearData = response[0].filter(d => +d.year < 2018);
		monthData = response[1].filter(d => +d.year < 2018);
		test();
		setupTimeline();
		setupSlider();
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
	});
}

export default { init, resize };
