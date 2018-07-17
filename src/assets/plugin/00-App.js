/* md5/md5.min.js */
!function(n){"use strict";function t(n,t){var r=(65535&n)+(65535&t);return(n>>16)+(t>>16)+(r>>16)<<16|65535&r}function r(n,t){return n<<t|n>>>32-t}function e(n,e,o,u,c,f){return t(r(t(t(e,n),t(u,f)),c),o)}function o(n,t,r,o,u,c,f){return e(t&r|~t&o,n,t,u,c,f)}function u(n,t,r,o,u,c,f){return e(t&o|r&~o,n,t,u,c,f)}function c(n,t,r,o,u,c,f){return e(t^r^o,n,t,u,c,f)}function f(n,t,r,o,u,c,f){return e(r^(t|~o),n,t,u,c,f)}function i(n,r){n[r>>5]|=128<<r%32,n[14+(r+64>>>9<<4)]=r;var e,i,a,d,h,l=1732584193,g=-271733879,v=-1732584194,m=271733878;for(e=0;e<n.length;e+=16)i=l,a=g,d=v,h=m,g=f(g=f(g=f(g=f(g=c(g=c(g=c(g=c(g=u(g=u(g=u(g=u(g=o(g=o(g=o(g=o(g,v=o(v,m=o(m,l=o(l,g,v,m,n[e],7,-680876936),g,v,n[e+1],12,-389564586),l,g,n[e+2],17,606105819),m,l,n[e+3],22,-1044525330),v=o(v,m=o(m,l=o(l,g,v,m,n[e+4],7,-176418897),g,v,n[e+5],12,1200080426),l,g,n[e+6],17,-1473231341),m,l,n[e+7],22,-45705983),v=o(v,m=o(m,l=o(l,g,v,m,n[e+8],7,1770035416),g,v,n[e+9],12,-1958414417),l,g,n[e+10],17,-42063),m,l,n[e+11],22,-1990404162),v=o(v,m=o(m,l=o(l,g,v,m,n[e+12],7,1804603682),g,v,n[e+13],12,-40341101),l,g,n[e+14],17,-1502002290),m,l,n[e+15],22,1236535329),v=u(v,m=u(m,l=u(l,g,v,m,n[e+1],5,-165796510),g,v,n[e+6],9,-1069501632),l,g,n[e+11],14,643717713),m,l,n[e],20,-373897302),v=u(v,m=u(m,l=u(l,g,v,m,n[e+5],5,-701558691),g,v,n[e+10],9,38016083),l,g,n[e+15],14,-660478335),m,l,n[e+4],20,-405537848),v=u(v,m=u(m,l=u(l,g,v,m,n[e+9],5,568446438),g,v,n[e+14],9,-1019803690),l,g,n[e+3],14,-187363961),m,l,n[e+8],20,1163531501),v=u(v,m=u(m,l=u(l,g,v,m,n[e+13],5,-1444681467),g,v,n[e+2],9,-51403784),l,g,n[e+7],14,1735328473),m,l,n[e+12],20,-1926607734),v=c(v,m=c(m,l=c(l,g,v,m,n[e+5],4,-378558),g,v,n[e+8],11,-2022574463),l,g,n[e+11],16,1839030562),m,l,n[e+14],23,-35309556),v=c(v,m=c(m,l=c(l,g,v,m,n[e+1],4,-1530992060),g,v,n[e+4],11,1272893353),l,g,n[e+7],16,-155497632),m,l,n[e+10],23,-1094730640),v=c(v,m=c(m,l=c(l,g,v,m,n[e+13],4,681279174),g,v,n[e],11,-358537222),l,g,n[e+3],16,-722521979),m,l,n[e+6],23,76029189),v=c(v,m=c(m,l=c(l,g,v,m,n[e+9],4,-640364487),g,v,n[e+12],11,-421815835),l,g,n[e+15],16,530742520),m,l,n[e+2],23,-995338651),v=f(v,m=f(m,l=f(l,g,v,m,n[e],6,-198630844),g,v,n[e+7],10,1126891415),l,g,n[e+14],15,-1416354905),m,l,n[e+5],21,-57434055),v=f(v,m=f(m,l=f(l,g,v,m,n[e+12],6,1700485571),g,v,n[e+3],10,-1894986606),l,g,n[e+10],15,-1051523),m,l,n[e+1],21,-2054922799),v=f(v,m=f(m,l=f(l,g,v,m,n[e+8],6,1873313359),g,v,n[e+15],10,-30611744),l,g,n[e+6],15,-1560198380),m,l,n[e+13],21,1309151649),v=f(v,m=f(m,l=f(l,g,v,m,n[e+4],6,-145523070),g,v,n[e+11],10,-1120210379),l,g,n[e+2],15,718787259),m,l,n[e+9],21,-343485551),l=t(l,i),g=t(g,a),v=t(v,d),m=t(m,h);return[l,g,v,m]}function a(n){var t,r="",e=32*n.length;for(t=0;t<e;t+=8)r+=String.fromCharCode(n[t>>5]>>>t%32&255);return r}function d(n){var t,r=[];for(r[(n.length>>2)-1]=void 0,t=0;t<r.length;t+=1)r[t]=0;var e=8*n.length;for(t=0;t<e;t+=8)r[t>>5]|=(255&n.charCodeAt(t/8))<<t%32;return r}function h(n){return a(i(d(n),8*n.length))}function l(n,t){var r,e,o=d(n),u=[],c=[];for(u[15]=c[15]=void 0,o.length>16&&(o=i(o,8*n.length)),r=0;r<16;r+=1)u[r]=909522486^o[r],c[r]=1549556828^o[r];return e=i(u.concat(d(t)),512+8*t.length),a(i(c.concat(e),640))}function g(n){var t,r,e="";for(r=0;r<n.length;r+=1)t=n.charCodeAt(r),e+="0123456789abcdef".charAt(t>>>4&15)+"0123456789abcdef".charAt(15&t);return e}function v(n){return unescape(encodeURIComponent(n))}function m(n){return h(v(n))}function p(n){return g(m(n))}function s(n,t){return l(v(n),v(t))}function C(n,t){return g(s(n,t))}function A(n,t,r){return t?r?s(t,n):C(t,n):r?m(n):p(n)}"function"==typeof define&&define.amd?define(function(){return A}):"object"==typeof module&&module.exports?module.exports=A:n.md5=A}(this);

/* promise/es6-promise.auto.min.js */
!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):t.ES6Promise=e()}(this,function(){"use strict";function t(t){var e=typeof t;return null!==t&&("object"===e||"function"===e)}function e(t){return"function"==typeof t}function n(t){B=t}function r(t){G=t}function o(){return function(){return process.nextTick(a)}}function i(){return"undefined"!=typeof z?function(){z(a)}:c()}function s(){var t=0,e=new J(a),n=document.createTextNode("");return e.observe(n,{characterData:!0}),function(){n.data=t=++t%2}}function u(){var t=new MessageChannel;return t.port1.onmessage=a,function(){return t.port2.postMessage(0)}}function c(){var t=setTimeout;return function(){return t(a,1)}}function a(){for(var t=0;t<W;t+=2){var e=V[t],n=V[t+1];e(n),V[t]=void 0,V[t+1]=void 0}W=0}function f(){try{var t=Function("return this")().require("vertx");return z=t.runOnLoop||t.runOnContext,i()}catch(e){return c()}}function l(t,e){var n=this,r=new this.constructor(p);void 0===r[Z]&&O(r);var o=n._state;if(o){var i=arguments[o-1];G(function(){return P(o,r,i,n._result)})}else E(n,r,t,e);return r}function h(t){var e=this;if(t&&"object"==typeof t&&t.constructor===e)return t;var n=new e(p);return g(n,t),n}function p(){}function v(){return new TypeError("You cannot resolve a promise with itself")}function d(){return new TypeError("A promises callback cannot return that same promise.")}function _(t){try{return t.then}catch(e){return nt.error=e,nt}}function y(t,e,n,r){try{t.call(e,n,r)}catch(o){return o}}function m(t,e,n){G(function(t){var r=!1,o=y(n,e,function(n){r||(r=!0,e!==n?g(t,n):S(t,n))},function(e){r||(r=!0,j(t,e))},"Settle: "+(t._label||" unknown promise"));!r&&o&&(r=!0,j(t,o))},t)}function b(t,e){e._state===tt?S(t,e._result):e._state===et?j(t,e._result):E(e,void 0,function(e){return g(t,e)},function(e){return j(t,e)})}function w(t,n,r){n.constructor===t.constructor&&r===l&&n.constructor.resolve===h?b(t,n):r===nt?(j(t,nt.error),nt.error=null):void 0===r?S(t,n):e(r)?m(t,n,r):S(t,n)}function g(e,n){e===n?j(e,v()):t(n)?w(e,n,_(n)):S(e,n)}function A(t){t._onerror&&t._onerror(t._result),T(t)}function S(t,e){t._state===$&&(t._result=e,t._state=tt,0!==t._subscribers.length&&G(T,t))}function j(t,e){t._state===$&&(t._state=et,t._result=e,G(A,t))}function E(t,e,n,r){var o=t._subscribers,i=o.length;t._onerror=null,o[i]=e,o[i+tt]=n,o[i+et]=r,0===i&&t._state&&G(T,t)}function T(t){var e=t._subscribers,n=t._state;if(0!==e.length){for(var r=void 0,o=void 0,i=t._result,s=0;s<e.length;s+=3)r=e[s],o=e[s+n],r?P(n,r,o,i):o(i);t._subscribers.length=0}}function M(t,e){try{return t(e)}catch(n){return nt.error=n,nt}}function P(t,n,r,o){var i=e(r),s=void 0,u=void 0,c=void 0,a=void 0;if(i){if(s=M(r,o),s===nt?(a=!0,u=s.error,s.error=null):c=!0,n===s)return void j(n,d())}else s=o,c=!0;n._state!==$||(i&&c?g(n,s):a?j(n,u):t===tt?S(n,s):t===et&&j(n,s))}function x(t,e){try{e(function(e){g(t,e)},function(e){j(t,e)})}catch(n){j(t,n)}}function C(){return rt++}function O(t){t[Z]=rt++,t._state=void 0,t._result=void 0,t._subscribers=[]}function k(){return new Error("Array Methods must be provided an Array")}function F(t){return new ot(this,t).promise}function Y(t){var e=this;return new e(U(t)?function(n,r){for(var o=t.length,i=0;i<o;i++)e.resolve(t[i]).then(n,r)}:function(t,e){return e(new TypeError("You must pass an array to race."))})}function q(t){var e=this,n=new e(p);return j(n,t),n}function D(){throw new TypeError("You must pass a resolver function as the first argument to the promise constructor")}function K(){throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.")}function L(){var t=void 0;if("undefined"!=typeof global)t=global;else if("undefined"!=typeof self)t=self;else try{t=Function("return this")()}catch(e){throw new Error("polyfill failed because global object is unavailable in this environment")}var n=t.Promise;if(n){var r=null;try{r=Object.prototype.toString.call(n.resolve())}catch(e){}if("[object Promise]"===r&&!n.cast)return}t.Promise=it}var N=void 0;N=Array.isArray?Array.isArray:function(t){return"[object Array]"===Object.prototype.toString.call(t)};var U=N,W=0,z=void 0,B=void 0,G=function(t,e){V[W]=t,V[W+1]=e,W+=2,2===W&&(B?B(a):X())},H="undefined"!=typeof window?window:void 0,I=H||{},J=I.MutationObserver||I.WebKitMutationObserver,Q="undefined"==typeof self&&"undefined"!=typeof process&&"[object process]"==={}.toString.call(process),R="undefined"!=typeof Uint8ClampedArray&&"undefined"!=typeof importScripts&&"undefined"!=typeof MessageChannel,V=new Array(1e3),X=void 0;X=Q?o():J?s():R?u():void 0===H&&"function"==typeof require?f():c();var Z=Math.random().toString(36).substring(2),$=void 0,tt=1,et=2,nt={error:null},rt=0,ot=function(){function t(t,e){this._instanceConstructor=t,this.promise=new t(p),this.promise[Z]||O(this.promise),U(e)?(this.length=e.length,this._remaining=e.length,this._result=new Array(this.length),0===this.length?S(this.promise,this._result):(this.length=this.length||0,this._enumerate(e),0===this._remaining&&S(this.promise,this._result))):j(this.promise,k())}return t.prototype._enumerate=function(t){for(var e=0;this._state===$&&e<t.length;e++)this._eachEntry(t[e],e)},t.prototype._eachEntry=function(t,e){var n=this._instanceConstructor,r=n.resolve;if(r===h){var o=_(t);if(o===l&&t._state!==$)this._settledAt(t._state,e,t._result);else if("function"!=typeof o)this._remaining--,this._result[e]=t;else if(n===it){var i=new n(p);w(i,t,o),this._willSettleAt(i,e)}else this._willSettleAt(new n(function(e){return e(t)}),e)}else this._willSettleAt(r(t),e)},t.prototype._settledAt=function(t,e,n){var r=this.promise;r._state===$&&(this._remaining--,t===et?j(r,n):this._result[e]=n),0===this._remaining&&S(r,this._result)},t.prototype._willSettleAt=function(t,e){var n=this;E(t,void 0,function(t){return n._settledAt(tt,e,t)},function(t){return n._settledAt(et,e,t)})},t}(),it=function(){function t(e){this[Z]=C(),this._result=this._state=void 0,this._subscribers=[],p!==e&&("function"!=typeof e&&D(),this instanceof t?x(this,e):K())}return t.prototype["catch"]=function(t){return this.then(null,t)},t.prototype["finally"]=function(t){var e=this,n=e.constructor;return e.then(function(e){return n.resolve(t()).then(function(){return e})},function(e){return n.resolve(t()).then(function(){throw e})})},t}();return it.prototype.then=l,it.all=F,it.race=Y,it.resolve=h,it.reject=q,it._setScheduler=n,it._setAsap=r,it._asap=G,it.polyfill=L,it.Promise=it,it.polyfill(),it});

/* cleave/dist/cleave.min.js */
/*!
 * cleave.js - 1.3.8
 * https://github.com/nosir/cleave.js
 * Apache License Version 2.0
 *
 * Copyright (C) 2012-2018 Max Huang https://github.com/nosir/
 */
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.Cleave=t():e.Cleave=t()}(this,function(){return function(e){function t(n){if(r[n])return r[n].exports;var i=r[n]={exports:{},id:n,loaded:!1};return e[n].call(i.exports,i,i.exports,t),i.loaded=!0,i.exports}var r={};return t.m=e,t.c=r,t.p="",t(0)}([function(e,t,r){(function(t){"use strict";var n=function(e,t){var r=this;if("string"==typeof e?r.element=document.querySelector(e):r.element="undefined"!=typeof e.length&&e.length>0?e[0]:e,!r.element)throw new Error("[cleave.js] Please check the element");t.initValue=r.element.value,r.properties=n.DefaultProperties.assign({},t),r.init()};n.prototype={init:function(){var e=this,t=e.properties;return t.numeral||t.phone||t.creditCard||t.date||0!==t.blocksLength||t.prefix?(t.maxLength=n.Util.getMaxLength(t.blocks),e.isAndroid=n.Util.isAndroid(),e.lastInputValue="",e.onChangeListener=e.onChange.bind(e),e.onKeyDownListener=e.onKeyDown.bind(e),e.onFocusListener=e.onFocus.bind(e),e.onCutListener=e.onCut.bind(e),e.onCopyListener=e.onCopy.bind(e),e.element.addEventListener("input",e.onChangeListener),e.element.addEventListener("keydown",e.onKeyDownListener),e.element.addEventListener("focus",e.onFocusListener),e.element.addEventListener("cut",e.onCutListener),e.element.addEventListener("copy",e.onCopyListener),e.initPhoneFormatter(),e.initDateFormatter(),e.initNumeralFormatter(),void((t.initValue||t.prefix&&!t.noImmediatePrefix)&&e.onInput(t.initValue))):void e.onInput(t.initValue)},initNumeralFormatter:function(){var e=this,t=e.properties;t.numeral&&(t.numeralFormatter=new n.NumeralFormatter(t.numeralDecimalMark,t.numeralIntegerScale,t.numeralDecimalScale,t.numeralThousandsGroupStyle,t.numeralPositiveOnly,t.stripLeadingZeroes,t.delimiter))},initDateFormatter:function(){var e=this,t=e.properties;t.date&&(t.dateFormatter=new n.DateFormatter(t.datePattern),t.blocks=t.dateFormatter.getBlocks(),t.blocksLength=t.blocks.length,t.maxLength=n.Util.getMaxLength(t.blocks))},initPhoneFormatter:function(){var e=this,t=e.properties;if(t.phone)try{t.phoneFormatter=new n.PhoneFormatter(new t.root.Cleave.AsYouTypeFormatter(t.phoneRegionCode),t.delimiter)}catch(r){throw new Error("[cleave.js] Please include phone-type-formatter.{country}.js lib")}},onKeyDown:function(e){var t=this,r=t.properties,i=e.which||e.keyCode,a=n.Util,o=t.element.value;return a.isAndroidBackspaceKeydown(t.lastInputValue,o)&&(i=8),t.lastInputValue=o,8===i&&a.isDelimiter(o.slice(-r.delimiterLength),r.delimiter,r.delimiters)?void(r.backspace=!0):void(r.backspace=!1)},onChange:function(){this.onInput(this.element.value)},onFocus:function(){var e=this,t=e.properties;n.Util.fixPrefixCursor(e.element,t.prefix,t.delimiter,t.delimiters)},onCut:function(e){this.copyClipboardData(e),this.onInput("")},onCopy:function(e){this.copyClipboardData(e)},copyClipboardData:function(e){var t=this,r=t.properties,i=n.Util,a=t.element.value,o="";o=r.copyDelimiter?a:i.stripDelimiters(a,r.delimiter,r.delimiters);try{e.clipboardData?e.clipboardData.setData("Text",o):window.clipboardData.setData("Text",o),e.preventDefault()}catch(l){}},onInput:function(e){var t=this,r=t.properties,i=n.Util;return r.numeral||!r.backspace||i.isDelimiter(e.slice(-r.delimiterLength),r.delimiter,r.delimiters)||(e=i.headStr(e,e.length-r.delimiterLength)),r.phone?(!r.prefix||r.noImmediatePrefix&&!e.length?r.result=r.phoneFormatter.format(e):r.result=r.prefix+r.phoneFormatter.format(e).slice(r.prefix.length),void t.updateValueState()):r.numeral?(!r.prefix||r.noImmediatePrefix&&!e.length?r.result=r.numeralFormatter.format(e):r.result=r.prefix+r.numeralFormatter.format(e),void t.updateValueState()):(r.date&&(e=r.dateFormatter.getValidatedDate(e)),e=i.stripDelimiters(e,r.delimiter,r.delimiters),e=i.getPrefixStrippedValue(e,r.prefix,r.prefixLength,r.result),e=r.numericOnly?i.strip(e,/[^\d]/g):e,e=r.uppercase?e.toUpperCase():e,e=r.lowercase?e.toLowerCase():e,!r.prefix||r.noImmediatePrefix&&!e.length||(e=r.prefix+e,0!==r.blocksLength)?(r.creditCard&&t.updateCreditCardPropsByValue(e),e=i.headStr(e,r.maxLength),r.result=i.getFormattedValue(e,r.blocks,r.blocksLength,r.delimiter,r.delimiters,r.delimiterLazyShow),void t.updateValueState()):(r.result=e,void t.updateValueState()))},updateCreditCardPropsByValue:function(e){var t,r=this,i=r.properties,a=n.Util;a.headStr(i.result,4)!==a.headStr(e,4)&&(t=n.CreditCardDetector.getInfo(e,i.creditCardStrictMode),i.blocks=t.blocks,i.blocksLength=i.blocks.length,i.maxLength=a.getMaxLength(i.blocks),i.creditCardType!==t.type&&(i.creditCardType=t.type,i.onCreditCardTypeChanged.call(r,i.creditCardType)))},updateValueState:function(){var e=this,t=n.Util,r=e.properties;if(e.element){var i=e.element.selectionEnd,a=e.element.value,o=r.result;if(i=t.getNextCursorPosition(i,a,o,r.delimiter,r.delimiters),e.isAndroid)return void window.setTimeout(function(){e.element.value=o,t.setSelection(e.element,i,r.document,!1),e.callOnValueChanged()},1);e.element.value=o,t.setSelection(e.element,i,r.document,!1),e.callOnValueChanged()}},callOnValueChanged:function(){var e=this,t=e.properties;t.onValueChanged.call(e,{target:{value:t.result,rawValue:e.getRawValue()}})},setPhoneRegionCode:function(e){var t=this,r=t.properties;r.phoneRegionCode=e,t.initPhoneFormatter(),t.onChange()},setRawValue:function(e){var t=this,r=t.properties;e=void 0!==e&&null!==e?e.toString():"",r.numeral&&(e=e.replace(".",r.numeralDecimalMark)),r.backspace=!1,t.element.value=e,t.onInput(e)},getRawValue:function(){var e=this,t=e.properties,r=n.Util,i=e.element.value;return t.rawValueTrimPrefix&&(i=r.getPrefixStrippedValue(i,t.prefix,t.prefixLength,t.result)),i=t.numeral?t.numeralFormatter.getRawValue(i):r.stripDelimiters(i,t.delimiter,t.delimiters)},getISOFormatDate:function(){var e=this,t=e.properties;return t.date?t.dateFormatter.getISOFormatDate():""},getFormattedValue:function(){return this.element.value},destroy:function(){var e=this;e.element.removeEventListener("input",e.onChangeListener),e.element.removeEventListener("keydown",e.onKeyDownListener),e.element.removeEventListener("focus",e.onFocusListener),e.element.removeEventListener("cut",e.onCutListener),e.element.removeEventListener("copy",e.onCopyListener)},toString:function(){return"[Cleave Object]"}},n.NumeralFormatter=r(1),n.DateFormatter=r(2),n.PhoneFormatter=r(3),n.CreditCardDetector=r(4),n.Util=r(5),n.DefaultProperties=r(6),("object"==typeof t&&t?t:window).Cleave=n,e.exports=n}).call(t,function(){return this}())},function(e,t){"use strict";var r=function(e,t,n,i,a,o,l){var s=this;s.numeralDecimalMark=e||".",s.numeralIntegerScale=t>0?t:0,s.numeralDecimalScale=n>=0?n:2,s.numeralThousandsGroupStyle=i||r.groupStyle.thousand,s.numeralPositiveOnly=!!a,s.stripLeadingZeroes=o!==!1,s.delimiter=l||""===l?l:",",s.delimiterRE=l?new RegExp("\\"+l,"g"):""};r.groupStyle={thousand:"thousand",lakh:"lakh",wan:"wan",none:"none"},r.prototype={getRawValue:function(e){return e.replace(this.delimiterRE,"").replace(this.numeralDecimalMark,".")},format:function(e){var t,n,i=this,a="";switch(e=e.replace(/[A-Za-z]/g,"").replace(i.numeralDecimalMark,"M").replace(/[^\dM-]/g,"").replace(/^\-/,"N").replace(/\-/g,"").replace("N",i.numeralPositiveOnly?"":"-").replace("M",i.numeralDecimalMark),i.stripLeadingZeroes&&(e=e.replace(/^(-)?0+(?=\d)/,"$1")),n=e,e.indexOf(i.numeralDecimalMark)>=0&&(t=e.split(i.numeralDecimalMark),n=t[0],a=i.numeralDecimalMark+t[1].slice(0,i.numeralDecimalScale)),i.numeralIntegerScale>0&&(n=n.slice(0,i.numeralIntegerScale+("-"===e.slice(0,1)?1:0))),i.numeralThousandsGroupStyle){case r.groupStyle.lakh:n=n.replace(/(\d)(?=(\d\d)+\d$)/g,"$1"+i.delimiter);break;case r.groupStyle.wan:n=n.replace(/(\d)(?=(\d{4})+$)/g,"$1"+i.delimiter);break;case r.groupStyle.thousand:n=n.replace(/(\d)(?=(\d{3})+$)/g,"$1"+i.delimiter)}return n.toString()+(i.numeralDecimalScale>0?a.toString():"")}},e.exports=r},function(e,t){"use strict";var r=function(e){var t=this;t.date=[],t.blocks=[],t.datePattern=e,t.initBlocks()};r.prototype={initBlocks:function(){var e=this;e.datePattern.forEach(function(t){"Y"===t?e.blocks.push(4):e.blocks.push(2)})},getISOFormatDate:function(){var e=this,t=e.date;return t[2]?t[2]+"-"+e.addLeadingZero(t[1])+"-"+e.addLeadingZero(t[0]):""},getBlocks:function(){return this.blocks},getValidatedDate:function(e){var t=this,r="";return e=e.replace(/[^\d]/g,""),t.blocks.forEach(function(n,i){if(e.length>0){var a=e.slice(0,n),o=a.slice(0,1),l=e.slice(n);switch(t.datePattern[i]){case"d":"00"===a?a="01":parseInt(o,10)>3?a="0"+o:parseInt(a,10)>31&&(a="31");break;case"m":"00"===a?a="01":parseInt(o,10)>1?a="0"+o:parseInt(a,10)>12&&(a="12")}r+=a,e=l}}),this.getFixedDateString(r)},getFixedDateString:function(e){var t,r,n,i=this,a=i.datePattern,o=[],l=0,s=0,u=0,c=0,d=0,m=0,p=!1;return 4===e.length&&"y"!==a[0].toLowerCase()&&"y"!==a[1].toLowerCase()&&(c="d"===a[0]?0:2,d=2-c,t=parseInt(e.slice(c,c+2),10),r=parseInt(e.slice(d,d+2),10),o=this.getFixedDate(t,r,0)),8===e.length&&(a.forEach(function(e,t){switch(e){case"d":l=t;break;case"m":s=t;break;default:u=t}}),m=2*u,c=l<=u?2*l:2*l+2,d=s<=u?2*s:2*s+2,t=parseInt(e.slice(c,c+2),10),r=parseInt(e.slice(d,d+2),10),n=parseInt(e.slice(m,m+4),10),p=4===e.slice(m,m+4).length,o=this.getFixedDate(t,r,n)),i.date=o,0===o.length?e:a.reduce(function(e,t){switch(t){case"d":return e+i.addLeadingZero(o[0]);case"m":return e+i.addLeadingZero(o[1]);default:return e+(p?i.addLeadingZeroForYear(o[2]):"")}},"")},getFixedDate:function(e,t,r){return e=Math.min(e,31),t=Math.min(t,12),r=parseInt(r||0,10),(t<7&&t%2===0||t>8&&t%2===1)&&(e=Math.min(e,2===t?this.isLeapYear(r)?29:28:30)),[e,t,r]},isLeapYear:function(e){return e%4===0&&e%100!==0||e%400===0},addLeadingZero:function(e){return(e<10?"0":"")+e},addLeadingZeroForYear:function(e){return(e<10?"000":e<100?"00":e<1e3?"0":"")+e}},e.exports=r},function(e,t){"use strict";var r=function(e,t){var r=this;r.delimiter=t||""===t?t:" ",r.delimiterRE=t?new RegExp("\\"+t,"g"):"",r.formatter=e};r.prototype={setFormatter:function(e){this.formatter=e},format:function(e){var t=this;t.formatter.clear(),e=e.replace(/[^\d+]/g,""),e=e.replace(t.delimiterRE,"");for(var r,n="",i=!1,a=0,o=e.length;a<o;a++)r=t.formatter.inputDigit(e.charAt(a)),/[\s()-]/g.test(r)?(n=r,i=!0):i||(n=r);return n=n.replace(/[()]/g,""),n=n.replace(/[\s-]/g,t.delimiter)}},e.exports=r},function(e,t){"use strict";var r={blocks:{uatp:[4,5,6],amex:[4,6,5],diners:[4,6,4],discover:[4,4,4,4],mastercard:[4,4,4,4],dankort:[4,4,4,4],instapayment:[4,4,4,4],jcb15:[4,6,5],jcb:[4,4,4,4],maestro:[4,4,4,4],visa:[4,4,4,4],mir:[4,4,4,4],unionPay:[4,4,4,4],general:[4,4,4,4],generalStrict:[4,4,4,7]},re:{uatp:/^(?!1800)1\d{0,14}/,amex:/^3[47]\d{0,13}/,discover:/^(?:6011|65\d{0,2}|64[4-9]\d?)\d{0,12}/,diners:/^3(?:0([0-5]|9)|[689]\d?)\d{0,11}/,mastercard:/^(5[1-5]\d{0,2}|22[2-9]\d{0,1}|2[3-7]\d{0,2})\d{0,12}/,dankort:/^(5019|4175|4571)\d{0,12}/,instapayment:/^63[7-9]\d{0,13}/,jcb15:/^(?:2131|1800)\d{0,11}/,jcb:/^(?:35\d{0,2})\d{0,12}/,maestro:/^(?:5[0678]\d{0,2}|6304|67\d{0,2})\d{0,12}/,mir:/^220[0-4]\d{0,12}/,visa:/^4\d{0,15}/,unionPay:/^62\d{0,14}/},getInfo:function(e,t){var n=r.blocks,i=r.re;t=!!t;for(var a in i)if(i[a].test(e)){var o;return o=t?n.generalStrict:n[a],{type:a,blocks:o}}return{type:"unknown",blocks:t?n.generalStrict:n.general}}};e.exports=r},function(e,t){"use strict";var r={noop:function(){},strip:function(e,t){return e.replace(t,"")},isDelimiter:function(e,t,r){return 0===r.length?e===t:r.some(function(t){if(e===t)return!0})},getDelimiterREByDelimiter:function(e){return new RegExp(e.replace(/([.?*+^$[\]\\(){}|-])/g,"\\$1"),"g")},getNextCursorPosition:function(e,t,r,n,i){return t.length===e?r.length:e+this.getPositionOffset(e,t,r,n,i)},getPositionOffset:function(e,t,r,n,i){var a,o,l;return a=this.stripDelimiters(t.slice(0,e),n,i),o=this.stripDelimiters(r.slice(0,e),n,i),l=a.length-o.length,0!==l?l/Math.abs(l):0},stripDelimiters:function(e,t,r){var n=this;if(0===r.length){var i=t?n.getDelimiterREByDelimiter(t):"";return e.replace(i,"")}return r.forEach(function(t){e=e.replace(n.getDelimiterREByDelimiter(t),"")}),e},headStr:function(e,t){return e.slice(0,t)},getMaxLength:function(e){return e.reduce(function(e,t){return e+t},0)},getPrefixStrippedValue:function(e,t,r,n){if(e.slice(0,r)!==t)if(e.length<n.length)e=e.length>r?n:t;else{var i=this.getFirstDiffIndex(t,e.slice(0,r));e=t+e.slice(i,i+1)+e.slice(r+1)}return e.slice(r)},getFirstDiffIndex:function(e,t){for(var r=0;e.charAt(r)===t.charAt(r);)if(""===e.charAt(r++))return-1;return r},getFormattedValue:function(e,t,r,n,i,a){var o,l="",s=i.length>0;return 0===r?e:(t.forEach(function(t,u){if(e.length>0){var c=e.slice(0,t),d=e.slice(t);o=s?i[a?u-1:u]||o:n,a?(u>0&&(l+=o),l+=c):(l+=c,c.length===t&&u<r-1&&(l+=o)),e=d}}),l)},fixPrefixCursor:function(e,t,r,n){if(e){var i=e.value,a=r||n[0]||" ";if(e.setSelectionRange&&t&&!(t.length+a.length<i.length)){var o=2*i.length;setTimeout(function(){e.setSelectionRange(o,o)},1)}}},setSelection:function(e,t,r){if(e===r.activeElement&&!(e&&e.value.length<=t))if(e.createTextRange){var n=e.createTextRange();n.move("character",t),n.select()}else try{e.setSelectionRange(t,t)}catch(i){console.warn("The input element type does not support selection")}},isAndroid:function(){return navigator&&/android/i.test(navigator.userAgent)},isAndroidBackspaceKeydown:function(e,t){return!!(this.isAndroid()&&e&&t)&&t===e.slice(0,-1)}};e.exports=r},function(e,t){(function(t){"use strict";var r={assign:function(e,r){return e=e||{},r=r||{},e.creditCard=!!r.creditCard,e.creditCardStrictMode=!!r.creditCardStrictMode,e.creditCardType="",e.onCreditCardTypeChanged=r.onCreditCardTypeChanged||function(){},e.phone=!!r.phone,e.phoneRegionCode=r.phoneRegionCode||"AU",e.phoneFormatter={},e.date=!!r.date,e.datePattern=r.datePattern||["d","m","Y"],e.dateFormatter={},e.numeral=!!r.numeral,e.numeralIntegerScale=r.numeralIntegerScale>0?r.numeralIntegerScale:0,e.numeralDecimalScale=r.numeralDecimalScale>=0?r.numeralDecimalScale:2,e.numeralDecimalMark=r.numeralDecimalMark||".",e.numeralThousandsGroupStyle=r.numeralThousandsGroupStyle||"thousand",e.numeralPositiveOnly=!!r.numeralPositiveOnly,e.stripLeadingZeroes=r.stripLeadingZeroes!==!1,e.numericOnly=e.creditCard||e.date||!!r.numericOnly,e.uppercase=!!r.uppercase,e.lowercase=!!r.lowercase,e.prefix=e.creditCard||e.date?"":r.prefix||"",e.noImmediatePrefix=!!r.noImmediatePrefix,e.prefixLength=e.prefix.length,e.rawValueTrimPrefix=!!r.rawValueTrimPrefix,e.copyDelimiter=!!r.copyDelimiter,e.initValue=void 0!==r.initValue&&null!==r.initValue?r.initValue.toString():"",e.delimiter=r.delimiter||""===r.delimiter?r.delimiter:r.date?"/":r.numeral?",":(r.phone," "),e.delimiterLength=e.delimiter.length,e.delimiterLazyShow=!!r.delimiterLazyShow,e.delimiters=r.delimiters||[],e.blocks=r.blocks||[],e.blocksLength=e.blocks.length,e.root="object"==typeof t&&t?t:window,e.document=r.document||e.root.document,e.maxLength=0,e.backspace=!1,e.result="",e.onValueChanged=r.onValueChanged||function(){},e}};e.exports=r}).call(t,function(){return this}())}])});

/* maskmoney/dist/jquery.maskMoney.min.js */
/*
 *  jquery-maskmoney - v3.1.1
 *  jQuery plugin to mask data entry in the input text in the form of money (currency)
 *  https://github.com/plentz/jquery-maskmoney
 *
 *  Made by Diego Plentz
 *  Under MIT License
 */

!function($){"use strict";function e(e,t){var n="";return e.indexOf("-")>-1&&(e=e.replace("-",""),n="-"),e.indexOf(t.prefix)>-1&&(e=e.replace(t.prefix,"")),e.indexOf(t.suffix)>-1&&(e=e.replace(t.suffix,"")),n+t.prefix+e+t.suffix}function t(e,t){return t.allowEmpty&&""===e?"":t.reverse?a(e,t):n(e,t)}function n(t,n){var a,i,o,l=t.indexOf("-")>-1&&n.allowNegative?"-":"",s=t.replace(/[^0-9]/g,"");return a=r(s.slice(0,s.length-n.precision),l,n),n.precision>0&&(i=s.slice(s.length-n.precision),o=new Array(n.precision+1-i.length).join(0),a+=n.decimal+o+i),e(a,n)}function a(t,n){var a,i=t.indexOf("-")>-1&&n.allowNegative?"-":"",o=t.replace(n.prefix,"").replace(n.suffix,""),l=o.split(n.decimal)[0],s="";if(""===l&&(l="0"),a=r(l,i,n),n.precision>0){var c=o.split(n.decimal);c.length>1&&(s=c[1]),a+=n.decimal+s;var u=Number.parseFloat(l+"."+s).toFixed(n.precision).toString().split(n.decimal)[1];a=a.split(n.decimal)[0]+"."+u}return e(a,n)}function r(e,t,n){return e=e.replace(/^0*/g,""),""===(e=e.replace(/\B(?=(\d{3})+(?!\d))/g,n.thousands))&&(e="0"),t+e}$.browser||($.browser={},$.browser.mozilla=/mozilla/.test(navigator.userAgent.toLowerCase())&&!/webkit/.test(navigator.userAgent.toLowerCase()),$.browser.webkit=/webkit/.test(navigator.userAgent.toLowerCase()),$.browser.opera=/opera/.test(navigator.userAgent.toLowerCase()),$.browser.msie=/msie/.test(navigator.userAgent.toLowerCase()),$.browser.device=/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()));var i={prefix:"",suffix:"",affixesStay:!0,thousands:",",decimal:".",precision:2,allowZero:!1,allowNegative:!1,doubleClickSelection:!0,allowEmpty:!1,bringCaretAtEndOnFocus:!0},o={destroy:function(){return $(this).unbind(".maskMoney"),$.browser.msie&&(this.onpaste=null),this},applyMask:function(e){return t(e,$(this).data("settings"))},mask:function(e){return this.each(function(){var t=$(this);return"number"==typeof e&&t.val(e),t.trigger("mask")})},unmasked:function(){return this.map(function(){var e,t=$(this).val()||"0",n=-1!==t.indexOf("-");return $(t.split(/\D/).reverse()).each(function(t,n){if(n)return e=n,!1}),t=t.replace(/\D/g,""),t=t.replace(new RegExp(e+"$"),"."+e),n&&(t="-"+t),parseFloat(t)})},unmaskedWithOptions:function(){return this.map(function(){var e=$(this).val()||"0",t=$(this).data("settings")||i,n=new RegExp(t.thousandsForUnmasked||t.thousands,"g");return e=e.replace(n,""),parseFloat(e)})},init:function(n){return n=$.extend($.extend({},i),n),this.each(function(){function a(){var e,t,n,a,r,i=x.get(0),o=0,l=0;return"number"==typeof i.selectionStart&&"number"==typeof i.selectionEnd?(o=i.selectionStart,l=i.selectionEnd):(t=document.selection.createRange())&&t.parentElement()===i&&(a=i.value.length,e=i.value.replace(/\r\n/g,"\n"),(n=i.createTextRange()).moveToBookmark(t.getBookmark()),(r=i.createTextRange()).collapse(!1),n.compareEndPoints("StartToEnd",r)>-1?o=l=a:(o=-n.moveStart("character",-a),o+=e.slice(0,o).split("\n").length-1,n.compareEndPoints("EndToEnd",r)>-1?l=a:(l=-n.moveEnd("character",-a),l+=e.slice(0,l).split("\n").length-1))),{start:o,end:l}}function r(){var e=!(x.val().length>=x.attr("maxlength")&&x.attr("maxlength")>=0),t=a(),n=t.start,r=t.end,i=!(t.start===t.end||!x.val().substring(n,r).match(/\d/)),o="0"===x.val().substring(0,1);return e||i||o}function i(e){w.formatOnBlur||x.each(function(t,n){if(n.setSelectionRange)n.focus(),n.setSelectionRange(e,e);else if(n.createTextRange){var a=n.createTextRange();a.collapse(!0),a.moveEnd("character",e),a.moveStart("character",e),a.select()}})}function o(e){var n,a=x.val().length;x.val(t(x.val(),w)),n=x.val().length,w.reverse||(e-=a-n),i(e)}function l(){var e=x.val();if(!w.allowEmpty||""!==e){var n=e.indexOf(w.decimal);if(w.precision>0)if(n<0)e+=w.decimal+new Array(w.precision+1).join(0);else{var a=e.slice(0,n),r=e.slice(n+1);e=a+w.decimal+r+new Array(w.precision+1-r.length).join(0)}else n>0&&(e=e.slice(0,n));x.val(t(e,w))}}function s(){var e=x.val();return w.allowNegative?""!==e&&"-"===e.charAt(0)?e.replace("-",""):"-"+e:e}function c(e){e.preventDefault?e.preventDefault():e.returnValue=!1}function u(e){var t=(e=e||window.event).which||e.charCode||e.keyCode,n=w.decimal.charCodeAt(0);return void 0!==t&&(!(t<48||t>57)||t===n&&w.reverse?!!r()&&((t!==n||!d())&&(!!w.formatOnBlur||(c(e),p(e),!1))):g(t,e))}function d(){return!v()&&f()}function v(){var e=x.val().length,t=a();return 0===t.start&&t.end===e}function f(){return x.val().indexOf(w.decimal)>-1}function p(e){var t,n,r,i,l=(e=e||window.event).which||e.charCode||e.keyCode,s="";l>=48&&l<=57&&(s=String.fromCharCode(l)),n=(t=a()).start,r=t.end,i=x.val(),x.val(i.substring(0,n)+s+i.substring(r,i.length)),o(n+1)}function g(e,t){return 45===e?(x.val(s()),!1):43===e?(x.val(x.val().replace("-","")),!1):13===e||9===e||(!(!$.browser.mozilla||37!==e&&39!==e||0!==t.charCode)||(c(t),!0))}function m(){setTimeout(function(){l()},0)}function h(){return(parseFloat("0")/Math.pow(10,w.precision)).toFixed(w.precision).replace(new RegExp("\\.","g"),w.decimal)}var w,b,x=$(this);w=$.extend({},n),w=$.extend(w,x.data()),x.data("settings",w),$.browser.device&&x.attr("type","tel"),x.unbind(".maskMoney"),x.bind("keypress.maskMoney",u),x.bind("keydown.maskMoney",function(e){var t,n,r,i,l,s=(e=e||window.event).which||e.charCode||e.keyCode;return void 0!==s&&(t=a(),n=t.start,r=t.end,8!==s&&46!==s&&63272!==s||(c(e),i=x.val(),n===r&&(8===s?""===w.suffix?n-=1:(l=i.split("").reverse().join("").search(/\d/),r=1+(n=i.length-l-1)):r+=1),x.val(i.substring(0,n)+i.substring(r,i.length)),o(n),!1))}),x.bind("blur.maskMoney",function(t){if($.browser.msie&&u(t),w.formatOnBlur&&x.val()!==b&&p(t),""===x.val()&&w.allowEmpty)x.val("");else if(""===x.val()||x.val()===e(h(),w))w.allowZero?w.affixesStay?x.val(e(h(),w)):x.val(h()):x.val("");else if(!w.affixesStay){var n=x.val().replace(w.prefix,"").replace(w.suffix,"");x.val(n)}x.val()!==b&&x.change()}),x.bind("focus.maskMoney",function(){b=x.val(),l();var e,t=x.get(0);w.selectAllOnFocus?t.select():t.createTextRange&&w.bringCaretAtEndOnFocus&&((e=t.createTextRange()).collapse(!1),e.select())}),x.bind("click.maskMoney",function(){var e,t=x.get(0);w.selectAllOnFocus||(t.setSelectionRange&&w.bringCaretAtEndOnFocus?(e=x.val().length,t.setSelectionRange(e,e)):x.val(x.val()))}),x.bind("dblclick.maskMoney",function(){var e,t,n=x.get(0);n.setSelectionRange&&w.bringCaretAtEndOnFocus?(t=x.val().length,e=w.doubleClickSelection?0:t,n.setSelectionRange(e,t)):x.val(x.val())}),x.bind("cut.maskMoney",m),x.bind("paste.maskMoney",m),x.bind("mask.maskMoney",l)})}};$.fn.maskMoney=function(e){return o[e]?o[e].apply(this,Array.prototype.slice.call(arguments,1)):"object"!=typeof e&&e?void $.error("Method "+e+" does not exist on jQuery.maskMoney"):o.init.apply(this,arguments)}}(window.jQuery||window.Zepto);

/* sortable/sortable.min.js */
/*! Sortable 1.7.0 - MIT | git://github.com/rubaxa/Sortable.git */
!function(a){"use strict";"function"==typeof define&&define.amd?define(a):"undefined"!=typeof module&&"undefined"!=typeof module.exports?module.exports=a():window.Sortable=a()}(function(){"use strict";function a(b,c){if(!b||!b.nodeType||1!==b.nodeType)throw"Sortable: `el` must be HTMLElement, and not "+{}.toString.call(b);this.el=b,this.options=c=t({},c),b[V]=this;var d={group:Math.random(),sort:!0,disabled:!1,store:null,handle:null,scroll:!0,scrollSensitivity:30,scrollSpeed:10,draggable:/[uo]l/i.test(b.nodeName)?"li":">*",ghostClass:"sortable-ghost",chosenClass:"sortable-chosen",dragClass:"sortable-drag",ignore:"a, img",filter:null,preventOnFilter:!0,animation:0,setData:function(a,b){a.setData("Text",b.textContent)},dropBubble:!1,dragoverBubble:!1,dataIdAttr:"data-id",delay:0,forceFallback:!1,fallbackClass:"sortable-fallback",fallbackOnBody:!1,fallbackTolerance:0,fallbackOffset:{x:0,y:0},supportPointer:a.supportPointer!==!1};for(var e in d)!(e in c)&&(c[e]=d[e]);ka(c);for(var g in this)"_"===g.charAt(0)&&"function"==typeof this[g]&&(this[g]=this[g].bind(this));this.nativeDraggable=!c.forceFallback&&ca,f(b,"mousedown",this._onTapStart),f(b,"touchstart",this._onTapStart),c.supportPointer&&f(b,"pointerdown",this._onTapStart),this.nativeDraggable&&(f(b,"dragover",this),f(b,"dragenter",this)),ia.push(this._onDragOver),c.store&&this.sort(c.store.get(this))}function b(a,b){"clone"!==a.lastPullMode&&(b=!0),B&&B.state!==b&&(i(B,"display",b?"none":""),b||B.state&&(a.options.group.revertClone?(C.insertBefore(B,D),a._animate(y,B)):C.insertBefore(B,y)),B.state=b)}function c(a,b,c){if(a){c=c||X;do if(">*"===b&&a.parentNode===c||r(a,b))return a;while(a=d(a))}return null}function d(a){var b=a.host;return b&&b.nodeType?b:a.parentNode}function e(a){a.dataTransfer&&(a.dataTransfer.dropEffect="move"),a.preventDefault()}function f(a,b,c){a.addEventListener(b,c,aa)}function g(a,b,c){a.removeEventListener(b,c,aa)}function h(a,b,c){if(a)if(a.classList)a.classList[c?"add":"remove"](b);else{var d=(" "+a.className+" ").replace(T," ").replace(" "+b+" "," ");a.className=(d+(c?" "+b:"")).replace(T," ")}}function i(a,b,c){var d=a&&a.style;if(d){if(void 0===c)return X.defaultView&&X.defaultView.getComputedStyle?c=X.defaultView.getComputedStyle(a,""):a.currentStyle&&(c=a.currentStyle),void 0===b?c:c[b];b in d||(b="-webkit-"+b),d[b]=c+("string"==typeof c?"":"px")}}function j(a,b,c){if(a){var d=a.getElementsByTagName(b),e=0,f=d.length;if(c)for(;e<f;e++)c(d[e],e);return d}return[]}function k(a,b,c,d,e,f,g,h){a=a||b[V];var i=X.createEvent("Event"),j=a.options,k="on"+c.charAt(0).toUpperCase()+c.substr(1);i.initEvent(c,!0,!0),i.to=e||b,i.from=f||b,i.item=d||b,i.clone=B,i.oldIndex=g,i.newIndex=h,b.dispatchEvent(i),j[k]&&j[k].call(a,i)}function l(a,b,c,d,e,f,g,h){var i,j,k=a[V],l=k.options.onMove;return i=X.createEvent("Event"),i.initEvent("move",!0,!0),i.to=b,i.from=a,i.dragged=c,i.draggedRect=d,i.related=e||b,i.relatedRect=f||b.getBoundingClientRect(),i.willInsertAfter=h,a.dispatchEvent(i),l&&(j=l.call(k,i,g)),j}function m(a){a.draggable=!1}function n(){ea=!1}function o(a,b){var c=a.lastElementChild,d=c.getBoundingClientRect();return b.clientY-(d.top+d.height)>5||b.clientX-(d.left+d.width)>5}function p(a){for(var b=a.tagName+a.className+a.src+a.href+a.textContent,c=b.length,d=0;c--;)d+=b.charCodeAt(c);return d.toString(36)}function q(a,b){var c=0;if(!a||!a.parentNode)return-1;for(;a&&(a=a.previousElementSibling);)"TEMPLATE"===a.nodeName.toUpperCase()||">*"!==b&&!r(a,b)||c++;return c}function r(a,b){if(a){b=b.split(".");var c=b.shift().toUpperCase(),d=new RegExp("\\s("+b.join("|")+")(?=\\s)","g");return!(""!==c&&a.nodeName.toUpperCase()!=c||b.length&&((" "+a.className+" ").match(d)||[]).length!=b.length)}return!1}function s(a,b){var c,d;return function(){void 0===c&&(c=arguments,d=this,Z(function(){1===c.length?a.call(d,c[0]):a.apply(d,c),c=void 0},b))}}function t(a,b){if(a&&b)for(var c in b)b.hasOwnProperty(c)&&(a[c]=b[c]);return a}function u(a){return _&&_.dom?_.dom(a).cloneNode(!0):$?$(a).clone(!0)[0]:a.cloneNode(!0)}function v(a){for(var b=a.getElementsByTagName("input"),c=b.length;c--;){var d=b[c];d.checked&&ha.push(d)}}function w(a){return Z(a,0)}function x(a){return clearTimeout(a)}if("undefined"==typeof window||!window.document)return function(){throw new Error("Sortable.js requires a window with a document")};var y,z,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S={},T=/\s+/g,U=/left|right|inline/,V="Sortable"+(new Date).getTime(),W=window,X=W.document,Y=W.parseInt,Z=W.setTimeout,$=W.jQuery||W.Zepto,_=W.Polymer,aa=!1,ba=!1,ca="draggable"in X.createElement("div"),da=function(a){return!navigator.userAgent.match(/(?:Trident.*rv[ :]?11\.|msie)/i)&&(a=X.createElement("x"),a.style.cssText="pointer-events:auto","auto"===a.style.pointerEvents)}(),ea=!1,fa=Math.abs,ga=Math.min,ha=[],ia=[],ja=s(function(a,b,c){if(c&&b.scroll){var d,e,f,g,h,i,j=c[V],k=b.scrollSensitivity,l=b.scrollSpeed,m=a.clientX,n=a.clientY,o=window.innerWidth,p=window.innerHeight;if(G!==c&&(F=b.scroll,G=c,H=b.scrollFn,F===!0)){F=c;do if(F.offsetWidth<F.scrollWidth||F.offsetHeight<F.scrollHeight)break;while(F=F.parentNode)}F&&(d=F,e=F.getBoundingClientRect(),f=(fa(e.right-m)<=k)-(fa(e.left-m)<=k),g=(fa(e.bottom-n)<=k)-(fa(e.top-n)<=k)),f||g||(f=(o-m<=k)-(m<=k),g=(p-n<=k)-(n<=k),(f||g)&&(d=W)),S.vx===f&&S.vy===g&&S.el===d||(S.el=d,S.vx=f,S.vy=g,clearInterval(S.pid),d&&(S.pid=setInterval(function(){return i=g?g*l:0,h=f?f*l:0,"function"==typeof H?H.call(j,h,i,a):void(d===W?W.scrollTo(W.pageXOffset+h,W.pageYOffset+i):(d.scrollTop+=i,d.scrollLeft+=h))},24)))}},30),ka=function(a){function b(a,b){return void 0!==a&&a!==!0||(a=c.name),"function"==typeof a?a:function(c,d){var e=d.options.group.name;return b?a:a&&(a.join?a.indexOf(e)>-1:e==a)}}var c={},d=a.group;d&&"object"==typeof d||(d={name:d}),c.name=d.name,c.checkPull=b(d.pull,!0),c.checkPut=b(d.put),c.revertClone=d.revertClone,a.group=c};try{window.addEventListener("test",null,Object.defineProperty({},"passive",{get:function(){ba=!1,aa={capture:!1,passive:ba}}}))}catch(a){}return a.prototype={constructor:a,_onTapStart:function(a){var b,d=this,e=this.el,f=this.options,g=f.preventOnFilter,h=a.type,i=a.touches&&a.touches[0],j=(i||a).target,l=a.target.shadowRoot&&a.path&&a.path[0]||j,m=f.filter;if(v(e),!y&&!(/mousedown|pointerdown/.test(h)&&0!==a.button||f.disabled)&&!l.isContentEditable&&(j=c(j,f.draggable,e),j&&E!==j)){if(b=q(j,f.draggable),"function"==typeof m){if(m.call(this,a,j,this))return k(d,l,"filter",j,e,e,b),void(g&&a.preventDefault())}else if(m&&(m=m.split(",").some(function(a){if(a=c(l,a.trim(),e))return k(d,a,"filter",j,e,e,b),!0})))return void(g&&a.preventDefault());f.handle&&!c(l,f.handle,e)||this._prepareDragStart(a,i,j,b)}},_prepareDragStart:function(a,b,c,d){var e,g=this,i=g.el,l=g.options,n=i.ownerDocument;c&&!y&&c.parentNode===i&&(P=a,C=i,y=c,z=y.parentNode,D=y.nextSibling,E=c,N=l.group,L=d,this._lastX=(b||a).clientX,this._lastY=(b||a).clientY,y.style["will-change"]="all",e=function(){g._disableDelayedDrag(),y.draggable=g.nativeDraggable,h(y,l.chosenClass,!0),g._triggerDragStart(a,b),k(g,C,"choose",y,C,C,L)},l.ignore.split(",").forEach(function(a){j(y,a.trim(),m)}),f(n,"mouseup",g._onDrop),f(n,"touchend",g._onDrop),f(n,"touchcancel",g._onDrop),f(n,"selectstart",g),l.supportPointer&&f(n,"pointercancel",g._onDrop),l.delay?(f(n,"mouseup",g._disableDelayedDrag),f(n,"touchend",g._disableDelayedDrag),f(n,"touchcancel",g._disableDelayedDrag),f(n,"mousemove",g._disableDelayedDrag),f(n,"touchmove",g._disableDelayedDrag),l.supportPointer&&f(n,"pointermove",g._disableDelayedDrag),g._dragStartTimer=Z(e,l.delay)):e())},_disableDelayedDrag:function(){var a=this.el.ownerDocument;clearTimeout(this._dragStartTimer),g(a,"mouseup",this._disableDelayedDrag),g(a,"touchend",this._disableDelayedDrag),g(a,"touchcancel",this._disableDelayedDrag),g(a,"mousemove",this._disableDelayedDrag),g(a,"touchmove",this._disableDelayedDrag),g(a,"pointermove",this._disableDelayedDrag)},_triggerDragStart:function(a,b){b=b||("touch"==a.pointerType?a:null),b?(P={target:y,clientX:b.clientX,clientY:b.clientY},this._onDragStart(P,"touch")):this.nativeDraggable?(f(y,"dragend",this),f(C,"dragstart",this._onDragStart)):this._onDragStart(P,!0);try{X.selection?w(function(){X.selection.empty()}):window.getSelection().removeAllRanges()}catch(a){}},_dragStarted:function(){if(C&&y){var b=this.options;h(y,b.ghostClass,!0),h(y,b.dragClass,!1),a.active=this,k(this,C,"start",y,C,C,L)}else this._nulling()},_emulateDragOver:function(){if(Q){if(this._lastX===Q.clientX&&this._lastY===Q.clientY)return;this._lastX=Q.clientX,this._lastY=Q.clientY,da||i(A,"display","none");var a=X.elementFromPoint(Q.clientX,Q.clientY),b=a,c=ia.length;if(a&&a.shadowRoot&&(a=a.shadowRoot.elementFromPoint(Q.clientX,Q.clientY),b=a),b)do{if(b[V]){for(;c--;)ia[c]({clientX:Q.clientX,clientY:Q.clientY,target:a,rootEl:b});break}a=b}while(b=b.parentNode);da||i(A,"display","")}},_onTouchMove:function(b){if(P){var c=this.options,d=c.fallbackTolerance,e=c.fallbackOffset,f=b.touches?b.touches[0]:b,g=f.clientX-P.clientX+e.x,h=f.clientY-P.clientY+e.y,j=b.touches?"translate3d("+g+"px,"+h+"px,0)":"translate("+g+"px,"+h+"px)";if(!a.active){if(d&&ga(fa(f.clientX-this._lastX),fa(f.clientY-this._lastY))<d)return;this._dragStarted()}this._appendGhost(),R=!0,Q=f,i(A,"webkitTransform",j),i(A,"mozTransform",j),i(A,"msTransform",j),i(A,"transform",j),b.preventDefault()}},_appendGhost:function(){if(!A){var a,b=y.getBoundingClientRect(),c=i(y),d=this.options;A=y.cloneNode(!0),h(A,d.ghostClass,!1),h(A,d.fallbackClass,!0),h(A,d.dragClass,!0),i(A,"top",b.top-Y(c.marginTop,10)),i(A,"left",b.left-Y(c.marginLeft,10)),i(A,"width",b.width),i(A,"height",b.height),i(A,"opacity","0.8"),i(A,"position","fixed"),i(A,"zIndex","100000"),i(A,"pointerEvents","none"),d.fallbackOnBody&&X.body.appendChild(A)||C.appendChild(A),a=A.getBoundingClientRect(),i(A,"width",2*b.width-a.width),i(A,"height",2*b.height-a.height)}},_onDragStart:function(a,b){var c=this,d=a.dataTransfer,e=c.options;c._offUpEvents(),N.checkPull(c,c,y,a)&&(B=u(y),B.draggable=!1,B.style["will-change"]="",i(B,"display","none"),h(B,c.options.chosenClass,!1),c._cloneId=w(function(){C.insertBefore(B,y),k(c,C,"clone",y)})),h(y,e.dragClass,!0),b?("touch"===b?(f(X,"touchmove",c._onTouchMove),f(X,"touchend",c._onDrop),f(X,"touchcancel",c._onDrop),e.supportPointer&&(f(X,"pointermove",c._onTouchMove),f(X,"pointerup",c._onDrop))):(f(X,"mousemove",c._onTouchMove),f(X,"mouseup",c._onDrop)),c._loopId=setInterval(c._emulateDragOver,50)):(d&&(d.effectAllowed="move",e.setData&&e.setData.call(c,d,y)),f(X,"drop",c),c._dragStartId=w(c._dragStarted))},_onDragOver:function(d){var e,f,g,h,j=this.el,k=this.options,m=k.group,p=a.active,q=N===m,r=!1,s=k.sort;if(void 0!==d.preventDefault&&(d.preventDefault(),!k.dragoverBubble&&d.stopPropagation()),!y.animated&&(R=!0,p&&!k.disabled&&(q?s||(h=!C.contains(y)):O===this||(p.lastPullMode=N.checkPull(this,p,y,d))&&m.checkPut(this,p,y,d))&&(void 0===d.rootEl||d.rootEl===this.el))){if(ja(d,k,this.el),ea)return;if(e=c(d.target,k.draggable,j),f=y.getBoundingClientRect(),O!==this&&(O=this,r=!0),h)return b(p,!0),z=C,void(B||D?C.insertBefore(y,B||D):s||C.appendChild(y));if(0===j.children.length||j.children[0]===A||j===d.target&&o(j,d)){if(0!==j.children.length&&j.children[0]!==A&&j===d.target&&(e=j.lastElementChild),e){if(e.animated)return;g=e.getBoundingClientRect()}b(p,q),l(C,j,y,f,e,g,d)!==!1&&(y.contains(j)||(j.appendChild(y),z=j),this._animate(f,y),e&&this._animate(g,e))}else if(e&&!e.animated&&e!==y&&void 0!==e.parentNode[V]){I!==e&&(I=e,J=i(e),K=i(e.parentNode)),g=e.getBoundingClientRect();var t=g.right-g.left,u=g.bottom-g.top,v=U.test(J.cssFloat+J.display)||"flex"==K.display&&0===K["flex-direction"].indexOf("row"),w=e.offsetWidth>y.offsetWidth,x=e.offsetHeight>y.offsetHeight,E=(v?(d.clientX-g.left)/t:(d.clientY-g.top)/u)>.5,F=e.nextElementSibling,G=!1;if(v){var H=y.offsetTop,L=e.offsetTop;G=H===L?e.previousElementSibling===y&&!w||E&&w:e.previousElementSibling===y||y.previousElementSibling===e?(d.clientY-g.top)/u>.5:L>H}else r||(G=F!==y&&!x||E&&x);var M=l(C,j,y,f,e,g,d,G);M!==!1&&(1!==M&&M!==-1||(G=1===M),ea=!0,Z(n,30),b(p,q),y.contains(j)||(G&&!F?j.appendChild(y):e.parentNode.insertBefore(y,G?F:e)),z=y.parentNode,this._animate(f,y),this._animate(g,e))}}},_animate:function(a,b){var c=this.options.animation;if(c){var d=b.getBoundingClientRect();1===a.nodeType&&(a=a.getBoundingClientRect()),i(b,"transition","none"),i(b,"transform","translate3d("+(a.left-d.left)+"px,"+(a.top-d.top)+"px,0)"),b.offsetWidth,i(b,"transition","all "+c+"ms"),i(b,"transform","translate3d(0,0,0)"),clearTimeout(b.animated),b.animated=Z(function(){i(b,"transition",""),i(b,"transform",""),b.animated=!1},c)}},_offUpEvents:function(){var a=this.el.ownerDocument;g(X,"touchmove",this._onTouchMove),g(X,"pointermove",this._onTouchMove),g(a,"mouseup",this._onDrop),g(a,"touchend",this._onDrop),g(a,"pointerup",this._onDrop),g(a,"touchcancel",this._onDrop),g(a,"pointercancel",this._onDrop),g(a,"selectstart",this)},_onDrop:function(b){var c=this.el,d=this.options;clearInterval(this._loopId),clearInterval(S.pid),clearTimeout(this._dragStartTimer),x(this._cloneId),x(this._dragStartId),g(X,"mouseover",this),g(X,"mousemove",this._onTouchMove),this.nativeDraggable&&(g(X,"drop",this),g(c,"dragstart",this._onDragStart)),this._offUpEvents(),b&&(R&&(b.preventDefault(),!d.dropBubble&&b.stopPropagation()),A&&A.parentNode&&A.parentNode.removeChild(A),C!==z&&"clone"===a.active.lastPullMode||B&&B.parentNode&&B.parentNode.removeChild(B),y&&(this.nativeDraggable&&g(y,"dragend",this),m(y),y.style["will-change"]="",h(y,this.options.ghostClass,!1),h(y,this.options.chosenClass,!1),k(this,C,"unchoose",y,z,C,L),C!==z?(M=q(y,d.draggable),M>=0&&(k(null,z,"add",y,z,C,L,M),k(this,C,"remove",y,z,C,L,M),k(null,z,"sort",y,z,C,L,M),k(this,C,"sort",y,z,C,L,M))):y.nextSibling!==D&&(M=q(y,d.draggable),M>=0&&(k(this,C,"update",y,z,C,L,M),k(this,C,"sort",y,z,C,L,M))),a.active&&(null!=M&&M!==-1||(M=L),k(this,C,"end",y,z,C,L,M),this.save()))),this._nulling()},_nulling:function(){C=y=z=A=D=B=E=F=G=P=Q=R=M=I=J=O=N=a.active=null,ha.forEach(function(a){a.checked=!0}),ha.length=0},handleEvent:function(a){switch(a.type){case"drop":case"dragend":this._onDrop(a);break;case"dragover":case"dragenter":y&&(this._onDragOver(a),e(a));break;case"mouseover":this._onDrop(a);break;case"selectstart":a.preventDefault()}},toArray:function(){for(var a,b=[],d=this.el.children,e=0,f=d.length,g=this.options;e<f;e++)a=d[e],c(a,g.draggable,this.el)&&b.push(a.getAttribute(g.dataIdAttr)||p(a));return b},sort:function(a){var b={},d=this.el;this.toArray().forEach(function(a,e){var f=d.children[e];c(f,this.options.draggable,d)&&(b[a]=f)},this),a.forEach(function(a){b[a]&&(d.removeChild(b[a]),d.appendChild(b[a]))})},save:function(){var a=this.options.store;a&&a.set(this)},closest:function(a,b){return c(a,b||this.options.draggable,this.el)},option:function(a,b){var c=this.options;return void 0===b?c[a]:(c[a]=b,void("group"===a&&ka(c)))},destroy:function(){var a=this.el;a[V]=null,g(a,"mousedown",this._onTapStart),g(a,"touchstart",this._onTapStart),g(a,"pointerdown",this._onTapStart),this.nativeDraggable&&(g(a,"dragover",this),g(a,"dragenter",this)),Array.prototype.forEach.call(a.querySelectorAll("[draggable]"),function(a){a.removeAttribute("draggable")}),ia.splice(ia.indexOf(this._onDragOver),1),this._onDrop(),this.el=a=null}},f(X,"touchmove",function(b){a.active&&b.preventDefault()}),a.utils={on:f,off:g,css:i,find:j,is:function(a,b){return!!c(a,b,a)},extend:t,throttle:s,closest:c,toggleClass:h,clone:u,index:q,nextTick:w,cancelNextTick:x},a.create=function(b,c){return new a(b,c)},a.version="1.7.0",a});

/* dialogflow/ApiAi.min.js */
/**
 * Copyright 2017 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
 
var ApiAi=function(t){function __webpack_require__(n){if(e[n])return e[n].exports;var r=e[n]={i:n,l:!1,exports:{}};return t[n].call(r.exports,r,r.exports,__webpack_require__),r.l=!0,r.exports}var e={};return __webpack_require__.m=t,__webpack_require__.c=e,__webpack_require__.i=function(t){return t},__webpack_require__.d=function(t,e,n){__webpack_require__.o(t,e)||Object.defineProperty(t,e,{configurable:!1,enumerable:!0,get:n})},__webpack_require__.n=function(t){var e=t&&t.__esModule?function getDefault(){return t.default}:function getModuleExports(){return t};return __webpack_require__.d(e,"a",e),e},__webpack_require__.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},__webpack_require__.p="/target/",__webpack_require__(__webpack_require__.s=8)}([function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});!function(t){var e;!function(t){t[t.EN="en"]="EN",t[t.DE="de"]="DE",t[t.ES="es"]="ES",t[t.PT_BR="pt-BR"]="PT_BR",t[t.ZH_HK="zh-HK"]="ZH_HK",t[t.ZH_CN="zh-CN"]="ZH_CN",t[t.ZH_TW="zh-TW"]="ZH_TW",t[t.NL="nl"]="NL",t[t.FR="fr"]="FR",t[t.IT="it"]="IT",t[t.JA="ja"]="JA",t[t.KO="ko"]="KO",t[t.PT="pt"]="PT",t[t.RU="ru"]="RU",t[t.UK="uk"]="UK"}(e=t.AVAILABLE_LANGUAGES||(t.AVAILABLE_LANGUAGES={})),t.VERSION="2.0.0-beta.20",t.DEFAULT_BASE_URL="https://api.api.ai/v1/",t.DEFAULT_API_VERSION="20150910",t.DEFAULT_CLIENT_LANG=e.EN}(e.ApiAiConstants||(e.ApiAiConstants={}))},function(t,e,n){"use strict";var r=this&&this.__extends||function(){var t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])};return function(e,n){function __(){this.constructor=e}t(e,n),e.prototype=null===n?Object.create(n):(__.prototype=n.prototype,new __)}}();Object.defineProperty(e,"__esModule",{value:!0});var i=function(t){function ApiAiBaseError(e){var n=t.call(this,e)||this;return n.message=e,n.stack=(new Error).stack,n}return r(ApiAiBaseError,t),ApiAiBaseError}(Error);e.ApiAiBaseError=i;var o=function(t){function ApiAiClientConfigurationError(e){var n=t.call(this,e)||this;return n.name="ApiAiClientConfigurationError",n}return r(ApiAiClientConfigurationError,t),ApiAiClientConfigurationError}(i);e.ApiAiClientConfigurationError=o;var s=function(t){function ApiAiRequestError(e,n){void 0===n&&(n=null);var r=t.call(this,e)||this;return r.message=e,r.code=n,r.name="ApiAiRequestError",r}return r(ApiAiRequestError,t),ApiAiRequestError}(i);e.ApiAiRequestError=s},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=n(1),i=n(7),o=function(){function Request(t,e){this.apiAiClient=t,this.options=e,this.uri=this.apiAiClient.getApiBaseUrl()+"query?v="+this.apiAiClient.getApiVersion(),this.requestMethod=i.default.Method.POST,this.headers={Authorization:"Bearer "+this.apiAiClient.getAccessToken()},this.options.lang=this.apiAiClient.getApiLang(),this.options.sessionId=this.apiAiClient.getSessionId()}return Request.handleSuccess=function(t){return Promise.resolve(JSON.parse(t.responseText))},Request.handleError=function(t){var e=new r.ApiAiRequestError(null);try{var n=JSON.parse(t.responseText);e=n.status&&n.status.errorDetails?new r.ApiAiRequestError(n.status.errorDetails,n.status.code):new r.ApiAiRequestError(t.statusText,t.status)}catch(n){e=new r.ApiAiRequestError(t.statusText,t.status)}return Promise.reject(e)},Request.prototype.perform=function(t){void 0===t&&(t=null);var e=t||this.options;return i.default.ajax(this.requestMethod,this.uri,e,this.headers).then(Request.handleSuccess.bind(this)).catch(Request.handleError.bind(this))},Request}();e.default=o},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=n(0),i=n(1),o=n(5),s=n(6);!function __export(t){for(var n in t)e.hasOwnProperty(n)||(e[n]=t[n])}(n(4));var u=n(0);e.ApiAiConstants=u.ApiAiConstants;var _=function(){function ApiAiClient(t){if(!t||!t.accessToken)throw new i.ApiAiClientConfigurationError("Access token is required for new ApiAi.Client instance");this.accessToken=t.accessToken,this.apiLang=t.lang||r.ApiAiConstants.DEFAULT_CLIENT_LANG,this.apiVersion=t.version||r.ApiAiConstants.DEFAULT_API_VERSION,this.apiBaseUrl=t.baseUrl||r.ApiAiConstants.DEFAULT_BASE_URL,this.sessionId=t.sessionId||this.guid()}return ApiAiClient.prototype.textRequest=function(t,e){if(void 0===e&&(e={}),!t)throw new i.ApiAiClientConfigurationError("Query should not be empty");return e.query=t,new s.default(this,e).perform()},ApiAiClient.prototype.eventRequest=function(t,e,n){if(void 0===e&&(e={}),void 0===n&&(n={}),!t)throw new i.ApiAiClientConfigurationError("Event name can not be empty");return n.event={name:t,data:e},new o.EventRequest(this,n).perform()},ApiAiClient.prototype.getAccessToken=function(){return this.accessToken},ApiAiClient.prototype.getApiVersion=function(){return this.apiVersion?this.apiVersion:r.ApiAiConstants.DEFAULT_API_VERSION},ApiAiClient.prototype.getApiLang=function(){return this.apiLang?this.apiLang:r.ApiAiConstants.DEFAULT_CLIENT_LANG},ApiAiClient.prototype.getApiBaseUrl=function(){return this.apiBaseUrl?this.apiBaseUrl:r.ApiAiConstants.DEFAULT_BASE_URL},ApiAiClient.prototype.setSessionId=function(t){this.sessionId=t},ApiAiClient.prototype.getSessionId=function(){return this.sessionId},ApiAiClient.prototype.guid=function(){var t=function(){return Math.floor(65536*(1+Math.random())).toString(16).substring(1)};return t()+t()+"-"+t()+"-"+t()+"-"+t()+"-"+t()+t()+t()},ApiAiClient}();e.ApiAiClient=_},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});!function(t){!function(t){t[t.ERR_NETWORK=0]="ERR_NETWORK",t[t.ERR_AUDIO=1]="ERR_AUDIO",t[t.ERR_SERVER=2]="ERR_SERVER",t[t.ERR_CLIENT=3]="ERR_CLIENT"}(t.ERROR||(t.ERROR={}));!function(t){t[t.MSG_WAITING_MICROPHONE=0]="MSG_WAITING_MICROPHONE",t[t.MSG_MEDIA_STREAM_CREATED=1]="MSG_MEDIA_STREAM_CREATED",t[t.MSG_INIT_RECORDER=2]="MSG_INIT_RECORDER",t[t.MSG_RECORDING=3]="MSG_RECORDING",t[t.MSG_SEND=4]="MSG_SEND",t[t.MSG_SEND_EMPTY=5]="MSG_SEND_EMPTY",t[t.MSG_SEND_EOS_OR_JSON=6]="MSG_SEND_EOS_OR_JSON",t[t.MSG_WEB_SOCKET=7]="MSG_WEB_SOCKET",t[t.MSG_WEB_SOCKET_OPEN=8]="MSG_WEB_SOCKET_OPEN",t[t.MSG_WEB_SOCKET_CLOSE=9]="MSG_WEB_SOCKET_CLOSE",t[t.MSG_STOP=10]="MSG_STOP",t[t.MSG_CONFIG_CHANGED=11]="MSG_CONFIG_CHANGED"}(t.EVENT||(t.EVENT={}))}(e.IStreamClient||(e.IStreamClient={}))},function(t,e,n){"use strict";var r=this&&this.__extends||function(){var t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])};return function(e,n){function __(){this.constructor=e}t(e,n),e.prototype=null===n?Object.create(n):(__.prototype=n.prototype,new __)}}();Object.defineProperty(e,"__esModule",{value:!0});var i=n(2),o=function(t){function EventRequest(){return null!==t&&t.apply(this,arguments)||this}return r(EventRequest,t),EventRequest}(i.default);e.EventRequest=o},function(t,e,n){"use strict";var r=this&&this.__extends||function(){var t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])};return function(e,n){function __(){this.constructor=e}t(e,n),e.prototype=null===n?Object.create(n):(__.prototype=n.prototype,new __)}}();Object.defineProperty(e,"__esModule",{value:!0});var i=n(2),o=function(t){function TextRequest(){return null!==t&&t.apply(this,arguments)||this}return r(TextRequest,t),TextRequest}(i.default);e.default=o},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=function(){function XhrRequest(){}return XhrRequest.ajax=function(t,e,n,r,i){return void 0===n&&(n=null),void 0===r&&(r=null),void 0===i&&(i={}),new Promise(function(o,s){var u=XhrRequest.createXMLHTTPObject(),_=e,a=null;if(n&&t===XhrRequest.Method.GET){_+="?";var c=0;for(var p in n)n.hasOwnProperty(p)&&(c++&&(_+="&"),_+=encodeURIComponent(p)+"="+encodeURIComponent(n[p]))}else n&&(r||(r={}),r["Content-Type"]="application/json; charset=utf-8",a=JSON.stringify(n));for(var p in i)p in u&&(u[p]=i[p]);if(u.open(XhrRequest.Method[t],_,!0),r)for(var p in r)r.hasOwnProperty(p)&&u.setRequestHeader(p,r[p]);a?u.send(a):u.send(),u.onload=function(){u.status>=200&&u.status<300?o(u):s(u)},u.onerror=function(){s(u)}})},XhrRequest.get=function(t,e,n,r){return void 0===e&&(e=null),void 0===n&&(n=null),void 0===r&&(r={}),XhrRequest.ajax(XhrRequest.Method.GET,t,e,n,r)},XhrRequest.post=function(t,e,n,r){return void 0===e&&(e=null),void 0===n&&(n=null),void 0===r&&(r={}),XhrRequest.ajax(XhrRequest.Method.POST,t,e,n,r)},XhrRequest.put=function(t,e,n,r){return void 0===e&&(e=null),void 0===n&&(n=null),void 0===r&&(r={}),XhrRequest.ajax(XhrRequest.Method.PUT,t,e,n,r)},XhrRequest.delete=function(t,e,n,r){return void 0===e&&(e=null),void 0===n&&(n=null),void 0===r&&(r={}),XhrRequest.ajax(XhrRequest.Method.DELETE,t,e,n,r)},XhrRequest.createXMLHTTPObject=function(){for(var t=null,e=0,n=XhrRequest.XMLHttpFactories;e<n.length;e++){var r=n[e];try{t=r()}catch(t){continue}break}return t},XhrRequest.XMLHttpFactories=[function(){return new XMLHttpRequest},function(){return new window.ActiveXObject("Msxml2.XMLHTTP")},function(){return new window.ActiveXObject("Msxml3.XMLHTTP")},function(){return new window.ActiveXObject("Microsoft.XMLHTTP")}],XhrRequest}();!function(t){!function(t){t[t.GET="GET"]="GET",t[t.POST="POST"]="POST",t[t.PUT="PUT"]="PUT",t[t.DELETE="DELETE"]="DELETE"}(t.Method||(t.Method={}))}(r||(r={})),e.default=r},function(t,e,n){t.exports=n(3)}]);

/* mony/index.js */
window.Mony = (function () {
  'use strict'

  /* global ApiAi */
  var client = new ApiAi.ApiAiClient({ accessToken: '639e715963e14f4e886e9fb8cee23e2d' })

  // credentials
  var accessToken, myID, storeID, responseCallback, actionCallback
  // request
  var method, endpoint, body, url
  // type the property to compare in post requests
  var type
  // variable to verify in post if the property is in the resource or not
  var property
  // count to required properties
  var count
  var schema, action
  // array of keywords
  var keywords, keywords2, z
  // number of keywords
  var size = 0
  // variable to verify if the keyword alreay exists
  var bool = false
  var disc = false

  var sendDialogFlow = function (promise, callback) {
    promise.then(handleResponse).catch(handleError)

    function handleResponse (serverResponse) {
      // intent name
      var intent = serverResponse.result.metadata.intentName
      if (intent) {
        switch (intent) {
          case 'iniatialize':
          // dont send init to discuss
            responseCallback('teste')
            break
          // RESOURCE
          case 'general':
            count = 0
            body = {}
            if (serverResponse.result.parameters.resource) {
              if (serverResponse.result.parameters.action === 'POST') {
                promise = client.textRequest('crie: ' + serverResponse.result.parameters.resource)
                sendDialogFlow(promise)
              } else if (serverResponse.result.parameters.action === 'DELETE') {
                promise = client.textRequest('deletar: ' + serverResponse.result.parameters.resource)
                sendDialogFlow(promise)
              } else if (serverResponse.result.parameters.action === 'PATCH') {
                promise = client.textRequest('editar: ' + serverResponse.result.parameters.resource)
                sendDialogFlow(promise)
              }
            }
            break

          // POST RESOURCE
          case 'resource - post':
            endpoint = serverResponse.result.parameters.resource + '/schema.json'
            method = 'GET'
            // get schema resource
            sendApi(endpoint, method, body, function (err, response) {
              if (!err) {
                schema = response
                // verify the type of the property
                for (var key in schema.properties) {
                  if (schema.required[count] === key) {
                    if (schema.properties[key].type !== 'object') {
                      promise = client.textRequest('Basico: ' + schema.required[count])
                      sendDialogFlow(promise)
                    } else {
                      action = {
                        'link': 'pagina de criação do resource'
                      }
                      actionCallback(action)
                    }
                  }
                }
              }
            })
            break

          // add required properties to body
          case 'resource - post - basico - value':
            // add required element to body
            type = typeof serverResponse.result.parameters.value
            property = false
            // verify the type of the property
            for (var key in schema.properties) {
              if (key === serverResponse.result.parameters.property) {
                property = true
                if (schema.properties[key].type === 'number') {
                  body[schema.required[count]] = parseInt(serverResponse.result.parameters.value)
                } else if (type === schema.properties[key].type) {
                  body[schema.required[count]] = serverResponse.result.parameters.value
                }
              }
            }
            if (property === false) {
              responseCallback('Não existe esta propriedade para este recurso')
            }
            count++
            // more required elements to add
            if (count < schema.required.length) {
              for (var key2 in schema.properties) {
                if (schema.required[count] === key2) {
                  if (schema.properties[key2].type !== 'object') {
                    promise = client.textRequest('Basico: ' + schema.required[count])
                    sendDialogFlow(promise)
                  }
                }
              }
            } else {
              // verify if more properties will be add
              promise = client.textRequest('propriedade extra')
              sendDialogFlow(promise)
            }
            break

          // send post to api
          case 'resource - post - extra - no':
            endpoint = serverResponse.result.parameters.resource + '.json'
            method = 'POST'
            responseCallback(body)
            sendApi(endpoint, method, body, function (err, response) {
              responseCallback(response)
              if (!err) {
                var msg = 'O' + serverResponse.result.parameters.resource +
                  'foi criado, seu id é: ' + response._id
                responseCallback(msg)
              }
            })
            break

          // add extra property to body
          case 'resource - post - extra - yes - property - value':
            type = typeof serverResponse.result.parameters.value
            property = false
            for (var key3 in schema.data.properties) {
              if (key3 === serverResponse.result.parameters.property) {
                property = true
                // if the value of the property is number, parse the response value of dialogflow
                if (schema.properties[key3].type === 'number') {
                  body[serverResponse.result.parameters.property] = parseInt(serverResponse.result.parameters.value)
                } else if (type === schema.properties[key3].type) {
                  body[serverResponse.result.parameters.property] = serverResponse.result.parameters.value
                }
              }
            }
            if (property === false) {
              responseCallback('Não existe esta propriedade para este recurso')
            }
            promise = client.textRequest('propriedade extra')
            sendDialogFlow(promise)
            break

          // EDIT RESOURCE
          case 'resource - edit':
            endpoint = serverResponse.result.parameters.resource + '/schema.json'
            method = 'GET'
            // get schema resource
            sendApi(endpoint, method, body, function (err, response) {
              if (!err) {
                schema = response
              }
            })
            break

          // add property to body
          case 'edit - id - property - value':
            type = typeof serverResponse.result.parameters.value
            property = false
            for (var key4 in schema.properties) {
              if (key4 === serverResponse.result.parameters.property) {
                property = true
                if (schema.properties[key4].type === 'number') {
                  body[serverResponse.result.parameters.property] = parseInt(serverResponse.result.parameters.value)
                } else if (type === schema.properties[key4].type) {
                  body[serverResponse.result.parameters.property] = serverResponse.result.parameters.value
                }
              }
            }
            if (property === false) {
              responseCallback('Não existe esta propriedade para este recurso')
            }
            promise = client.textRequest('propriedade extra')
            sendDialogFlow(promise)
            break

          // id do recurso para editar
          case 'edit - id - property - value - yes':
            promise = client.textRequest('id: ' + serverResponse.result.parameters.id)
            sendDialogFlow(promise)
            break

          // send edit to api
          case 'edit - id - property - value - no':
            endpoint = serverResponse.result.parameters.resource + '/' +
              serverResponse.result.parameters.id + '.json'
            method = 'PATCH'
            sendApi(endpoint, method, body)
            break

          // DELETE RESOURCE
          case 'delete - id':
            endpoint = serverResponse.result.parameters.resource + '/' +
              serverResponse.result.parameters.id + '.json'
            method = serverResponse.result.parameters.action
            sendApi(endpoint, method)
            break

          // SOCIAL MEDIA
          case 'cadastro.de.login.por.rede.social':
          // get the social media and return to dialogflow
            var redesocial = serverResponse.result.parameters.RedeSocial
            promise = client.textRequest('Como criar login pelo ' + redesocial + ' ?')
            sendDialogFlow(promise)
            break

          // resend the tutorial to client
          case 'login.Google - no':
            promise = client.textRequest('Como criar login pelo Google ?')
            sendDialogFlow(promise)
            break

          // resend the tutorial to client
          case 'login.WindowsLive - no':
            promise = client.textRequest('Como criar login pelo Windows Live ?')
            sendDialogFlow(promise)
            break

          case 'keywords.question':
            url = 'https://community.e-com.plus/search.json?'
            for (var key5 in serverResponse.result.parameters) {
              if (serverResponse.result.parameters.hasOwnProperty(key5) && serverResponse.result.parameters[key5] !== '') {
                url += 'q=' + serverResponse.result.parameters[key5] + '&'
              }
            }
            url = url.slice(0, -1)
            $.ajax({
              method: 'GET',
              url: url,
              dataType: 'json'
            })
              .done(function (response) {
                /* endpoint = '' */
                var str = ''
                if (response.topics.length > 0) {
                  if (response.topics.length === 1) {
                    str += 'Olha talvez esse post da comunidade possa te ajudar: '
                  } else {
                    str += 'Olha talvez esses posts da comunidade possam te ajudar: '
                  }
                  for (var z = 0; z < response.topics.length; z++) {
                    responseCallback(response.topics[z].id)
                    // link
                    str += '<a href="https://community.e-com.plus/t/' + response.topics[z].id + '"> https://community.e-com.plus/t/' + response.topics[z].id + ' </a>'
                  }
                  responseCallback(str)
                } else {
                  responseCallback('Não entendi, poderia perguntar de outra forma ?')
                }
              })
            break

          // discuss
          case 'keywords':
            // url to search
            if (serverResponse.result.parameters.keyword !== '') {
              url += serverResponse.result.parameters.keyword + '&q='
              disc = true
            }

            if (size > 0) {
              size--
              promise = client.textRequest('keyword: ' + keywords[size])
              sendDialogFlow(promise)
            } else if (disc === true) {
              url = url.slice(0, -3)
              bool = false
              size = 0
              disc = false
              /* global $ */
              $.ajax({
                method: 'GET',
                url: url,
                dataType: 'json'
              })
                .done(function (response) {
                /* endpoint = '' */
                  var str = ''
                  if (response.topics && response.topics.length > 0) {
                    if (response.topics.length === 1) {
                      str += 'Olha talvez esse post da comunidade possa lhe ajudar: '
                    } else {
                      str += 'Olha talvez esses posts da comunidade possam lhe ajudar: '
                    }
                    for (var z = 0; z < response.topics.length; z++) {
                      // link
                      str += '<a href="https://community.e-com.plus/t/' + response.topics[z].id + '" target="_blank"> https://community.e-com.plus/t/' + response.topics[z].id + ' </a>'
                    }
                    responseCallback(str)
                  } else {
                    responseCallback('Não entendi, poderia perguntar de outra forma ?')
                  }
                })
            } else if (disc === false) {
              // NONE KEYWORDS TRIGGERED ON DIALOGFLOW, SEND A GET ON COMMUNITY WITH THE KERWORDS
              url = 'https://community.e-com.plus/search.json?'
              for (z = 0; z < keywords.length; z++) {
                if (keywords[z] !== '' && keywords[z] !== ' ' && keywords[z] !== '?' && keywords[z].length > 4) {
                  url += keywords[z] + '&q='
                }
              }
              // remove the last 3 varters '&q='
              url = url.slice(0, -3)
              $.ajax({
                method: 'GET',
                url: url,
                dataType: 'json'
              })
                .done(function (response) {
                /* endpoint = '' */
                  var str = ''
                  if (response.topics.length > 0) {
                    if (response.topics.length === 1) {
                      str += 'Olha talvez esse post da comunidade possa lhe ajudar: '
                    } else {
                      str += 'Olha talvez esses posts da comunidade possam lhe ajudar: '
                    }
                    for (var z = 0; z < response.topics.length; z++) {
                      // link
                      str += '<a href="https://community.e-com.plus/t/' + response.topics[z].id + '" target="_blank"> https://community.e-com.plus/t/' + response.topics[z].id + ' </a>'
                    }
                    responseCallback(str)
                  } else {
                    responseCallback('Não entendi, poderia perguntar de outra forma ?')
                  }
                })
            } else {
              bool = false
              size = 0
              disc = false
              responseCallback('Não entendi, poderia perguntar de outra forma ?')
            }
            break

          default:
            // response from dialogflow
            var str1 = ''
            var dialogResponse = ''
            responseCallback('')
            if (serverResponse.result.fulfillment.messages.length > 1) {
              for (var i = 0; i < serverResponse.result.fulfillment.messages.length; i++) {
                dialogResponse = ''
                str1 = ''
                str1 += serverResponse.result.fulfillment.messages[i].speech
                dialogResponse += str1.replace(/(https?:[\S]+)/g, '<a href="$1" target="_blank">$1></a>')
                responseCallback(dialogResponse)
              }
            } else {
              /* response from dialogflow */
              if (serverResponse.result.fulfillment.speech !== '') {
                responseCallback(serverResponse.result.fulfillment.speech)
              } else {
                /* none response from dialogflow, go to community */
                var str2 = serverResponse.result.resolvedQuery
                keywords2 = str2.split(' ')
                url = 'https://community.e-com.plus/search.json?q='
                for (z = 0; z < keywords2.length; z++) {
                  if (keywords2[z] !== '' || keywords2[z] !== ' ' || keywords2[z] !== '?' || keywords2[z].length > 4) {
                    url += keywords2[z] + '&q='
                  }
                }
                url = url.slice(0, -3)
                $.ajax({
                  method: 'GET',
                  url: url,
                  dataType: 'json'
                })
                  .done(function (response) {
                  /* endpoint = '' */
                    var str = ''
                    if (response.topics && response.topics.length > 0) {
                      if (response.topics.length === 1) {
                        str += 'Olha talvez esse post da comunidade possa te ajudar: '
                      } else {
                        str += 'Olha talvez esses posts da comunidade possam te ajudar: '
                      }
                      for (var z = 0; z < response.topics.length; z++) {
                        // link
                        str += '<a href="https://community.e-com.plus/t/' + response.topics[z].id + '" target="_blank"> https://community.e-com.plus/t/' + response.topics[z].id + ' </a>'
                      }
                      responseCallback(str)
                    } else {
                      responseCallback('Não entendi, poderia perguntar de outra forma ?')
                    }
                  })
              }
            }
        }
      } else {
        // none intent was triggered
        // verify if keywords already exits
        if (bool === false) {
          bool = true
          var str = serverResponse.result.resolvedQuery
          keywords = str.split(' ')
          for (var y = 0; y < keywords.length; y++) {
            if (keywords[y] !== '' || keywords[y] !== ' ' || keywords[y] !== '?') {
              size++
            }
          }
          // do the first request
          size--
          url = 'https://community.e-com.plus/search.json?q='
          promise = client.textRequest('keyword: ' + keywords[size])
          sendDialogFlow(promise)
        } else {
          if (size > 0) {
            size--
            promise = client.textRequest('keyword: ' + keywords[size])
            sendDialogFlow(promise)
          } else if (disc === true) {
            // remove the last 3 varters '&q='
            url = url.slice(0, -3)
            bool = false
            size = 0
            disc = false
            /* global $ */
            $.ajax({
              method: 'GET',
              url: url,
              dataType: 'json'
            })
              .done(function (response) {
                /* endpoint = '' */
                var str = 'Olha talvez esses posts da comunidade possa te ajudar: '
                for (var z = 0; z < response.topics.length; z++) {
                  // link
                  str += '<a href="https://community.e-com.plus/t/' + response.topics[z].id + '" target="_blank"> https://community.e-com.plus/t/' + response.topics[z].id + ' </a>'
                }
                responseCallback(str)
              })
          } else {
            bool = false
            size = 0
            disc = false
            responseCallback('Não entendi, poderia perguntar de outra forma ?')
          }
        }
      }
    }

    // Error Handling
    function handleError (callback, errMsg, responseBody) {
      if (typeof callback === 'function') {
        var err = new Error(errMsg)
        if (responseBody === undefined) {
          // body null when error occurs before send API request
          callback(err, null)
        } else {
          callback(err, responseBody)
        }
      }
      console.log('WARNING' + '\n' + errMsg)
    }
  }

  var sendApi = function (endpoint, method, body, callback) {
    // using jQuery.ajax for HTTPS request
    var config = {
      method: method,
      url: 'https://api.e-com.plus/v1/' + endpoint,
      dataType: 'json',
      headers: {
        'X-Access-Token': accessToken,
        'X-My-ID': myID,
        'X-Store-ID': storeID
      }
    }
    if (typeof body === 'object') {
      config.data = JSON.stringify(body)
    }
    $.ajax(config)
      .done(function (json) {
        /* endpoint = '' */
        if (typeof callback === 'function') {
          // err null
          callback(null, json)
        } else {
          console.log(json)
        }
      })

      .fail(function (jqXHR, textStatus, err) {
        var msg
        if (body.hasOwnProperty('message')) {
          msg = body.message
        } else {
          // probably an error response from Graphs or Search API
          // not handling Neo4j and Elasticsearch errors
          msg = 'Unknown error, see response objet to more info'
        }
        errorHandling(callback, msg, jqXHR.responseJSON)
      })
  }

  var errorHandling = function (callback, errMsg, responseBody) {
    if (typeof callback === 'function') {
      var err = new Error(errMsg)
      if (responseBody === undefined) {
        // body null when error occurs before send API request
        callback(err, null)
      } else {
        callback(err, responseBody)
      }
    }
    callback(errMsg, null)
  }

  return {
    // function to init conversation on dialogflow with some parameters
    'init': function (storeid, storeName, domain, name, gender, email, userID, language, token, id,
      ResponseCallback, ActionCallback) {
      // set token and id to authentication requests
      accessToken = token
      myID = id
      storeID = storeid

      // msg
      responseCallback = ResponseCallback
      // object
      actionCallback = ActionCallback

      // using JS SDK from dialogflow
      var msg = 'O id: ' + storeID + ' nome da loja: ' + storeName + ' dominio: ' + domain +
        ' nome: ' + name + ' gênero: ' + gender + ' email: ' + email +
        ' id do usuário: ' + userID + ' linguagem: ' + language
      var promise = client.textRequest(msg)

      // sendRequest
      sendDialogFlow(promise)
    },

    // function to send the actual page of the user to help the search
    'sendPage': function (page) {
      // using JS SDK from dialogflow
      var promise = client.textRequest('pagina:' + page)
      // treatMessage
      sendDialogFlow(promise)
    },

    // function to send message from user
    'sendMessage': function (msg, callback) {
      // using JS SDK from dialogflow
      var promise = client.textRequest(msg)

      // treatMessage
      sendDialogFlow(promise, callback)
    }
  }
}())


