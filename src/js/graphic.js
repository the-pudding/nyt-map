/* global d3 */
import * as Annotate from 'd3-svg-annotation';
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
const FLAG_RATIO = 4 / 3;

let countryData = [];
let worldData = [];
let yearData = [];
let monthData = [];
let subregionData = [];
let countries = [];

const $globe = d3.select('#globe');
const $svg = $globe.select('.globe__svg');
const $current = $globe.select('.globe__current');
const $headlineList = $globe.select('.globe__headline ul');
const $subregionList = $globe.select('.globe__subregion ul');
const $slider = $globe.select('.globe__slider');
const $sliderNode = $slider.node();

const $timeline = d3.select('#timeline');
const $chart = $timeline.select('.figure__chart');
const $annotation = $timeline.select('.figure__annotation');

let $outline = null;
let $sphere = null;
let $pathCountry = null;
let $pathGrat = null;

let projection = null;
let path = null;
let radius = 0;
let scale = 0;
let flagW = 0;
let flagH = 0;

let currentIndex = 0;

function resizeTimeline() {
	const $year = $timeline.select('.year');
	if ($year.size()) {
		const timelineW = $timeline.node().offsetWidth;
		const yearW = $year.node().offsetWidth;
		const sideW = (timelineW - yearW) / 2;
		const annotationW = timelineW - sideW;
		$annotation.st('width', annotationW);

		flagW = yearW / 12;
		flagH = flagW / FLAG_RATIO;
	}
}

function resize() {
	const h = window.innerHeight;
	const w = $globe.node().offsetWidth;
	const sz = Math.min(w, h) * 0.67;
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

	resizeTimeline();
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
		.map(d => countryData.find(c => c.commonLower === d.country));

	const nested = d3
		.nest()
		.key(d => d.subregion)
		.rollup(values => values.length)
		.entries(sliced);

	subregionData.forEach(s => {
		const match = nested.find(n => n.key === s.key);
		s.value = match ? match.value : 0;
	});

	subregionData.sort(
		(a, b) => d3.descending(a.value, b.value) || d3.ascending(a.key, b.key)
	);

	$subregionList.selectAll('li').remove();

	const $li = $subregionList.selectAll('li').data(subregionData);
	const $liEnter = $li.enter().append('li');
	$liEnter.text(d => `${d.key}: ${d.value}`);
}

function update() {
	const datum = yearData[currentIndex];
	const match = countryData.find(c => c.commonLower === datum.country);
	goTo({ ccn3: match.ccn3 || USA_ID });
	const { year } = datum;

	updateSubregion();

	const flag = match.cca2.toLowerCase();
	$current.select('.current__year').text(year);
	$current
		.select('.current__flag')
		.at('src', `assets/flags/jpg-4x3-192-q70/${flag}.jpg`);
	$current.select('.current__country').text(match.common);
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

	const $year = $chart
		.selectAll('.year')
		.data(nested)
		.enter()
		.append('div.year');

	$year.append('h3.title').text(d => d.key);
	const $ul = $year.append('ul');

	const $li = $ul
		.selectAll('li')
		.data(d => d.values)
		.enter()
		.append('li');

	$li.append('span.month').text(d => MONTHS[+d.month - 1]);

	$li.append('span.flag').html(d => {
		const { cca2 } = countryData.find(c => c.commonLower === d.country);
		return `<img src="assets/flags/jpg-4x3-192-q70/${cca2.toLowerCase()}.jpg">`;
	});

	$li.append('span.name').text(d => {
		const match = countryData.find(c => c.commonLower === d.country);
		return match ? match.common : '';
	});
}

function duplicateConnector() {
	const $a = d3.select(this);
	const $c = $a.select('.annotation-connector');
	$c.classed('annotation-connector--bg', true);
	const html = $c.html();
	$a.append('g.annotation-connector.annotation-connector--fg').html(html);
}

function createAnnotation(data) {
	$annotation.select('.g-annotation').remove();
	const $anno = $annotation.append('g.g-annotation');

	const type = Annotate.annotationCustomType(Annotate.annotationCalloutCurve, {
		className: 'custom',
		connector: { type: 'curve', end: 'dot' },
		note: {
			lineType: 'horizontal',
			align: 'left'
		}
	});

	const annotations = data.map(d => ({
		note: {
			title: d.year,
			label: d.label,
			padding: 0,
			wrap: 110,
			bgPadding: { top: 5, left: 5, right: 5, bottom: 5 }
		},
		data: { yearOff: d.year - 1900, month: d.month },
		dx: (12 - d.month) * flagW + flagW,
		dy: flagH * 3,
		connector: { points: 1 }
	}));

	const makeAnnotations = Annotate.annotation()
		.type(type)
		.accessors({
			x: d => d.month * flagW - flagW / 2,
			y: d => d.yearOff * flagH + flagH / 2 + d.yearOff / 2
		})
		.annotations(annotations);

	$anno.call(makeAnnotations);

	$anno.selectAll('.annotation').each(duplicateConnector);
	// $anno
	// 	.selectAll('.annotation-note-title')
	// 	.selectAll('tspan')
	// 	.filter((d, i) => i !== 0)
	// 	.at('dy', '1.4em');

	// $anno
	// 	.transition()
	// 	.duration(dur)
	// 	.delay(delay)
	// 	.ease(EASE)
	// 	.st('opacity', 1);
}

function setupAnnotation() {
	resizeTimeline();

	const annoData = [
		{
			year: 1907,
			month: 6,
			label: 'Lemonade is released'
		}
	];

	createAnnotation(annoData);
}

function setupSlider() {
	const min = 0;
	const max = yearData.length - 1;
	const start = 0;

	const slider = noUiSlider.create($sliderNode, {
		start,
		step: 1,
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

function test() {
	setInterval(() => {
		update();
		// $sliderNode.noUiSlider.set(currentDay);
		currentIndex += 1;
	}, 3000);
}

function cleanCountry(data) {
	return data.map(d => ({
		...d,
		ccn3: +d.ccn3,
		lat: +d.latlng.split(',')[0].trim(),
		commonLower: d.common.toLowerCase(),
		lng: +d.latlng.split(',')[1].trim()
	}));
}

function getSubregions(data) {
	return d3
		.nest()
		.key(d => d.subregion)
		.rollup(() => 0)
		.entries(data);
}

function loadResults() {
	// const suffix = 'page-one';
	// const suffix = 'all';
	const files = ['year', 'month'];
	const filepaths = files.map(d => `assets/data/result--${d}.csv`);
	d3.loadData(...filepaths, (err, response) => {
		if (err) console.log(err);
		yearData = response[0].filter(d => +d.year < 2018);
		monthData = response[1].filter(d => +d.year < 2018);
		test();
		setupTimeline();
		setupAnnotation();
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
		subregionData = getSubregions(countryData);
		setup();
		resize();
		loadResults();
	});
}

export default { init, resize };
