/* md5/md5.min.js */
!function(n){"use strict";function t(n,t){var r=(65535&n)+(65535&t);return(n>>16)+(t>>16)+(r>>16)<<16|65535&r}function r(n,t){return n<<t|n>>>32-t}function e(n,e,o,u,c,f){return t(r(t(t(e,n),t(u,f)),c),o)}function o(n,t,r,o,u,c,f){return e(t&r|~t&o,n,t,u,c,f)}function u(n,t,r,o,u,c,f){return e(t&o|r&~o,n,t,u,c,f)}function c(n,t,r,o,u,c,f){return e(t^r^o,n,t,u,c,f)}function f(n,t,r,o,u,c,f){return e(r^(t|~o),n,t,u,c,f)}function i(n,r){n[r>>5]|=128<<r%32,n[14+(r+64>>>9<<4)]=r;var e,i,a,d,h,l=1732584193,g=-271733879,v=-1732584194,m=271733878;for(e=0;e<n.length;e+=16)i=l,a=g,d=v,h=m,g=f(g=f(g=f(g=f(g=c(g=c(g=c(g=c(g=u(g=u(g=u(g=u(g=o(g=o(g=o(g=o(g,v=o(v,m=o(m,l=o(l,g,v,m,n[e],7,-680876936),g,v,n[e+1],12,-389564586),l,g,n[e+2],17,606105819),m,l,n[e+3],22,-1044525330),v=o(v,m=o(m,l=o(l,g,v,m,n[e+4],7,-176418897),g,v,n[e+5],12,1200080426),l,g,n[e+6],17,-1473231341),m,l,n[e+7],22,-45705983),v=o(v,m=o(m,l=o(l,g,v,m,n[e+8],7,1770035416),g,v,n[e+9],12,-1958414417),l,g,n[e+10],17,-42063),m,l,n[e+11],22,-1990404162),v=o(v,m=o(m,l=o(l,g,v,m,n[e+12],7,1804603682),g,v,n[e+13],12,-40341101),l,g,n[e+14],17,-1502002290),m,l,n[e+15],22,1236535329),v=u(v,m=u(m,l=u(l,g,v,m,n[e+1],5,-165796510),g,v,n[e+6],9,-1069501632),l,g,n[e+11],14,643717713),m,l,n[e],20,-373897302),v=u(v,m=u(m,l=u(l,g,v,m,n[e+5],5,-701558691),g,v,n[e+10],9,38016083),l,g,n[e+15],14,-660478335),m,l,n[e+4],20,-405537848),v=u(v,m=u(m,l=u(l,g,v,m,n[e+9],5,568446438),g,v,n[e+14],9,-1019803690),l,g,n[e+3],14,-187363961),m,l,n[e+8],20,1163531501),v=u(v,m=u(m,l=u(l,g,v,m,n[e+13],5,-1444681467),g,v,n[e+2],9,-51403784),l,g,n[e+7],14,1735328473),m,l,n[e+12],20,-1926607734),v=c(v,m=c(m,l=c(l,g,v,m,n[e+5],4,-378558),g,v,n[e+8],11,-2022574463),l,g,n[e+11],16,1839030562),m,l,n[e+14],23,-35309556),v=c(v,m=c(m,l=c(l,g,v,m,n[e+1],4,-1530992060),g,v,n[e+4],11,1272893353),l,g,n[e+7],16,-155497632),m,l,n[e+10],23,-1094730640),v=c(v,m=c(m,l=c(l,g,v,m,n[e+13],4,681279174),g,v,n[e],11,-358537222),l,g,n[e+3],16,-722521979),m,l,n[e+6],23,76029189),v=c(v,m=c(m,l=c(l,g,v,m,n[e+9],4,-640364487),g,v,n[e+12],11,-421815835),l,g,n[e+15],16,530742520),m,l,n[e+2],23,-995338651),v=f(v,m=f(m,l=f(l,g,v,m,n[e],6,-198630844),g,v,n[e+7],10,1126891415),l,g,n[e+14],15,-1416354905),m,l,n[e+5],21,-57434055),v=f(v,m=f(m,l=f(l,g,v,m,n[e+12],6,1700485571),g,v,n[e+3],10,-1894986606),l,g,n[e+10],15,-1051523),m,l,n[e+1],21,-2054922799),v=f(v,m=f(m,l=f(l,g,v,m,n[e+8],6,1873313359),g,v,n[e+15],10,-30611744),l,g,n[e+6],15,-1560198380),m,l,n[e+13],21,1309151649),v=f(v,m=f(m,l=f(l,g,v,m,n[e+4],6,-145523070),g,v,n[e+11],10,-1120210379),l,g,n[e+2],15,718787259),m,l,n[e+9],21,-343485551),l=t(l,i),g=t(g,a),v=t(v,d),m=t(m,h);return[l,g,v,m]}function a(n){var t,r="",e=32*n.length;for(t=0;t<e;t+=8)r+=String.fromCharCode(n[t>>5]>>>t%32&255);return r}function d(n){var t,r=[];for(r[(n.length>>2)-1]=void 0,t=0;t<r.length;t+=1)r[t]=0;var e=8*n.length;for(t=0;t<e;t+=8)r[t>>5]|=(255&n.charCodeAt(t/8))<<t%32;return r}function h(n){return a(i(d(n),8*n.length))}function l(n,t){var r,e,o=d(n),u=[],c=[];for(u[15]=c[15]=void 0,o.length>16&&(o=i(o,8*n.length)),r=0;r<16;r+=1)u[r]=909522486^o[r],c[r]=1549556828^o[r];return e=i(u.concat(d(t)),512+8*t.length),a(i(c.concat(e),640))}function g(n){var t,r,e="";for(r=0;r<n.length;r+=1)t=n.charCodeAt(r),e+="0123456789abcdef".charAt(t>>>4&15)+"0123456789abcdef".charAt(15&t);return e}function v(n){return unescape(encodeURIComponent(n))}function m(n){return h(v(n))}function p(n){return g(m(n))}function s(n,t){return l(v(n),v(t))}function C(n,t){return g(s(n,t))}function A(n,t,r){return t?r?s(t,n):C(t,n):r?m(n):p(n)}"function"==typeof define&&define.amd?define(function(){return A}):"object"==typeof module&&module.exports?module.exports=A:n.md5=A}(this);
//# sourceMappingURL=md5.min.js.map

/* promise/es6-promise.auto.min.js */
!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):t.ES6Promise=e()}(this,function(){"use strict";function t(t){var e=typeof t;return null!==t&&("object"===e||"function"===e)}function e(t){return"function"==typeof t}function n(t){B=t}function r(t){G=t}function o(){return function(){return process.nextTick(a)}}function i(){return"undefined"!=typeof z?function(){z(a)}:c()}function s(){var t=0,e=new J(a),n=document.createTextNode("");return e.observe(n,{characterData:!0}),function(){n.data=t=++t%2}}function u(){var t=new MessageChannel;return t.port1.onmessage=a,function(){return t.port2.postMessage(0)}}function c(){var t=setTimeout;return function(){return t(a,1)}}function a(){for(var t=0;t<W;t+=2){var e=V[t],n=V[t+1];e(n),V[t]=void 0,V[t+1]=void 0}W=0}function f(){try{var t=Function("return this")().require("vertx");return z=t.runOnLoop||t.runOnContext,i()}catch(e){return c()}}function l(t,e){var n=this,r=new this.constructor(p);void 0===r[Z]&&O(r);var o=n._state;if(o){var i=arguments[o-1];G(function(){return P(o,r,i,n._result)})}else E(n,r,t,e);return r}function h(t){var e=this;if(t&&"object"==typeof t&&t.constructor===e)return t;var n=new e(p);return g(n,t),n}function p(){}function v(){return new TypeError("You cannot resolve a promise with itself")}function d(){return new TypeError("A promises callback cannot return that same promise.")}function _(t){try{return t.then}catch(e){return nt.error=e,nt}}function y(t,e,n,r){try{t.call(e,n,r)}catch(o){return o}}function m(t,e,n){G(function(t){var r=!1,o=y(n,e,function(n){r||(r=!0,e!==n?g(t,n):S(t,n))},function(e){r||(r=!0,j(t,e))},"Settle: "+(t._label||" unknown promise"));!r&&o&&(r=!0,j(t,o))},t)}function b(t,e){e._state===tt?S(t,e._result):e._state===et?j(t,e._result):E(e,void 0,function(e){return g(t,e)},function(e){return j(t,e)})}function w(t,n,r){n.constructor===t.constructor&&r===l&&n.constructor.resolve===h?b(t,n):r===nt?(j(t,nt.error),nt.error=null):void 0===r?S(t,n):e(r)?m(t,n,r):S(t,n)}function g(e,n){e===n?j(e,v()):t(n)?w(e,n,_(n)):S(e,n)}function A(t){t._onerror&&t._onerror(t._result),T(t)}function S(t,e){t._state===$&&(t._result=e,t._state=tt,0!==t._subscribers.length&&G(T,t))}function j(t,e){t._state===$&&(t._state=et,t._result=e,G(A,t))}function E(t,e,n,r){var o=t._subscribers,i=o.length;t._onerror=null,o[i]=e,o[i+tt]=n,o[i+et]=r,0===i&&t._state&&G(T,t)}function T(t){var e=t._subscribers,n=t._state;if(0!==e.length){for(var r=void 0,o=void 0,i=t._result,s=0;s<e.length;s+=3)r=e[s],o=e[s+n],r?P(n,r,o,i):o(i);t._subscribers.length=0}}function M(t,e){try{return t(e)}catch(n){return nt.error=n,nt}}function P(t,n,r,o){var i=e(r),s=void 0,u=void 0,c=void 0,a=void 0;if(i){if(s=M(r,o),s===nt?(a=!0,u=s.error,s.error=null):c=!0,n===s)return void j(n,d())}else s=o,c=!0;n._state!==$||(i&&c?g(n,s):a?j(n,u):t===tt?S(n,s):t===et&&j(n,s))}function x(t,e){try{e(function(e){g(t,e)},function(e){j(t,e)})}catch(n){j(t,n)}}function C(){return rt++}function O(t){t[Z]=rt++,t._state=void 0,t._result=void 0,t._subscribers=[]}function k(){return new Error("Array Methods must be provided an Array")}function F(t){return new ot(this,t).promise}function Y(t){var e=this;return new e(U(t)?function(n,r){for(var o=t.length,i=0;i<o;i++)e.resolve(t[i]).then(n,r)}:function(t,e){return e(new TypeError("You must pass an array to race."))})}function q(t){var e=this,n=new e(p);return j(n,t),n}function D(){throw new TypeError("You must pass a resolver function as the first argument to the promise constructor")}function K(){throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.")}function L(){var t=void 0;if("undefined"!=typeof global)t=global;else if("undefined"!=typeof self)t=self;else try{t=Function("return this")()}catch(e){throw new Error("polyfill failed because global object is unavailable in this environment")}var n=t.Promise;if(n){var r=null;try{r=Object.prototype.toString.call(n.resolve())}catch(e){}if("[object Promise]"===r&&!n.cast)return}t.Promise=it}var N=void 0;N=Array.isArray?Array.isArray:function(t){return"[object Array]"===Object.prototype.toString.call(t)};var U=N,W=0,z=void 0,B=void 0,G=function(t,e){V[W]=t,V[W+1]=e,W+=2,2===W&&(B?B(a):X())},H="undefined"!=typeof window?window:void 0,I=H||{},J=I.MutationObserver||I.WebKitMutationObserver,Q="undefined"==typeof self&&"undefined"!=typeof process&&"[object process]"==={}.toString.call(process),R="undefined"!=typeof Uint8ClampedArray&&"undefined"!=typeof importScripts&&"undefined"!=typeof MessageChannel,V=new Array(1e3),X=void 0;X=Q?o():J?s():R?u():void 0===H&&"function"==typeof require?f():c();var Z=Math.random().toString(36).substring(2),$=void 0,tt=1,et=2,nt={error:null},rt=0,ot=function(){function t(t,e){this._instanceConstructor=t,this.promise=new t(p),this.promise[Z]||O(this.promise),U(e)?(this.length=e.length,this._remaining=e.length,this._result=new Array(this.length),0===this.length?S(this.promise,this._result):(this.length=this.length||0,this._enumerate(e),0===this._remaining&&S(this.promise,this._result))):j(this.promise,k())}return t.prototype._enumerate=function(t){for(var e=0;this._state===$&&e<t.length;e++)this._eachEntry(t[e],e)},t.prototype._eachEntry=function(t,e){var n=this._instanceConstructor,r=n.resolve;if(r===h){var o=_(t);if(o===l&&t._state!==$)this._settledAt(t._state,e,t._result);else if("function"!=typeof o)this._remaining--,this._result[e]=t;else if(n===it){var i=new n(p);w(i,t,o),this._willSettleAt(i,e)}else this._willSettleAt(new n(function(e){return e(t)}),e)}else this._willSettleAt(r(t),e)},t.prototype._settledAt=function(t,e,n){var r=this.promise;r._state===$&&(this._remaining--,t===et?j(r,n):this._result[e]=n),0===this._remaining&&S(r,this._result)},t.prototype._willSettleAt=function(t,e){var n=this;E(t,void 0,function(t){return n._settledAt(tt,e,t)},function(t){return n._settledAt(et,e,t)})},t}(),it=function(){function t(e){this[Z]=C(),this._result=this._state=void 0,this._subscribers=[],p!==e&&("function"!=typeof e&&D(),this instanceof t?x(this,e):K())}return t.prototype["catch"]=function(t){return this.then(null,t)},t.prototype["finally"]=function(t){var e=this,n=e.constructor;return e.then(function(e){return n.resolve(t()).then(function(){return e})},function(e){return n.resolve(t()).then(function(){throw e})})},t}();return it.prototype.then=l,it.all=F,it.race=Y,it.resolve=h,it.reject=q,it._setScheduler=n,it._setAsap=r,it._asap=G,it.polyfill=L,it.Promise=it,it.polyfill(),it});

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
  var keywords
  // number of keywords
  var size = 0
  // variable to verify if the keyword alreay exists
  var bool = false
  var disc = false

  var sendDialogFlow = function (promise, callback) {
    promise.then(handleResponse).catch(handleError)

    function handleResponse (serverResponse) {
      console.log(serverResponse)
      // intent name
      var intent = serverResponse.result.metadata.intentName
      if (intent) {
        switch (intent) {
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
              console.log('Não existe esta propriedade para este recurso')
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
            console.log(body)
            sendApi(endpoint, method, body, function (err, response) {
              console.log(response)
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
              console.log('Não existe esta propriedade para este recurso')
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
              console.log('Não existe esta propriedade para este recurso')
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

          // discuss
          case 'keywords':
            console.log('2')
            // url to search
            if (serverResponse.result.parameters.keyword) {
              url += serverResponse.result.parameters.keyword + '&q='
              disc = true
            }

            if (size > 0) {
              size--
              promise = client.textRequest('keyword: ' + keywords[size])
              sendDialogFlow(promise)
            } else if (disc === true) {
              url = url.slice(0, -3)
              console.log(url)
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
                    console.log(response.topics[z].id)
                    // link
                    str += '<a href="https://community.e-com.plus/t/' + response.topics[z].id + '"> https://community.e-com.plus/t/' + response.topics[z].id + ' </a>'
                    responseCallback(str)
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
            var str1 = serverResponse.result.fulfillment.speech
            var dialogResponse = str1.replace(/(https?:[\S]+)/g, '<a href="$1">$1></a>')
            responseCallback(dialogResponse)
            // if (serverResponse.result.fulfillment.messages.length > 1) {
            //   for (var i = 0; i < serverResponse.result.fulfillment.messages.length; i++) {
            //     callback(serverResponse.result.fulfillment.messages[i].speech)
            //   }
            // } else {
            //   /* callback */
            //   callback(serverResponse.result.fulfillment.speech)
            // }
        }
      } else {
        console.log('1')
        console.log(bool)
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
            console.log(url)
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
                  console.log(response.topics[z].id)
                  // link
                  str += '<a href="https://community.e-com.plus/t/' + response.topics[z].id + '"> https://community.e-com.plus/t/' + response.topics[z].id + ' </a>'
                  responseCallback(str)
                }
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
    function handleError (serverError) {
      // @TODO
      console.log(serverError)
    }
  }

  var sendApi = function (endpoint, method, body, callback) {
    // using jQuery.ajax for HTTPS request
    // console.log(url)
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
    console.log(config.headers)
    if (typeof body === 'object') {
      config.data = JSON.stringify(body)
    }

    // global $
    var ajax = $.ajax(config)

    ajax.done(function (json) {
      /* endpoint = '' */
      if (typeof callback === 'function') {
        // err null
        callback(null, json)
      } else {
        console.log(json)
      }
    })

    ajax.fail(function (jqXHR, textStatus, err) {
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
      console.log(responseBody)
      if (responseBody === undefined) {
        // body null when error occurs before send API request
        callback(err, null)
      } else {
        callback(err, responseBody)
      }
    }
    console.log(errMsg)
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


