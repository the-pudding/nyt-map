/* global d3 */
import * as Annotate from 'd3-svg-annotation';
import Stickyfill from 'stickyfilljs';
import Truncate from './utils/truncate';
import { examples } from './annotations.json';
import isMobile from './utils/is-mobile';

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
const REM = 16;

let countryData = [];
let monthData = [];
let headlineData = [];

// let headlinePrev = [];

const $timeline = d3.select('#timeline');
const $chart = $timeline.select('.figure__chart');
const $annotation = $timeline.select('.figure__annotation');
const $headline = $timeline.select('.timeline__headline');
const $headlineTitle = $headline.select('h3');
const $headlineList = $headline.select('ul');
const $toggle = $timeline.select('.timeline__toggle');
const $outro = d3.select('#outro');
const $chartEl = $chart.node();
const $mobileLabel = $timeline.select('.mobile-label');

let flagW = 0;
let flagH = 0;
let wrapLength = 0;
let numYears = 0;
let charCount = 0;
let ticking = false;
let halfH = 0;
let halfHeadH = 0;
let currentIndex = 0;
let mobile = false;

// const scroller = Scrollama();

function getHeadline(d) {
	const match = headlineData.find(
		h => h.month === d.month && h.year === d.year
	);
	// const match2 = headlinePrev.find(
	// 	h => h.month === d.month && h.year === d.year
	// );
	if (!match) return 'N/A';

	const { headline, common, demonym, city, web_url } = match;

	const headlineS = Truncate({
		text: headline,
		chars: charCount,
		clean: true,
		ellipses: true
	});
	const vals = [
		...common.split(':'),
		...demonym.split(':'),
		...city.split(':')
	];

	const first = vals.find(v => v.includes(d.country[0]));

	if (!first) return 'N/A';

	const firstWord = first
		.split('(')[1]
		.replace(')', '')
		.trim();
	const lower = headline.toLowerCase();
	const start = lower.indexOf(firstWord);
	const end = start + firstWord.length;

	const before = headlineS.substring(0, start);
	const between = headlineS.substring(start, end);
	const after = headlineS.substring(end, headlineS.length);

	return {
		headline: `${before}<strong>${between}</strong>${after}`,
		web_url
		// fresh: web_url !== match2.web_url
	};
}

function handleYearEnter() {
	const $year = $chart.selectAll('.year').filter((d, i) => i === currentIndex);
	const datum = $year.datum();
	$headlineTitle.text(`Headlines from ${datum.key}`);
	$headlineList.selectAll('li').remove();
	const { values } = datum;
	values.sort((a, b) => d3.descending(a.count, b.count));
	const data = values
		.map(d => ({
			month: MONTHS[+d.month - 1],
			...getHeadline(d)
		}))
		.filter(d => d.headline);

	const $li = $headlineList
		.selectAll('li')
		.data(data)
		.enter()
		.append('li');

	$li.append('span.month').text(d => d.month);
	$li.append('span.headline').html(d => d.headline);

	// TODO delete
	// $li.on('click', d => console.log(d.web_url));
	// $li.classed('is-fresh', d => d.fresh);

	$headline.classed('is-visible', true);
}

function handleStepProgress() {
	$chart.selectAll('.year').classed('is-focus', (d, i) => i === currentIndex);
	handleYearEnter();
}

function handleAnnoEnter({ data }) {
	const $annoNoteRect = d3.select(this);
	const $anno = $annoNoteRect
		.parent()
		.parent()
		.parent();
	$anno.select('.annotation-connector').st('opacity', 1);

	$chart
		.select(`[data-id="${data.year}-${data.month}"]`)
		.classed('is-focus', true);
}

function handleAnnoExit({ data }) {
	const $annoNoteRect = d3.select(this);
	const $anno = $annoNoteRect
		.parent()
		.parent()
		.parent();
	$anno.select('.annotation-connector').st('opacity', 0);
	$chart
		.select(`[data-id="${data.year}-${data.month}"]`)
		.classed('is-focus', false);
}

function handleTouchStart(d) {
	const { top, left, width, height } = this.getBoundingClientRect();
	const x = left + width / 2;
	const y = top - height;
	const match = countryData.find(c => c.commonLower === d);
	$mobileLabel.select('p').text(match ? match.common : d);
	$mobileLabel
		.st({ top: y, left: x })
		.transition()
		.duration(0)
		.st('opacity', 1)
		.transition()
		.delay(1000)
		.duration(250)
		.st('opacity', 0);
}

function handleToggle() {
	const show = $headline.classed('is-show');
	$headline.classed('is-show', !show);
	$toggle.text(show ? 'Show headlines' : 'Hide headlines');
}

function adjustAnnoHeight() {
	const $tspan = d3.select(this);
	const dy = $tspan.at('dy');
	$tspan.at('dy', dy === '0.8em' ? '1em' : '1.5em');
}

function adjustRectHeight() {
	const $anno = d3.select(this);
	const $rect = $anno.select('rect');
	const h = +$rect.at('height');
	const numLines = $anno.selectAll('tspan').size();
	const height = h + numLines * 2.5;
	$rect.at('height', height);
}

function createAnnotation() {
	$annotation.select('.g-annotation').remove();
	const $anno = $annotation.append('g.g-annotation');

	const typeCurve = Annotate.annotationCustomType(
		Annotate.annotationCalloutCurve,
		{
			className: 'custom',
			connector: { type: 'curve', end: 'arrow' },
			note: {
				lineType: 'horizontal',
				align: 'left'
			}
		}
	);
	const annotations = examples.map(d => ({
		note: {
			title: d.year,
			label: d.text,
			padding: 0,
			wrap: wrapLength,
			bgPadding: { top: 8, left: 8, right: 8, bottom: 8 }
		},
		data: { year: d.year, yearOff: +d.year - 1900, month: d.month },
		dx: (12 - +d.month) * flagW + flagW * 1.25,
		dy: +d.pos * flagH * 2,
		connector: { points: 1 }
	}));

	const makeAnnotations = Annotate.annotation()
		.type(typeCurve)
		.accessors({
			x: d => d.month * flagW - flagW / 2,
			y: d => d.yearOff * flagH + flagH / 2
		})
		.annotations(annotations);

	$anno.call(makeAnnotations);

	// adjust line height
	// $anno.selectAll('.annotation-note-label tspan').each(adjustAnnoHeight);
	// $anno.selectAll('.annotation').each(adjustRectHeight);

	$anno
		.selectAll('.annotation-note-bg')
		.on('mouseenter', handleAnnoEnter)
		.on('mouseout', handleAnnoExit);
}

function updateDimensions() {
	const $year = $timeline.select('.year');
	if ($year.size()) {
		const timelineW = $timeline.node().offsetWidth;
		const yearW = $year.node().offsetWidth;

		mobile = timelineW < REM * 70;
		const sideW = (timelineW - yearW) / 2;
		const annotationW = mobile ? timelineW - 5 * REM : timelineW - sideW;

		$annotation.st('width', annotationW).st('left', mobile ? 5 * REM : sideW);

		flagW = yearW / 12;
		flagH = flagW / FLAG_RATIO;

		$timeline.selectAll('li').st('height', flagH);
		$timeline.selectAll('.flag').st({ width: flagW, height: flagH });
		$timeline.selectAll('.title').st('line-height', flagH);

		const headW = Math.min(sideW - flagW * 1.25, 480);
		const headX = Math.max(0, sideW - headW - 5 * REM);
		const headH = window.innerHeight - (mobile ? 3 : 5) * REM;

		$headline
			.st('width', mobile ? '100%' : headW)
			.st('left', mobile ? 0 : headX)
			.st('height', mobile ? window.innerHeight * 0.8 : headH);

		halfHeadH = headH / 2;
		$chart
			.st('margin-top', mobile ? 0 : -headH)
			.st('padding-bottom', mobile ? 0 : headH * 0.75);

		$outro.st('margin-top', mobile ? 0 : -headH / 2);

		wrapLength = Math.floor(
			Math.min(mobile ? sideW * 1.6 : sideW * 0.7, MAX_WRAP)
		);

		createAnnotation();
		handleStepProgress();
	}
}

function updateSizes() {
	charCount = Math.floor(window.innerHeight * 0.3);
	halfH = window.innerHeight / 2;
}

function resize() {
	updateSizes();
	reset();
	updateDimensions();
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

	const $flag = $country.append('span.flag');
	$flag.html(d => {
		const match = countryData.find(c => c.commonLower === d) || {
			cca2: 'none'
		};
		const { cca2 } = match;

		return `<img data-src="assets/flags/jpg-4x3-192-q70/${cca2.toLowerCase()}.jpg">`;
	});

	if (isMobile.any()) $flag.on('touchstart', handleTouchStart);

	$country.append('span.name').text(d => {
		const match = countryData.find(c => c.commonLower === d);
		return match ? match.common : d;
	});

	if (datum.country.length > 1)
		$li.append('span.layer').text(`+${datum.country.length - 1}`);
}

function setupTimeline() {
	$chart.selectAll('.year').remove();

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
		.append('li')
		.at('data-id', d => `${d.year}-${d.month}`);

	numYears = $year.size();
	$li.each(setupLiContent);
}

function updateScroll() {
	ticking = false;

	const { top, height } = $chartEl.getBoundingClientRect();
	const target = mobile ? halfH * 0.25 : halfH * 0.5;
	const delta = (top - target) * -1;
	const trueH = mobile ? height : height - halfHeadH * 1.5;
	const progress = Math.min(1, Math.max(0, delta / trueH));
	const index = Math.floor(progress * (numYears - 1));
	if (index !== currentIndex) {
		currentIndex = index;
		handleStepProgress();
		$toggle.classed('is-visible', true);
	}
}

function onScroll() {
	if (!ticking) {
		ticking = true;
		requestAnimationFrame(updateScroll);
	}
}

function setupTrigger() {
	window.removeEventListener('scroll', onScroll);
	window.addEventListener('scroll', onScroll, true);
	updateScroll();
}

function setupToggle() {
	$toggle.on('click', handleToggle);
}

function showFlag() {
	const $img = d3.select(this);
	const src = $img.at('data-src');
	$img.at('src', src);
}

function setupFlags() {
	$chart.selectAll('img').each(showFlag);
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
		count: +d.count,
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

function loadHeadlines() {
	d3.loadData('assets/data/headlines.csv', (err, response) => {
		if (err) console.log(err);
		headlineData = response[0];
		handleStepProgress();
	});
}

function reset() {
	setupTimeline();
	setupToggle();
	setupTrigger();
	setupFlags();
	handleStepProgress();
}

function loadResults() {
	return new Promise(resolve => {
		d3.loadData('assets/data/result--month.csv', (err, response) => {
			if (err) console.log(err);
			monthData = fixGaps(response[0].filter(d => +d.year));
			updateSizes();
			reset();
			updateDimensions();
			resolve();
		});
	});
}

function init() {
	Stickyfill.add(d3.selectAll('.sticky').nodes());
	const files = ['countries.csv'];
	const filepaths = files.map(d => `assets/data/${d}`);
	d3.loadData(...filepaths, (err, response) => {
		if (err) console.log(err);
		countryData = cleanCountry(response[0]);
		loadResults().then(loadHeadlines);
	});
}

export default { init, resize };
