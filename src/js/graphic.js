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

const FLAG_RATIO = 4 / 3;

let countryData = [];
let monthData = [];
let alltimeData = [];

const $timeline = d3.select('#timeline');
const $alltime = d3.select('#alltime');
const $ol = $alltime.select('ol');
const $chart = $timeline.select('.figure__chart');
const $annotation = $timeline.select('.figure__annotation');

let flagW = 0;
let flagH = 0;

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

function resizeAlltime() {
	$ol.selectAll('li').st('height', flagH);
}

function resize() {
	resizeTimeline();
	resizeAlltime();
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

function cleanCountry(data) {
	return data.map(d => ({
		...d,
		ccn3: +d.ccn3,
		lat: +d.latlng.split(',')[0].trim(),
		commonLower: d.common.toLowerCase(),
		lng: +d.latlng.split(',')[1].trim()
	}));
}

function setupAlltime() {
	const w = $ol.node().offsetWidth;
	const $li = $ol
		.selectAll('li')
		.data(alltimeData.slice(0, 50))
		.enter()
		.append('li');
	const scale = d3
		.scaleLinear()
		.domain([0, alltimeData[0].value])
		.range([0, w]);
	$li
		.st('width', d => scale(d.value))
		.st('background-image', d => {
			const { cca2 } = countryData.find(c => c.commonLower === d.key);
			return `url("assets/flags/jpg-4x3-192-q70/${cca2.toLowerCase()}.jpg")`;
		});
}

function cleanCountryData(data) {
	const nested = d3
		.nest()
		.key(d => d.country)
		.rollup(
			values => d3.sum(values, v => +v.count) / d3.sum(values, v => +v.baseline)
			// values => d3.sum(values, v => +v.count)
		)
		.entries(data);

	nested.sort((a, b) => d3.descending(a.value, b.value));
	return nested;
}

function loadResults() {
	// const suffix = 'page-one';
	// const suffix = 'all';
	const files = ['month', 'country'];
	const filepaths = files.map(d => `assets/data/result--${d}.csv`);
	d3.loadData(...filepaths, (err, response) => {
		if (err) console.log(err);
		monthData = response[0].filter(d => +d.year < 2018);
		alltimeData = cleanCountryData(response[1]);
		setupTimeline();
		setupAnnotation();
		setupAlltime();
		resize();
	});
}

function init() {
	const files = ['countries.csv'];
	const filepaths = files.map(d => `assets/data/${d}`);
	d3.loadData(...filepaths, (err, response) => {
		if (err) console.log(err);
		countryData = cleanCountry(response[0]);
		loadResults();
	});
}

export default { init, resize };
