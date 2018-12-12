/* global d3 */
import * as Annotate from 'd3-svg-annotation';
import EnterView from 'enter-view';

const MULTIPLE_SVG =
	'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevrons-down"><polyline points="7 13 12 18 17 13"></polyline><polyline points="7 6 12 11 17 6"></polyline></svg>';

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
const MAX_WRAP = 320;

let countryData = [];
let monthData = [];

const $timeline = d3.select('#timeline');
const $chart = $timeline.select('.figure__chart');
const $annotation = $timeline.select('.figure__annotation');

let flagW = 0;
let flagH = 0;
let wrapLength = 0;

function handleYearEnter(el) {
	d3.selectAll('.year').classed('is-focus', false);
	d3.select(el).classed('is-focus', true);
}

function handleYearExit(el) {
	d3.selectAll('.year').classed('is-focus', false);
	d3.select(el.previousSibling).classed('is-focus', true);
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
		connector: { type: 'curve', end: 'arrow' },
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
			wrap: wrapLength,
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

		$timeline.selectAll('li').st('height', flagH);
		$timeline.selectAll('.flag').st({ width: flagW, height: flagH });
		$timeline.selectAll('.title').st('line-height', flagH);

		wrapLength = Math.min(sideW * 0.8, MAX_WRAP);

		const test = d3
			.range(100)
			.map(() => 'm')
			.join(' ');
		const annoData = [
			{
				year: 1907,
				month: 6,
				label: test
			}
		];

		createAnnotation(annoData);
	}
}

function resize() {
	resizeTimeline();
}

function setupLiContent(datum) {
	const $li = d3.select(this);
	if (datum.year === '1900')
		$li.append('span.month').text(d => MONTHS[+d.month - 1]);

	const $country = $li
		.selectAll('.country')
		.data(d => d.country)
		.enter()
		.append('div.country')
		.classed('is-uk', d => d === 'united kingdom');

	$country.append('span.flag').html(d => {
		const match = countryData.find(c => c.commonLower === d) || {
			cca2: 'none'
		};
		const { cca2 } = match;

		return `<img src="assets/flags/jpg-4x3-192-q70/${cca2.toLowerCase()}.jpg">`;
	});

	$country.append('span.name').text(d => {
		const match = countryData.find(c => c.commonLower === d);
		return match ? match.common : d;
	});

	if (datum.country.length > 1)
		$li.append('span.layer').text(`+${datum.country.length - 1}`);
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

	$li.each(setupLiContent);
}

function setupAnnotation() {
	resizeTimeline();
}

function setupTrigger() {
	EnterView({
		selector: '#timeline .year',
		enter: handleYearEnter,
		exit: handleYearExit,
		offset: 0.5
	});
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

function fixGaps(data) {
	const cleanData = data.map(d => ({
		...d,
		country: d.country.split(':')
	}));
	const [a, b] = d3.extent(cleanData, d => +d.year);
	const years = d3
		.range(a, b + 1)
		.map(year => d3.range(MONTHS.length).map(m => ({ year, month: m + 1 })));
	const flat = [].concat(...years);
	const fill = flat.map(d => {
		const match = cleanData.find(
			v => +v.year === d.year && +v.month === d.month
		);
		if (match && match.count < 5) match.country = ['N/A'];
		return (
			match || {
				year: d.year.toString(),
				month: d3.format('02')(d.month),
				country: ['N/A'],
				count: 0
			}
		);
	});
	return fill;
}

function loadResults() {
	const files = ['month'];
	const filepaths = files.map(d => `assets/data/result--${d}.csv`);
	d3.loadData(...filepaths, (err, response) => {
		if (err) console.log(err);
		monthData = fixGaps(response[0].filter(d => +d.year < 2018));
		setupTimeline();
		setupAnnotation();
		setupTrigger();
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
