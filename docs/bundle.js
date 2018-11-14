!function(t){var e={};function n(r){if(e[r])return e[r].exports;var i=e[r]={i:r,l:!1,exports:{}};return t[r].call(i.exports,i,i.exports,n),i.l=!0,i.exports}n.m=t,n.c=e,n.d=function(t,e,r){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var i in t)n.d(r,i,function(e){return t[e]}.bind(null,i));return r},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=14)}({0:function(t,e){var n;n=function(){return this}();try{n=n||Function("return this")()||(0,eval)("this")}catch(t){"object"==typeof window&&(n=window)}t.exports=n},14:function(t,e,n){"use strict";n.r(e);var r=n(2),i=n.n(r),o={android:function(){return navigator.userAgent.match(/Android/i)},blackberry:function(){return navigator.userAgent.match(/BlackBerry/i)},ios:function(){return navigator.userAgent.match(/iPhone|iPad|iPod/i)},opera:function(){return navigator.userAgent.match(/Opera Mini/i)},windows:function(){return navigator.userAgent.match(/IEMobile/i)},any:function(){return o.android()||o.blackberry()||o.ios()||o.opera()||o.windows()}},a=o,s=function(t){return t},u=function(t){if(null==t)return s;var e,n,r=t.scale[0],i=t.scale[1],o=t.translate[0],a=t.translate[1];return function(t,s){s||(e=n=0);var u=2,c=t.length,l=new Array(c);for(l[0]=(e+=t[0])*r+o,l[1]=(n+=t[1])*i+a;u<c;)l[u]=t[u],++u;return l}},c=function(t,e){for(var n,r=t.length,i=r-e;i<--r;)n=t[i],t[i++]=t[r],t[r]=n},l=function(t,e){return"GeometryCollection"===e.type?{type:"FeatureCollection",features:e.geometries.map(function(e){return f(t,e)})}:f(t,e)};function f(t,e){var n=e.id,r=e.bbox,i=null==e.properties?{}:e.properties,o=p(t,e);return null==n&&null==r?{type:"Feature",properties:i,geometry:o}:null==r?{type:"Feature",id:n,properties:i,geometry:o}:{type:"Feature",id:n,bbox:r,properties:i,geometry:o}}function p(t,e){var n=u(t.transform),r=t.arcs;function i(t,e){e.length&&e.pop();for(var i=r[t<0?~t:t],o=0,a=i.length;o<a;++o)e.push(n(i[o],o));t<0&&c(e,a)}function o(t){return n(t)}function a(t){for(var e=[],n=0,r=t.length;n<r;++n)i(t[n],e);return e.length<2&&e.push(e[0]),e}function s(t){for(var e=a(t);e.length<4;)e.push(e[0]);return e}function l(t){return t.map(s)}return function t(e){var n,r=e.type;switch(r){case"GeometryCollection":return{type:r,geometries:e.geometries.map(t)};case"Point":n=o(e.coordinates);break;case"MultiPoint":n=e.coordinates.map(o);break;case"LineString":n=a(e.arcs);break;case"MultiLineString":n=e.arcs.map(a);break;case"Polygon":n=l(e.arcs);break;case"MultiPolygon":n=e.arcs.map(l);break;default:return null}return{type:r,coordinates:n}}(e)}var d=new ArrayBuffer(16);new Float64Array(d),new Uint32Array(d);Math.PI,Math.abs,Math.atan2,Math.cos,Math.sin;var h=n(3);function m(t){return function(t){if(Array.isArray(t)){for(var e=0,n=new Array(t.length);e<t.length;e++)n[e]=t[e];return n}}(t)||function(t){if(Symbol.iterator in Object(t)||"[object Arguments]"===Object.prototype.toString.call(t))return Array.from(t)}(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance")}()}function g(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}var v=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],b=12,y=840,w=[],S=[],x=[],E=[],C=[],N=d3.select("#globe"),A=N.select(".globe__svg"),O=N.select(".globe__current"),P=N.select(".globe__by-month ul"),k=N.select(".globe__subregion ul"),M=N.select(".globe__slider").node(),j=null,U=null,V=null,_=null,F=null,L=null,z=0;function T(){var t=window.innerHeight,e=N.node().offsetWidth,n=.75*Math.min(e,t),r=n,i=n;A.at({width:r,height:i}),z=i/2-b,F.translate([r/2,i/2]).scale(z).clipAngle(90),j.at("cx",r/2).at("cy",i/2).at("r",F.scale()),U.at("d",L({type:"Sphere"})),_.at("d",L),V.at("d",L)}function H(t){var e=t.ccn3,n=t.duration,r=void 0===n?2e3:n,i=w.find(function(t){return t.ccn3===e});C.find(function(t){return t.id===e})?(V.classed("is-active",function(t){return e!==y&&t.id===e}),d3.transition().duration(r).ease(d3.easeCubicInOut).tween("rotate",function(){var t=[i.lng,i.lat],e=d3.interpolate(F.rotate(),[-t[0],-t[1]]);return function(t){F.rotate(e(t)),_.at("d",L),V.at("d",L)}})):console.log("--- no match ---")}function D(t){var e=x[t],n=w.find(function(t){return t.common===e.country});H({ccn3:n.ccn3||y});var r=e.year;!function(t){var e=x.slice(0,t+1).map(function(t){return w.find(function(e){return e.common===t.country})}),n=d3.nest().key(function(t){return t.subregion}).rollup(function(t){return t.length}).entries(e),r=k.selectAll("li").data(n,function(t){return t.key});r.enter().append("li").merge(r).text(function(t){return"".concat(t.key,": ").concat(t.value)}),r.exit().remove()}(t),O.select(".current__year").text(r),O.select(".current__flag").text(n.flag);var i=E.filter(function(t){return t.year===r}),o=P.selectAll("li").data(i);o.enter().append("li").merge(o).html(function(t,n){return'<span class="month">'.concat(v[n],':</span> <span class="country">').concat(e.country,"</span>")}),o.exit().remove()}function R(t){D(+t)}function B(t){return t.map(function(t){return function(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{},r=Object.keys(n);"function"==typeof Object.getOwnPropertySymbols&&(r=r.concat(Object.getOwnPropertySymbols(n).filter(function(t){return Object.getOwnPropertyDescriptor(n,t).enumerable}))),r.forEach(function(e){g(t,e,n[e])})}return t}({},t,{ccn3:+t.ccn3,lat:+t.latlng.split(",")[0].trim(),lng:+t.latlng.split(",")[1].trim()})})}function I(){var t,e=["by-year--weighted-10","by-month--weighted-10"].map(function(t){return"assets/data/result-".concat(t,".csv")});(t=d3).loadData.apply(t,m(e).concat([function(t,e){t&&console.log(t),x=e[0].filter(function(t){return+t.year<2018}),E=e[1].filter(function(t){return+t.year<2018}),function(){var t=0;setInterval(function(){D(t),t+=1},3e3)}(),function(){var t=d3.nest().key(function(t){return t.year}).entries(E),e=d3.select("#timeline").selectAll(".year").data(t).enter().append("div.year"),n=(e.append("h3").text(function(t){return t.key}),e.append("ul").selectAll("li").data(function(t){return t.values}).enter().append("li"));n.append("span.month").text(function(t){return v[+t.month-1]}),n.append("span.flag").text(function(t){var e=w.find(function(e){return e.common===t.country});return e?e.flag:""}),n.append("span.name").text(function(t){return t.country})}(),function(){var t=x.length-1;h.create(M,{start:0,step:1,tooltips:[{to:function(t){return x[Math.round(t)].year}}],range:{min:0,max:t}}).on("change",R)}()}]))}var q={init:function(){var t,e=["countries.csv","world-110m.json"].map(function(t){return"assets/data/".concat(t)});(t=d3).loadData.apply(t,m(e).concat([function(t,e){t&&console.log(t),w=B(e[0]),S=e[1],function(){F=d3.geoOrthographic(),L=d3.geoPath().projection(F),C=l(S,S.objects.countries).features,U=A.append("path.sphere"),_=A.append("path.graticule"),V=A.selectAll(".country").data(C).enter().append("path.country"),j=A.append("circle.outline");var t=d3.geoGraticule();_.datum(t),H({ccn3:y,duration:0})}(),T(),I()}]))},resize:T},W=d3.select("body"),X=0;function $(){var t=W.node().offsetWidth;X!==t&&(X=t,q.resize())}W.classed("is-mobile",a.any()),window.addEventListener("resize",i()($,150)),function(){if(W.select("header").classed("is-sticky")){var t=W.select(".header__menu"),e=W.select(".header__toggle");e.on("click",function(){var n=t.classed("is-visible");t.classed("is-visible",!n),e.classed("is-visible",!n)})}}(),q.init()},2:function(t,e,n){(function(e){var n="Expected a function",r=NaN,i="[object Symbol]",o=/^\s+|\s+$/g,a=/^[-+]0x[0-9a-f]+$/i,s=/^0b[01]+$/i,u=/^0o[0-7]+$/i,c=parseInt,l="object"==typeof e&&e&&e.Object===Object&&e,f="object"==typeof self&&self&&self.Object===Object&&self,p=l||f||Function("return this")(),d=Object.prototype.toString,h=Math.max,m=Math.min,g=function(){return p.Date.now()};function v(t){var e=typeof t;return!!t&&("object"==e||"function"==e)}function b(t){if("number"==typeof t)return t;if(function(t){return"symbol"==typeof t||function(t){return!!t&&"object"==typeof t}(t)&&d.call(t)==i}(t))return r;if(v(t)){var e="function"==typeof t.valueOf?t.valueOf():t;t=v(e)?e+"":e}if("string"!=typeof t)return 0===t?t:+t;t=t.replace(o,"");var n=s.test(t);return n||u.test(t)?c(t.slice(2),n?2:8):a.test(t)?r:+t}t.exports=function(t,e,r){var i,o,a,s,u,c,l=0,f=!1,p=!1,d=!0;if("function"!=typeof t)throw new TypeError(n);function y(e){var n=i,r=o;return i=o=void 0,l=e,s=t.apply(r,n)}function w(t){var n=t-c;return void 0===c||n>=e||n<0||p&&t-l>=a}function S(){var t=g();if(w(t))return x(t);u=setTimeout(S,function(t){var n=e-(t-c);return p?m(n,a-(t-l)):n}(t))}function x(t){return u=void 0,d&&i?y(t):(i=o=void 0,s)}function E(){var t=g(),n=w(t);if(i=arguments,o=this,c=t,n){if(void 0===u)return function(t){return l=t,u=setTimeout(S,e),f?y(t):s}(c);if(p)return u=setTimeout(S,e),y(c)}return void 0===u&&(u=setTimeout(S,e)),s}return e=b(e)||0,v(r)&&(f=!!r.leading,a=(p="maxWait"in r)?h(b(r.maxWait)||0,e):a,d="trailing"in r?!!r.trailing:d),E.cancel=function(){void 0!==u&&clearTimeout(u),l=0,i=c=o=u=void 0},E.flush=function(){return void 0===u?s:x(g())},E}}).call(this,n(0))},3:function(t,e,n){var r,i,o;/*! nouislider - 12.1.0 - 10/25/2018 */i=[],void 0===(o="function"==typeof(r=function(){"use strict";var t="12.1.0";function e(t){return null!==t&&void 0!==t}function n(t){t.preventDefault()}function r(t){return"number"==typeof t&&!isNaN(t)&&isFinite(t)}function i(t,e,n){n>0&&(u(t,e),setTimeout(function(){c(t,e)},n))}function o(t){return Math.max(Math.min(t,100),0)}function a(t){return Array.isArray(t)?t:[t]}function s(t){var e=(t=String(t)).split(".");return e.length>1?e[1].length:0}function u(t,e){t.classList?t.classList.add(e):t.className+=" "+e}function c(t,e){t.classList?t.classList.remove(e):t.className=t.className.replace(new RegExp("(^|\\b)"+e.split(" ").join("|")+"(\\b|$)","gi")," ")}function l(t){var e=void 0!==window.pageXOffset,n="CSS1Compat"===(t.compatMode||""),r=e?window.pageXOffset:n?t.documentElement.scrollLeft:t.body.scrollLeft,i=e?window.pageYOffset:n?t.documentElement.scrollTop:t.body.scrollTop;return{x:r,y:i}}function f(t,e){return 100/(e-t)}function p(t,e){return 100*e/(t[1]-t[0])}function d(t,e){for(var n=1;t>=e[n];)n+=1;return n}function h(t,e,n){if(n>=t.slice(-1)[0])return 100;var r=d(n,t),i=t[r-1],o=t[r],a=e[r-1],s=e[r];return a+function(t,e){return p(t,t[0]<0?e+Math.abs(t[0]):e-t[0])}([i,o],n)/f(a,s)}function m(t,e,n,r){if(100===r)return r;var i=d(r,t),o=t[i-1],a=t[i];return n?r-o>(a-o)/2?a:o:e[i-1]?t[i-1]+function(t,e){return Math.round(t/e)*e}(r-t[i-1],e[i-1]):r}function g(e,n,i){var o;if("number"==typeof n&&(n=[n]),!Array.isArray(n))throw new Error("noUiSlider ("+t+"): 'range' contains invalid value.");if(!r(o="min"===e?0:"max"===e?100:parseFloat(e))||!r(n[0]))throw new Error("noUiSlider ("+t+"): 'range' value isn't numeric.");i.xPct.push(o),i.xVal.push(n[0]),o?i.xSteps.push(!isNaN(n[1])&&n[1]):isNaN(n[1])||(i.xSteps[0]=n[1]),i.xHighestCompleteStep.push(0)}function v(t,e,n){if(!e)return!0;n.xSteps[t]=p([n.xVal[t],n.xVal[t+1]],e)/f(n.xPct[t],n.xPct[t+1]);var r=(n.xVal[t+1]-n.xVal[t])/n.xNumSteps[t],i=Math.ceil(Number(r.toFixed(3))-1),o=n.xVal[t]+n.xNumSteps[t]*i;n.xHighestCompleteStep[t]=o}function b(t,e,n){var r;this.xPct=[],this.xVal=[],this.xSteps=[n||!1],this.xNumSteps=[!1],this.xHighestCompleteStep=[],this.snap=e;var i=[];for(r in t)t.hasOwnProperty(r)&&i.push([t[r],r]);for(i.length&&"object"==typeof i[0][0]?i.sort(function(t,e){return t[0][0]-e[0][0]}):i.sort(function(t,e){return t[0]-e[0]}),r=0;r<i.length;r++)g(i[r][1],i[r][0],this);for(this.xNumSteps=this.xSteps.slice(0),r=0;r<this.xNumSteps.length;r++)v(r,this.xNumSteps[r],this)}b.prototype.getMargin=function(e){var n=this.xNumSteps[0];if(n&&e/n%1!=0)throw new Error("noUiSlider ("+t+"): 'limit', 'margin' and 'padding' must be divisible by step.");return 2===this.xPct.length&&p(this.xVal,e)},b.prototype.toStepping=function(t){return t=h(this.xVal,this.xPct,t)},b.prototype.fromStepping=function(t){return function(t,e,n){if(n>=100)return t.slice(-1)[0];var r=d(n,e),i=t[r-1],o=t[r],a=e[r-1],s=e[r];return function(t,e){return e*(t[1]-t[0])/100+t[0]}([i,o],(n-a)*f(a,s))}(this.xVal,this.xPct,t)},b.prototype.getStep=function(t){return t=m(this.xPct,this.xSteps,this.snap,t)},b.prototype.getNearbySteps=function(t){var e=d(t,this.xPct);return{stepBefore:{startValue:this.xVal[e-2],step:this.xNumSteps[e-2],highestStep:this.xHighestCompleteStep[e-2]},thisStep:{startValue:this.xVal[e-1],step:this.xNumSteps[e-1],highestStep:this.xHighestCompleteStep[e-1]},stepAfter:{startValue:this.xVal[e],step:this.xNumSteps[e],highestStep:this.xHighestCompleteStep[e]}}},b.prototype.countStepDecimals=function(){var t=this.xNumSteps.map(s);return Math.max.apply(null,t)},b.prototype.convert=function(t){return this.getStep(this.toStepping(t))};var y={to:function(t){return void 0!==t&&t.toFixed(2)},from:Number};function w(e){if(function(t){return"object"==typeof t&&"function"==typeof t.to&&"function"==typeof t.from}(e))return!0;throw new Error("noUiSlider ("+t+"): 'format' requires 'to' and 'from' methods.")}function S(e,n){if(!r(n))throw new Error("noUiSlider ("+t+"): 'step' is not numeric.");e.singleStep=n}function x(e,n){if("object"!=typeof n||Array.isArray(n))throw new Error("noUiSlider ("+t+"): 'range' is not an object.");if(void 0===n.min||void 0===n.max)throw new Error("noUiSlider ("+t+"): Missing 'min' or 'max' in 'range'.");if(n.min===n.max)throw new Error("noUiSlider ("+t+"): 'range' 'min' and 'max' cannot be equal.");e.spectrum=new b(n,e.snap,e.singleStep)}function E(e,n){if(n=a(n),!Array.isArray(n)||!n.length)throw new Error("noUiSlider ("+t+"): 'start' option is incorrect.");e.handles=n.length,e.start=n}function C(e,n){if(e.snap=n,"boolean"!=typeof n)throw new Error("noUiSlider ("+t+"): 'snap' option must be a boolean.")}function N(e,n){if(e.animate=n,"boolean"!=typeof n)throw new Error("noUiSlider ("+t+"): 'animate' option must be a boolean.")}function A(e,n){if(e.animationDuration=n,"number"!=typeof n)throw new Error("noUiSlider ("+t+"): 'animationDuration' option must be a number.")}function O(e,n){var r,i=[!1];if("lower"===n?n=[!0,!1]:"upper"===n&&(n=[!1,!0]),!0===n||!1===n){for(r=1;r<e.handles;r++)i.push(n);i.push(!1)}else{if(!Array.isArray(n)||!n.length||n.length!==e.handles+1)throw new Error("noUiSlider ("+t+"): 'connect' option doesn't match handle count.");i=n}e.connect=i}function P(e,n){switch(n){case"horizontal":e.ort=0;break;case"vertical":e.ort=1;break;default:throw new Error("noUiSlider ("+t+"): 'orientation' option is invalid.")}}function k(e,n){if(!r(n))throw new Error("noUiSlider ("+t+"): 'margin' option must be numeric.");if(0!==n&&(e.margin=e.spectrum.getMargin(n),!e.margin))throw new Error("noUiSlider ("+t+"): 'margin' option is only supported on linear sliders.")}function M(e,n){if(!r(n))throw new Error("noUiSlider ("+t+"): 'limit' option must be numeric.");if(e.limit=e.spectrum.getMargin(n),!e.limit||e.handles<2)throw new Error("noUiSlider ("+t+"): 'limit' option is only supported on linear sliders with 2 or more handles.")}function j(e,n){if(!r(n)&&!Array.isArray(n))throw new Error("noUiSlider ("+t+"): 'padding' option must be numeric or array of exactly 2 numbers.");if(Array.isArray(n)&&2!==n.length&&!r(n[0])&&!r(n[1]))throw new Error("noUiSlider ("+t+"): 'padding' option must be numeric or array of exactly 2 numbers.");if(0!==n){if(Array.isArray(n)||(n=[n,n]),e.padding=[e.spectrum.getMargin(n[0]),e.spectrum.getMargin(n[1])],!1===e.padding[0]||!1===e.padding[1])throw new Error("noUiSlider ("+t+"): 'padding' option is only supported on linear sliders.");if(e.padding[0]<0||e.padding[1]<0)throw new Error("noUiSlider ("+t+"): 'padding' option must be a positive number(s).");if(e.padding[0]+e.padding[1]>=100)throw new Error("noUiSlider ("+t+"): 'padding' option must not exceed 100% of the range.")}}function U(e,n){switch(n){case"ltr":e.dir=0;break;case"rtl":e.dir=1;break;default:throw new Error("noUiSlider ("+t+"): 'direction' option was not recognized.")}}function V(e,n){if("string"!=typeof n)throw new Error("noUiSlider ("+t+"): 'behaviour' must be a string containing options.");var r=n.indexOf("tap")>=0,i=n.indexOf("drag")>=0,o=n.indexOf("fixed")>=0,a=n.indexOf("snap")>=0,s=n.indexOf("hover")>=0,u=n.indexOf("unconstrained")>=0;if(o){if(2!==e.handles)throw new Error("noUiSlider ("+t+"): 'fixed' behaviour must be used with 2 handles");k(e,e.start[1]-e.start[0])}if(u&&(e.margin||e.limit))throw new Error("noUiSlider ("+t+"): 'unconstrained' behaviour cannot be used with margin or limit");e.events={tap:r||a,drag:i,fixed:o,snap:a,hover:s,unconstrained:u}}function _(e,n){if(!1!==n)if(!0===n){e.tooltips=[];for(var r=0;r<e.handles;r++)e.tooltips.push(!0)}else{if(e.tooltips=a(n),e.tooltips.length!==e.handles)throw new Error("noUiSlider ("+t+"): must pass a formatter for all handles.");e.tooltips.forEach(function(e){if("boolean"!=typeof e&&("object"!=typeof e||"function"!=typeof e.to))throw new Error("noUiSlider ("+t+"): 'tooltips' must be passed a formatter or 'false'.")})}}function F(t,e){t.ariaFormat=e,w(e)}function L(t,e){t.format=e,w(e)}function z(e,n){if(e.keyboardSupport=n,"boolean"!=typeof n)throw new Error("noUiSlider ("+t+"): 'keyboardSupport' option must be a boolean.")}function T(t,e){t.documentElement=e}function H(e,n){if("string"!=typeof n&&!1!==n)throw new Error("noUiSlider ("+t+"): 'cssPrefix' must be a string or `false`.");e.cssPrefix=n}function D(e,n){if("object"!=typeof n)throw new Error("noUiSlider ("+t+"): 'cssClasses' must be an object.");if("string"==typeof e.cssPrefix)for(var r in e.cssClasses={},n)n.hasOwnProperty(r)&&(e.cssClasses[r]=e.cssPrefix+n[r]);else e.cssClasses=n}function R(n){var r={margin:0,limit:0,padding:0,animate:!0,animationDuration:300,ariaFormat:y,format:y},i={step:{r:!1,t:S},start:{r:!0,t:E},connect:{r:!0,t:O},direction:{r:!0,t:U},snap:{r:!1,t:C},animate:{r:!1,t:N},animationDuration:{r:!1,t:A},range:{r:!0,t:x},orientation:{r:!1,t:P},margin:{r:!1,t:k},limit:{r:!1,t:M},padding:{r:!1,t:j},behaviour:{r:!0,t:V},ariaFormat:{r:!1,t:F},format:{r:!1,t:L},tooltips:{r:!1,t:_},keyboardSupport:{r:!0,t:z},documentElement:{r:!1,t:T},cssPrefix:{r:!0,t:H},cssClasses:{r:!0,t:D}},o={connect:!1,direction:"ltr",behaviour:"tap",orientation:"horizontal",keyboardSupport:!0,cssPrefix:"noUi-",cssClasses:{target:"target",base:"base",origin:"origin",handle:"handle",handleLower:"handle-lower",handleUpper:"handle-upper",horizontal:"horizontal",vertical:"vertical",background:"background",connect:"connect",connects:"connects",ltr:"ltr",rtl:"rtl",draggable:"draggable",drag:"state-drag",tap:"state-tap",active:"active",tooltip:"tooltip",pips:"pips",pipsHorizontal:"pips-horizontal",pipsVertical:"pips-vertical",marker:"marker",markerHorizontal:"marker-horizontal",markerVertical:"marker-vertical",markerNormal:"marker-normal",markerLarge:"marker-large",markerSub:"marker-sub",value:"value",valueHorizontal:"value-horizontal",valueVertical:"value-vertical",valueNormal:"value-normal",valueLarge:"value-large",valueSub:"value-sub"}};n.format&&!n.ariaFormat&&(n.ariaFormat=n.format),Object.keys(i).forEach(function(a){if(!e(n[a])&&void 0===o[a]){if(i[a].r)throw new Error("noUiSlider ("+t+"): '"+a+"' is required.");return!0}i[a].t(r,e(n[a])?n[a]:o[a])}),r.pips=n.pips;var a=document.createElement("div"),s=void 0!==a.style.msTransform,u=void 0!==a.style.transform;return r.transformRule=u?"transform":s?"msTransform":"webkitTransform",r.style=[["left","top"],["right","bottom"]][r.dir][r.ort],r}function B(e,r,s){var f,p,d,h,m,g=window.navigator.pointerEnabled?{start:"pointerdown",move:"pointermove",end:"pointerup"}:window.navigator.msPointerEnabled?{start:"MSPointerDown",move:"MSPointerMove",end:"MSPointerUp"}:{start:"mousedown touchstart",move:"mousemove touchmove",end:"mouseup touchend"},v=window.CSS&&CSS.supports&&CSS.supports("touch-action","none"),b=v&&function(){var t=!1;try{var e=Object.defineProperty({},"passive",{get:function(){t=!0}});window.addEventListener("test",null,e)}catch(t){}return t}(),y=e,w=[],S=[],x=0,E=r.spectrum,C=[],N={},A=e.ownerDocument,O=r.documentElement||A.documentElement,P=A.body,k=-1,M=0,j=1,U=2,V="rtl"===A.dir||1===r.ort?0:100;function _(t,e){var n=A.createElement("div");return e&&u(n,e),t.appendChild(n),n}function F(t,e){var n=_(t,r.cssClasses.origin),i=_(n,r.cssClasses.handle);return i.setAttribute("data-handle",e),r.keyboardSupport&&i.setAttribute("tabindex","0"),i.setAttribute("role","slider"),i.setAttribute("aria-orientation",r.ort?"vertical":"horizontal"),0===e?u(i,r.cssClasses.handleLower):e===r.handles-1&&u(i,r.cssClasses.handleUpper),n}function L(t,e){return!!e&&_(t,r.cssClasses.connect)}function z(t,e){return!!r.tooltips[e]&&_(t.firstChild,r.cssClasses.tooltip)}function T(t,e,n){var i=A.createElement("div"),o=[];o[M]=r.cssClasses.valueNormal,o[j]=r.cssClasses.valueLarge,o[U]=r.cssClasses.valueSub;var a=[];a[M]=r.cssClasses.markerNormal,a[j]=r.cssClasses.markerLarge,a[U]=r.cssClasses.markerSub;var s=[r.cssClasses.valueHorizontal,r.cssClasses.valueVertical],c=[r.cssClasses.markerHorizontal,r.cssClasses.markerVertical];function l(t,e){var n=e===r.cssClasses.value,i=n?s:c,u=n?o:a;return e+" "+i[r.ort]+" "+u[t]}return u(i,r.cssClasses.pips),u(i,0===r.ort?r.cssClasses.pipsHorizontal:r.cssClasses.pipsVertical),Object.keys(t).forEach(function(o){!function(t,o,a){if((a=e?e(o,a):a)!==k){var s=_(i,!1);s.className=l(a,r.cssClasses.marker),s.style[r.style]=t+"%",a>M&&((s=_(i,!1)).className=l(a,r.cssClasses.value),s.setAttribute("data-value",o),s.style[r.style]=t+"%",s.innerHTML=n.to(o))}}(o,t[o][0],t[o][1])}),i}function H(){m&&(function(t){t.parentElement.removeChild(t)}(m),m=null)}function D(e){H();var n=e.mode,r=e.density||1,i=e.filter||!1,o=e.values||!1,a=e.stepped||!1,s=function(e,n,r){if("range"===e||"steps"===e)return E.xVal;if("count"===e){if(n<2)throw new Error("noUiSlider ("+t+"): 'values' (>= 2) required for mode 'count'.");var i=n-1,o=100/i;for(n=[];i--;)n[i]=i*o;n.push(100),e="positions"}return"positions"===e?n.map(function(t){return E.fromStepping(r?E.getStep(t):t)}):"values"===e?r?n.map(function(t){return E.fromStepping(E.getStep(E.toStepping(t)))}):n:void 0}(n,o,a),u=function(t,e,n){function r(t,e){return(t+e).toFixed(7)/1}var i={},o=E.xVal[0],a=E.xVal[E.xVal.length-1],s=!1,u=!1,c=0;return(n=function(t){return t.filter(function(t){return!this[t]&&(this[t]=!0)},{})}(n.slice().sort(function(t,e){return t-e})))[0]!==o&&(n.unshift(o),s=!0),n[n.length-1]!==a&&(n.push(a),u=!0),n.forEach(function(o,a){var l,f,p,d,h,m,g,v,b,y,w=o,S=n[a+1],x="steps"===e;if(x&&(l=E.xNumSteps[a]),l||(l=S-w),!1!==w&&void 0!==S)for(l=Math.max(l,1e-7),f=w;f<=S;f=r(f,l)){for(v=(h=(d=E.toStepping(f))-c)/t,y=h/(b=Math.round(v)),p=1;p<=b;p+=1)i[(m=c+p*y).toFixed(5)]=[E.fromStepping(m),0];g=n.indexOf(f)>-1?j:x?U:M,!a&&s&&(g=0),f===S&&u||(i[d.toFixed(5)]=[f,g]),c=d}}),i}(r,n,s),c=e.format||{to:Math.round};return m=y.appendChild(T(u,i,c))}function B(){var t=f.getBoundingClientRect(),e="offset"+["Width","Height"][r.ort];return 0===r.ort?t.width||f[e]:t.height||f[e]}function I(t,e,n,i){var o=function(o){return!!(o=function(t,e,n){var r,i,o=0===t.type.indexOf("touch"),a=0===t.type.indexOf("mouse"),s=0===t.type.indexOf("pointer");if(0===t.type.indexOf("MSPointer")&&(s=!0),o){var u=function(t){return t.target===n||n.contains(t.target)};if("touchstart"===t.type){var c=Array.prototype.filter.call(t.touches,u);if(c.length>1)return!1;r=c[0].pageX,i=c[0].pageY}else{var f=Array.prototype.find.call(t.changedTouches,u);if(!f)return!1;r=f.pageX,i=f.pageY}}return e=e||l(A),(a||s)&&(r=t.clientX+e.x,i=t.clientY+e.y),t.pageOffset=e,t.points=[r,i],t.cursor=a||s,t}(o,i.pageOffset,i.target||e))&&!(y.hasAttribute("disabled")&&!i.doNotReject)&&!(function(t,e){return t.classList?t.classList.contains(e):new RegExp("\\b"+e+"\\b").test(t.className)}(y,r.cssClasses.tap)&&!i.doNotReject)&&!(t===g.start&&void 0!==o.buttons&&o.buttons>1)&&(!i.hover||!o.buttons)&&(b||o.preventDefault(),o.calcPoint=o.points[r.ort],void n(o,i))},a=[];return t.split(" ").forEach(function(t){e.addEventListener(t,o,!!b&&{passive:!0}),a.push([t,o])}),a}function q(t){var e=t-function(t,e){var n=t.getBoundingClientRect(),r=t.ownerDocument,i=r.documentElement,o=l(r);return/webkit.*Chrome.*Mobile/i.test(navigator.userAgent)&&(o.x=0),e?n.top+o.y-i.clientTop:n.left+o.x-i.clientLeft}(f,r.ort),n=100*e/B();return n=o(n),r.dir?100-n:n}function W(t,e){"mouseout"===t.type&&"HTML"===t.target.nodeName&&null===t.relatedTarget&&$(t,e)}function X(t,e){if(-1===navigator.appVersion.indexOf("MSIE 9")&&0===t.buttons&&0!==e.buttonsProperty)return $(t,e);var n=(r.dir?-1:1)*(t.calcPoint-e.startCalcPoint),i=100*n/e.baseSize;nt(n>0,i,e.locations,e.handleNumbers)}function $(t,e){e.handle&&(c(e.handle,r.cssClasses.active),x-=1),e.listeners.forEach(function(t){O.removeEventListener(t[0],t[1])}),0===x&&(c(y,r.cssClasses.drag),it(),t.cursor&&(P.style.cursor="",P.removeEventListener("selectstart",n))),e.handleNumbers.forEach(function(t){Q("change",t),Q("set",t),Q("end",t)})}function Y(t,e){var i;if(1===e.handleNumbers.length){var o=p[e.handleNumbers[0]];if(o.hasAttribute("disabled"))return!1;i=o.children[0],x+=1,u(i,r.cssClasses.active)}t.stopPropagation();var a=[],s=I(g.move,O,X,{target:t.target,handle:i,listeners:a,startCalcPoint:t.calcPoint,baseSize:B(),pageOffset:t.pageOffset,handleNumbers:e.handleNumbers,buttonsProperty:t.buttons,locations:w.slice()}),c=I(g.end,O,$,{target:t.target,handle:i,listeners:a,doNotReject:!0,handleNumbers:e.handleNumbers}),l=I("mouseout",O,W,{target:t.target,handle:i,listeners:a,doNotReject:!0,handleNumbers:e.handleNumbers});a.push.apply(a,s.concat(c,l)),t.cursor&&(P.style.cursor=getComputedStyle(t.target).cursor,p.length>1&&u(y,r.cssClasses.drag),P.addEventListener("selectstart",n,!1)),e.handleNumbers.forEach(function(t){Q("start",t)})}function G(t){t.stopPropagation();var e=q(t.calcPoint),n=function(t){var e=100,n=!1;return p.forEach(function(r,i){if(!r.hasAttribute("disabled")){var o=Math.abs(w[i]-t);(o<e||100===o&&100===e)&&(n=i,e=o)}}),n}(e);if(!1===n)return!1;r.events.snap||i(y,r.cssClasses.tap,r.animationDuration),ot(n,e,!0,!0),it(),Q("slide",n,!0),Q("update",n,!0),Q("change",n,!0),Q("set",n,!0),r.events.snap&&Y(t,{handleNumbers:[n]})}function J(t){var e=q(t.calcPoint),n=E.getStep(e),r=E.fromStepping(n);Object.keys(N).forEach(function(t){"hover"===t.split(".")[0]&&N[t].forEach(function(t){t.call(h,r)})})}function K(t,e){N[t]=N[t]||[],N[t].push(e),"update"===t.split(".")[0]&&p.forEach(function(t,e){Q("update",e)})}function Q(t,e,n){Object.keys(N).forEach(function(i){var o=i.split(".")[0];t===o&&N[i].forEach(function(t){t.call(h,C.map(r.format.to),e,C.slice(),n||!1,w.slice())})})}function Z(t){return t+"%"}function tt(t,e,n,i,a,s){return p.length>1&&!r.events.unconstrained&&(i&&e>0&&(n=Math.max(n,t[e-1]+r.margin)),a&&e<p.length-1&&(n=Math.min(n,t[e+1]-r.margin))),p.length>1&&r.limit&&(i&&e>0&&(n=Math.min(n,t[e-1]+r.limit)),a&&e<p.length-1&&(n=Math.max(n,t[e+1]-r.limit))),r.padding&&(0===e&&(n=Math.max(n,r.padding[0])),e===p.length-1&&(n=Math.min(n,100-r.padding[1]))),!((n=o(n=E.getStep(n)))===t[e]&&!s)&&n}function et(t,e){var n=r.ort;return(n?e:t)+", "+(n?t:e)}function nt(t,e,n,r){var i=n.slice(),o=[!t,t],a=[t,!t];r=r.slice(),t&&r.reverse(),r.length>1?r.forEach(function(t,n){var r=tt(i,t,i[t]+e,o[n],a[n],!1);!1===r?e=0:(e=r-i[t],i[t]=r)}):o=a=[!0];var s=!1;r.forEach(function(t,r){s=ot(t,n[t]+e,o[r],a[r])||s}),s&&r.forEach(function(t){Q("update",t),Q("slide",t)})}function rt(t,e){return r.dir?100-t-e:t}function it(){S.forEach(function(t){var e=w[t]>50?-1:1,n=3+(p.length+e*t);p[t].style.zIndex=n})}function ot(t,e,n,i){return!1!==(e=tt(w,t,e,n,i,!1))&&(function(t,e){w[t]=e,C[t]=E.fromStepping(e);var n="translate("+et(Z(rt(e,0)-V),"0")+")";p[t].style[r.transformRule]=n,at(t),at(t+1)}(t,e),!0)}function at(t){if(d[t]){var e=0,n=100;0!==t&&(e=w[t-1]),t!==d.length-1&&(n=w[t]);var i=n-e,o="translate("+et(Z(rt(e,i)),"0")+")",a="scale("+et(i/100,"1")+")";d[t].style[r.transformRule]=o+" "+a}}function st(t,e){var n=a(t),o=void 0===w[0];e=void 0===e||!!e,r.animate&&!o&&i(y,r.cssClasses.tap,r.animationDuration),S.forEach(function(t){ot(t,function(t,e){return null===t||!1===t||void 0===t?w[e]:("number"==typeof t&&(t=String(t)),t=r.format.from(t),!1===(t=E.toStepping(t))||isNaN(t)?w[e]:t)}(n[t],t),!0,!1)}),S.forEach(function(t){ot(t,w[t],!0,!0)}),it(),S.forEach(function(t){Q("update",t),null!==n[t]&&e&&Q("set",t)})}function ut(){var t=C.map(r.format.to);return 1===t.length?t[0]:t}return f=function(t){return u(t,r.cssClasses.target),0===r.dir?u(t,r.cssClasses.ltr):u(t,r.cssClasses.rtl),0===r.ort?u(t,r.cssClasses.horizontal):u(t,r.cssClasses.vertical),_(t,r.cssClasses.base)}(y),function(t,e){var n=_(e,r.cssClasses.connects);p=[],(d=[]).push(L(n,t[0]));for(var i=0;i<r.handles;i++)p.push(F(e,i)),S[i]=i,d.push(L(n,t[i+1]))}(r.connect,f),function(t){t.fixed||p.forEach(function(t,e){I(g.start,t.children[0],Y,{handleNumbers:[e]})}),t.tap&&I(g.start,f,G,{}),t.hover&&I(g.move,f,J,{hover:!0}),t.drag&&d.forEach(function(e,n){if(!1!==e&&0!==n&&n!==d.length-1){var i=p[n-1],o=p[n],a=[e];u(e,r.cssClasses.draggable),t.fixed&&(a.push(i.children[0]),a.push(o.children[0])),a.forEach(function(t){I(g.start,t,Y,{handles:[i,o],handleNumbers:[n-1,n]})})}})}(r.events),st(r.start),h={destroy:function(){for(var t in r.cssClasses)r.cssClasses.hasOwnProperty(t)&&c(y,r.cssClasses[t]);for(;y.firstChild;)y.removeChild(y.firstChild);delete y.noUiSlider},steps:function(){return w.map(function(t,e){var n=E.getNearbySteps(t),r=C[e],i=n.thisStep.step,o=null;!1!==i&&r+i>n.stepAfter.startValue&&(i=n.stepAfter.startValue-r),o=r>n.thisStep.startValue?n.thisStep.step:!1!==n.stepBefore.step&&r-n.stepBefore.highestStep,100===t?i=null:0===t&&(o=null);var a=E.countStepDecimals();return null!==i&&!1!==i&&(i=Number(i.toFixed(a))),null!==o&&!1!==o&&(o=Number(o.toFixed(a))),[o,i]})},on:K,off:function(t){var e=t&&t.split(".")[0],n=e&&t.substring(e.length);Object.keys(N).forEach(function(t){var r=t.split(".")[0],i=t.substring(r.length);e&&e!==r||n&&n!==i||delete N[t]})},get:ut,set:st,setHandle:function(e,n,r){var i=[];if(!((e=Number(e))>=0&&e<S.length))throw new Error("noUiSlider ("+t+"): invalid handle number, got: "+e);for(var o=0;o<S.length;o++)i[o]=null;i[e]=n,st(i,r)},reset:function(t){st(r.start,t)},__moveHandles:function(t,e,n){nt(t,e,w,n)},options:s,updateOptions:function(t,e){var n=ut(),i=["margin","limit","padding","range","animate","snap","step","format"];i.forEach(function(e){void 0!==t[e]&&(s[e]=t[e])});var o=R(s);i.forEach(function(e){void 0!==t[e]&&(r[e]=o[e])}),E=o.spectrum,r.margin=o.margin,r.limit=o.limit,r.padding=o.padding,r.pips&&D(r.pips),w=[],st(t.start||n,e)},target:y,removePips:H,pips:D},r.pips&&D(r.pips),r.tooltips&&function(){var t=p.map(z);K("update",function(e,n,i){if(t[n]){var o=e[n];!0!==r.tooltips[n]&&(o=r.tooltips[n].to(i[n])),t[n].innerHTML=o}})}(),K("update",function(t,e,n,i,o){S.forEach(function(t){var e=p[t],i=tt(w,t,0,!0,!0,!0),a=tt(w,t,100,!0,!0,!0),s=o[t],u=r.ariaFormat.to(n[t]);i=E.fromStepping(i).toFixed(1),a=E.fromStepping(a).toFixed(1),s=E.fromStepping(s).toFixed(1),e.children[0].setAttribute("aria-valuemin",i),e.children[0].setAttribute("aria-valuemax",a),e.children[0].setAttribute("aria-valuenow",s),e.children[0].setAttribute("aria-valuetext",u)})}),h}return{__spectrum:b,version:t,create:function(e,n){if(!e||!e.nodeName)throw new Error("noUiSlider ("+t+"): create requires a single element, got: "+e);if(e.noUiSlider)throw new Error("noUiSlider ("+t+"): Slider was already initialized.");var r=R(n),i=B(e,r,n);return e.noUiSlider=i,i}}})?r.apply(e,i):r)||(t.exports=o)}});