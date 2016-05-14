/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _NutformsApiAspectsSource = __webpack_require__(1);

	var _NutformsApiAspectsSource2 = _interopRequireDefault(_NutformsApiAspectsSource);

	var _Nutforms = __webpack_require__(3);

	var _Nutforms2 = _interopRequireDefault(_Nutforms);

	var _NutformsActions = __webpack_require__(24);

	var NutformsActions = _interopRequireWildcard(_NutformsActions);

	var _ModelActions = __webpack_require__(16);

	var ModelActions = _interopRequireWildcard(_ModelActions);

	var _AttributeActions = __webpack_require__(9);

	var AttributeActions = _interopRequireWildcard(_AttributeActions);

	var _DOMHelper = __webpack_require__(15);

	var _DOMHelper2 = _interopRequireDefault(_DOMHelper);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	window.Nutforms = new _Nutforms2.default();
	window.NutformsApiAspectsSource = _NutformsApiAspectsSource2.default;
	window.NutformsActions = NutformsActions;
	window.ModelActions = ModelActions;
	window.AttributeActions = AttributeActions;
	window.DOMHelper = _DOMHelper2.default;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	__webpack_require__(2);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var NutformsApiAspectsSource = function () {

	    /**
	     * Retriever of aspects definitions from Nutforms Server REST API.
	     * @param {string} apiAddress   URL of the API
	     * @param {string} apiUser      Name of the API user
	     * @param {string} apiPassword  Password of the API user
	     */

	    function NutformsApiAspectsSource(apiAddress, apiUser, apiPassword) {
	        _classCallCheck(this, NutformsApiAspectsSource);

	        this.API_ENDPOINT = 'api/';
	        this.RULES_ENDPOINT = 'rules/';
	        this.LAYOUT_ENDPOINT = 'layout/';
	        this.LOCALIZATION_ENDPOINT = 'localization/';
	        this.CLASS_METADATA_ENDPOINT = 'meta/class/';
	        this.WIDGET_ENDPOINT = 'widget/';
	        this.WIDGET_MAPPING_ENDPOINT = 'widget-mapping/';

	        this.apiAddress = apiAddress;
	        this.apiUser = apiUser;
	        this.apiPassword = apiPassword;

	        this._toText = function (response) {
	            return response.text();
	        };
	        this._toJson = function (response) {
	            try {
	                return response.json();
	            } catch (err) {
	                console.log("Error while parsing JSON", response);
	                return null;
	            }
	        };
	        this._logResponse = function (message) {
	            return function (response) {
	                console.log(message, response);
	                return response;
	            };
	        };
	    }

	    /**
	     * Fetches model structure metadata for entity.
	     * @param {string} entityName Name of the entity.
	     * @returns {Promise}
	     */


	    _createClass(NutformsApiAspectsSource, [{
	        key: 'fetchStructureMetadata',
	        value: function fetchStructureMetadata(entityName) {
	            return fetch(this._buildUrl(this.CLASS_METADATA_ENDPOINT + entityName)).then(this._logResponse("Class metadata loaded from API")).then(this._toJson);
	        }

	        /**
	         * Fetches values of entity.
	         * @param {string} entityName Name of the entity.
	         * @param {number} entityId Identifier of the entity.
	         * @returns {Promise}
	         */

	    }, {
	        key: 'fetchValues',
	        value: function fetchValues(entityName, entityId) {
	            if (entityId === null) {
	                return Promise.resolve({});
	            }

	            return fetch(this._buildUrl(this.API_ENDPOINT + entityName.split(".").pop() + '/' + entityId), {
	                headers: {
	                    Authorization: "Basic " + Base64.encode(this.apiUser + ":" + this.apiPassword),
	                    Accept: "application/json;charset=UTF-8",
	                    "Content-type": "application/json;charset=UTF-8"
	                }
	            }).then(this._toJson).then(this._logResponse("Entity data loaded from API"));
	        }

	        /**
	         * Fetches localization aspect data for entity in locale.
	         * @param {string} entityName Name of the entity.
	         * @param {string} locale Identifier of the locale.
	         * @param {string} context Name of the business context.
	         * @returns {Promise}
	         */

	    }, {
	        key: 'fetchLocalizationData',
	        value: function fetchLocalizationData(entityName, locale, context) {
	            return fetch(this._buildUrl(this.LOCALIZATION_ENDPOINT + locale + '/' + entityName + '/' + context)).then(this._toJson).then(this._logResponse("Localization data loaded from API"));
	        }

	        /**
	         * Fetches layout definition.
	         * @param {string} layoutName Name of the layout.
	         * @returns {Promise}
	         */

	    }, {
	        key: 'fetchLayout',
	        value: function fetchLayout(layoutName) {
	            return fetch(this._buildUrl(this.LAYOUT_ENDPOINT + layoutName)).then(this._logResponse("Layout \"" + layoutName + "\" loaded from API")).then(this._toText);
	        }

	        /**
	         * Fetches widget definition.
	         * @param {string} widgetName Name of the widget.
	         * @returns {string}
	         */

	    }, {
	        key: 'fetchWidget',
	        value: function fetchWidget(widgetName) {
	            // TODO: Improvement: make this asynchronous
	            var request = new XMLHttpRequest();
	            request.open('GET', this._buildUrl(this.WIDGET_ENDPOINT + widgetName), false); // `false` makes the request synchronous
	            request.send(null);
	            return request.responseText;
	        }

	        /**
	         * Fetches widget mapping function.
	         * @returns {string}
	         */

	    }, {
	        key: 'fetchWidgetMapping',
	        value: function fetchWidgetMapping() {
	            // TODO: Improvement: make this asynchronous
	            var request = new XMLHttpRequest();
	            request.open('GET', this._buildUrl(this.WIDGET_MAPPING_ENDPOINT), false); // `false` makes the request synchronous
	            request.send(null);
	            return request.responseText;
	        }

	        /**
	         * Builds whole URL of the resource for given path.
	         *
	         * @param {string} path
	         * @returns {string}
	         * @private
	         */

	    }, {
	        key: '_buildUrl',
	        value: function _buildUrl(path) {
	            return this.apiAddress + path;
	        }
	    }]);

	    return NutformsApiAspectsSource;
	}();

	exports.default = NutformsApiAspectsSource;


	var Base64 = {
	    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", encode: function encode(e) {
	        var t = "";
	        var n, r, i, s, o, u, a;
	        var f = 0;
	        e = Base64._utf8_encode(e);
	        while (f < e.length) {
	            n = e.charCodeAt(f++);
	            r = e.charCodeAt(f++);
	            i = e.charCodeAt(f++);
	            s = n >> 2;
	            o = (n & 3) << 4 | r >> 4;
	            u = (r & 15) << 2 | i >> 6;
	            a = i & 63;
	            if (isNaN(r)) {
	                u = a = 64;
	            } else if (isNaN(i)) {
	                a = 64;
	            }
	            t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a);
	        }
	        return t;
	    }, decode: function decode(e) {
	        var t = "";
	        var n, r, i;
	        var s, o, u, a;
	        var f = 0;
	        e = e.replace(/[^A-Za-z0-9\+\/\=]/g, "");
	        while (f < e.length) {
	            s = this._keyStr.indexOf(e.charAt(f++));
	            o = this._keyStr.indexOf(e.charAt(f++));
	            u = this._keyStr.indexOf(e.charAt(f++));
	            a = this._keyStr.indexOf(e.charAt(f++));
	            n = s << 2 | o >> 4;
	            r = (o & 15) << 4 | u >> 2;
	            i = (u & 3) << 6 | a;
	            t = t + String.fromCharCode(n);
	            if (u != 64) {
	                t = t + String.fromCharCode(r);
	            }
	            if (a != 64) {
	                t = t + String.fromCharCode(i);
	            }
	        }
	        t = Base64._utf8_decode(t);
	        return t;
	    }, _utf8_encode: function _utf8_encode(e) {
	        e = e.replace(/\r\n/g, "\n");
	        var t = "";
	        for (var n = 0; n < e.length; n++) {
	            var r = e.charCodeAt(n);
	            if (r < 128) {
	                t += String.fromCharCode(r);
	            } else if (r > 127 && r < 2048) {
	                t += String.fromCharCode(r >> 6 | 192);
	                t += String.fromCharCode(r & 63 | 128);
	            } else {
	                t += String.fromCharCode(r >> 12 | 224);
	                t += String.fromCharCode(r >> 6 & 63 | 128);
	                t += String.fromCharCode(r & 63 | 128);
	            }
	        }
	        return t;
	    }, _utf8_decode: function _utf8_decode(e) {
	        var t = "";
	        var n = 0;
	        var r = c1 = c2 = 0;
	        while (n < e.length) {
	            r = e.charCodeAt(n);
	            if (r < 128) {
	                t += String.fromCharCode(r);
	                n++;
	            } else if (r > 191 && r < 224) {
	                c2 = e.charCodeAt(n + 1);
	                t += String.fromCharCode((r & 31) << 6 | c2 & 63);
	                n += 2;
	            } else {
	                c2 = e.charCodeAt(n + 1);
	                c3 = e.charCodeAt(n + 2);
	                t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
	                n += 3;
	            }
	        }
	        return t;
	    }
	};

/***/ },
/* 2 */
/***/ function(module, exports) {

	(function(self) {
	  'use strict';

	  if (self.fetch) {
	    return
	  }

	  var support = {
	    searchParams: 'URLSearchParams' in self,
	    iterable: 'Symbol' in self && 'iterator' in Symbol,
	    blob: 'FileReader' in self && 'Blob' in self && (function() {
	      try {
	        new Blob()
	        return true
	      } catch(e) {
	        return false
	      }
	    })(),
	    formData: 'FormData' in self,
	    arrayBuffer: 'ArrayBuffer' in self
	  }

	  function normalizeName(name) {
	    if (typeof name !== 'string') {
	      name = String(name)
	    }
	    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
	      throw new TypeError('Invalid character in header field name')
	    }
	    return name.toLowerCase()
	  }

	  function normalizeValue(value) {
	    if (typeof value !== 'string') {
	      value = String(value)
	    }
	    return value
	  }

	  // Build a destructive iterator for the value list
	  function iteratorFor(items) {
	    var iterator = {
	      next: function() {
	        var value = items.shift()
	        return {done: value === undefined, value: value}
	      }
	    }

	    if (support.iterable) {
	      iterator[Symbol.iterator] = function() {
	        return iterator
	      }
	    }

	    return iterator
	  }

	  function Headers(headers) {
	    this.map = {}

	    if (headers instanceof Headers) {
	      headers.forEach(function(value, name) {
	        this.append(name, value)
	      }, this)

	    } else if (headers) {
	      Object.getOwnPropertyNames(headers).forEach(function(name) {
	        this.append(name, headers[name])
	      }, this)
	    }
	  }

	  Headers.prototype.append = function(name, value) {
	    name = normalizeName(name)
	    value = normalizeValue(value)
	    var list = this.map[name]
	    if (!list) {
	      list = []
	      this.map[name] = list
	    }
	    list.push(value)
	  }

	  Headers.prototype['delete'] = function(name) {
	    delete this.map[normalizeName(name)]
	  }

	  Headers.prototype.get = function(name) {
	    var values = this.map[normalizeName(name)]
	    return values ? values[0] : null
	  }

	  Headers.prototype.getAll = function(name) {
	    return this.map[normalizeName(name)] || []
	  }

	  Headers.prototype.has = function(name) {
	    return this.map.hasOwnProperty(normalizeName(name))
	  }

	  Headers.prototype.set = function(name, value) {
	    this.map[normalizeName(name)] = [normalizeValue(value)]
	  }

	  Headers.prototype.forEach = function(callback, thisArg) {
	    Object.getOwnPropertyNames(this.map).forEach(function(name) {
	      this.map[name].forEach(function(value) {
	        callback.call(thisArg, value, name, this)
	      }, this)
	    }, this)
	  }

	  Headers.prototype.keys = function() {
	    var items = []
	    this.forEach(function(value, name) { items.push(name) })
	    return iteratorFor(items)
	  }

	  Headers.prototype.values = function() {
	    var items = []
	    this.forEach(function(value) { items.push(value) })
	    return iteratorFor(items)
	  }

	  Headers.prototype.entries = function() {
	    var items = []
	    this.forEach(function(value, name) { items.push([name, value]) })
	    return iteratorFor(items)
	  }

	  if (support.iterable) {
	    Headers.prototype[Symbol.iterator] = Headers.prototype.entries
	  }

	  function consumed(body) {
	    if (body.bodyUsed) {
	      return Promise.reject(new TypeError('Already read'))
	    }
	    body.bodyUsed = true
	  }

	  function fileReaderReady(reader) {
	    return new Promise(function(resolve, reject) {
	      reader.onload = function() {
	        resolve(reader.result)
	      }
	      reader.onerror = function() {
	        reject(reader.error)
	      }
	    })
	  }

	  function readBlobAsArrayBuffer(blob) {
	    var reader = new FileReader()
	    reader.readAsArrayBuffer(blob)
	    return fileReaderReady(reader)
	  }

	  function readBlobAsText(blob) {
	    var reader = new FileReader()
	    reader.readAsText(blob)
	    return fileReaderReady(reader)
	  }

	  function Body() {
	    this.bodyUsed = false

	    this._initBody = function(body) {
	      this._bodyInit = body
	      if (typeof body === 'string') {
	        this._bodyText = body
	      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
	        this._bodyBlob = body
	      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
	        this._bodyFormData = body
	      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
	        this._bodyText = body.toString()
	      } else if (!body) {
	        this._bodyText = ''
	      } else if (support.arrayBuffer && ArrayBuffer.prototype.isPrototypeOf(body)) {
	        // Only support ArrayBuffers for POST method.
	        // Receiving ArrayBuffers happens via Blobs, instead.
	      } else {
	        throw new Error('unsupported BodyInit type')
	      }

	      if (!this.headers.get('content-type')) {
	        if (typeof body === 'string') {
	          this.headers.set('content-type', 'text/plain;charset=UTF-8')
	        } else if (this._bodyBlob && this._bodyBlob.type) {
	          this.headers.set('content-type', this._bodyBlob.type)
	        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
	          this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8')
	        }
	      }
	    }

	    if (support.blob) {
	      this.blob = function() {
	        var rejected = consumed(this)
	        if (rejected) {
	          return rejected
	        }

	        if (this._bodyBlob) {
	          return Promise.resolve(this._bodyBlob)
	        } else if (this._bodyFormData) {
	          throw new Error('could not read FormData body as blob')
	        } else {
	          return Promise.resolve(new Blob([this._bodyText]))
	        }
	      }

	      this.arrayBuffer = function() {
	        return this.blob().then(readBlobAsArrayBuffer)
	      }

	      this.text = function() {
	        var rejected = consumed(this)
	        if (rejected) {
	          return rejected
	        }

	        if (this._bodyBlob) {
	          return readBlobAsText(this._bodyBlob)
	        } else if (this._bodyFormData) {
	          throw new Error('could not read FormData body as text')
	        } else {
	          return Promise.resolve(this._bodyText)
	        }
	      }
	    } else {
	      this.text = function() {
	        var rejected = consumed(this)
	        return rejected ? rejected : Promise.resolve(this._bodyText)
	      }
	    }

	    if (support.formData) {
	      this.formData = function() {
	        return this.text().then(decode)
	      }
	    }

	    this.json = function() {
	      return this.text().then(JSON.parse)
	    }

	    return this
	  }

	  // HTTP methods whose capitalization should be normalized
	  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']

	  function normalizeMethod(method) {
	    var upcased = method.toUpperCase()
	    return (methods.indexOf(upcased) > -1) ? upcased : method
	  }

	  function Request(input, options) {
	    options = options || {}
	    var body = options.body
	    if (Request.prototype.isPrototypeOf(input)) {
	      if (input.bodyUsed) {
	        throw new TypeError('Already read')
	      }
	      this.url = input.url
	      this.credentials = input.credentials
	      if (!options.headers) {
	        this.headers = new Headers(input.headers)
	      }
	      this.method = input.method
	      this.mode = input.mode
	      if (!body) {
	        body = input._bodyInit
	        input.bodyUsed = true
	      }
	    } else {
	      this.url = input
	    }

	    this.credentials = options.credentials || this.credentials || 'omit'
	    if (options.headers || !this.headers) {
	      this.headers = new Headers(options.headers)
	    }
	    this.method = normalizeMethod(options.method || this.method || 'GET')
	    this.mode = options.mode || this.mode || null
	    this.referrer = null

	    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
	      throw new TypeError('Body not allowed for GET or HEAD requests')
	    }
	    this._initBody(body)
	  }

	  Request.prototype.clone = function() {
	    return new Request(this)
	  }

	  function decode(body) {
	    var form = new FormData()
	    body.trim().split('&').forEach(function(bytes) {
	      if (bytes) {
	        var split = bytes.split('=')
	        var name = split.shift().replace(/\+/g, ' ')
	        var value = split.join('=').replace(/\+/g, ' ')
	        form.append(decodeURIComponent(name), decodeURIComponent(value))
	      }
	    })
	    return form
	  }

	  function headers(xhr) {
	    var head = new Headers()
	    var pairs = (xhr.getAllResponseHeaders() || '').trim().split('\n')
	    pairs.forEach(function(header) {
	      var split = header.trim().split(':')
	      var key = split.shift().trim()
	      var value = split.join(':').trim()
	      head.append(key, value)
	    })
	    return head
	  }

	  Body.call(Request.prototype)

	  function Response(bodyInit, options) {
	    if (!options) {
	      options = {}
	    }

	    this.type = 'default'
	    this.status = options.status
	    this.ok = this.status >= 200 && this.status < 300
	    this.statusText = options.statusText
	    this.headers = options.headers instanceof Headers ? options.headers : new Headers(options.headers)
	    this.url = options.url || ''
	    this._initBody(bodyInit)
	  }

	  Body.call(Response.prototype)

	  Response.prototype.clone = function() {
	    return new Response(this._bodyInit, {
	      status: this.status,
	      statusText: this.statusText,
	      headers: new Headers(this.headers),
	      url: this.url
	    })
	  }

	  Response.error = function() {
	    var response = new Response(null, {status: 0, statusText: ''})
	    response.type = 'error'
	    return response
	  }

	  var redirectStatuses = [301, 302, 303, 307, 308]

	  Response.redirect = function(url, status) {
	    if (redirectStatuses.indexOf(status) === -1) {
	      throw new RangeError('Invalid status code')
	    }

	    return new Response(null, {status: status, headers: {location: url}})
	  }

	  self.Headers = Headers
	  self.Request = Request
	  self.Response = Response

	  self.fetch = function(input, init) {
	    return new Promise(function(resolve, reject) {
	      var request
	      if (Request.prototype.isPrototypeOf(input) && !init) {
	        request = input
	      } else {
	        request = new Request(input, init)
	      }

	      var xhr = new XMLHttpRequest()

	      function responseURL() {
	        if ('responseURL' in xhr) {
	          return xhr.responseURL
	        }

	        // Avoid security warnings on getResponseHeader when not allowed by CORS
	        if (/^X-Request-URL:/m.test(xhr.getAllResponseHeaders())) {
	          return xhr.getResponseHeader('X-Request-URL')
	        }

	        return
	      }

	      xhr.onload = function() {
	        var options = {
	          status: xhr.status,
	          statusText: xhr.statusText,
	          headers: headers(xhr),
	          url: responseURL()
	        }
	        var body = 'response' in xhr ? xhr.response : xhr.responseText
	        resolve(new Response(body, options))
	      }

	      xhr.onerror = function() {
	        reject(new TypeError('Network request failed'))
	      }

	      xhr.ontimeout = function() {
	        reject(new TypeError('Network request failed'))
	      }

	      xhr.open(request.method, request.url, true)

	      if (request.credentials === 'include') {
	        xhr.withCredentials = true
	      }

	      if ('responseType' in xhr && support.blob) {
	        xhr.responseType = 'blob'
	      }

	      request.headers.forEach(function(value, name) {
	        xhr.setRequestHeader(name, value)
	      })

	      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
	    })
	  }
	  self.fetch.polyfill = true
	})(typeof self !== 'undefined' ? self : this);


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _ModelBuilder = __webpack_require__(4);

	var _ModelBuilder2 = _interopRequireDefault(_ModelBuilder);

	var _ModelRenderer = __webpack_require__(13);

	var _ModelRenderer2 = _interopRequireDefault(_ModelRenderer);

	var _Layout = __webpack_require__(17);

	var _Layout2 = _interopRequireDefault(_Layout);

	var _Submit = __webpack_require__(18);

	var _Submit2 = _interopRequireDefault(_Submit);

	var _Observable2 = __webpack_require__(6);

	var _Observable3 = _interopRequireDefault(_Observable2);

	var _ModelStructureParser = __webpack_require__(19);

	var _ModelStructureParser2 = _interopRequireDefault(_ModelStructureParser);

	var _ValuesParser = __webpack_require__(20);

	var _ValuesParser2 = _interopRequireDefault(_ValuesParser);

	var _LocalizationParser = __webpack_require__(21);

	var _LocalizationParser2 = _interopRequireDefault(_LocalizationParser);

	var _ModelActions = __webpack_require__(16);

	var ModelActions = _interopRequireWildcard(_ModelActions);

	var _NutformsActions = __webpack_require__(24);

	var NutformsActions = _interopRequireWildcard(_NutformsActions);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Nutforms = function (_Observable) {
	    _inherits(Nutforms, _Observable);

	    /**
	     * Facade for Nutforms form generation subsystem.
	     */

	    function Nutforms() {
	        _classCallCheck(this, Nutforms);

	        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Nutforms).call(this));

	        _this.aspectsSource = null;
	        return _this;
	    }

	    /**
	     * Sets AspectsSource implementation to the library.
	     * @param source
	     */


	    _createClass(Nutforms, [{
	        key: 'setAspectsSource',
	        value: function setAspectsSource(source) {
	            this.aspectsSource = source;
	        }

	        /**
	         * Dynamically generates the form, weaves all the aspects in and binds it to the given HTML Element.
	         *
	         * @param {HTMLElement} htmlElement     Element to bind the form to.
	         * @param {string} entityName           Unique name of the entity.
	         * @param {string} locale               Unique name of the locale.
	         * @param {number} entityId             ID of the entity.
	         * @param {string} layout               Unique name of the layout.
	         * @param {function} widgetMapping      Widget mapping function.
	         * @param {string} context              Unique name of the business operation.
	         */

	    }, {
	        key: 'generateForm',
	        value: function generateForm(htmlElement, entityName, locale, entityId, layout, widgetMapping, context) {
	            var _this2 = this;

	            Promise.all([this.aspectsSource.fetchStructureMetadata(entityName), this.aspectsSource.fetchLocalizationData(entityName, locale, context), this.aspectsSource.fetchValues(entityName, entityId), this.aspectsSource.fetchLayout(layout)]).then(function (values) {
	                _this2.trigger(NutformsActions.ASPECTS_FETCHED, values);
	                var model = _this2.buildModel.apply(_this2, _toConsumableArray(values).concat([entityName, locale, widgetMapping, context]));
	                model.listen(ModelActions.SUBMITTED, function (model, values) {
	                    _this2.trigger(NutformsActions.FORM_SUBMITTED, model, values);
	                });
	                _this2.trigger(NutformsActions.MODEL_BUILT, model);
	                model.renderer.render(htmlElement);
	                _this2.trigger(NutformsActions.FORM_RENDERED, model, htmlElement);
	                console.log("Nutforms: form generated successfully!");
	            });
	        }

	        /**
	         * Builds the Rich Model from context parameters and aspects definitions.
	         *
	         * @param {*} structureMetadata
	         * @param {*} localizationData
	         * @param {*} values
	         * @param {string} layout
	         * @param {string} entityName
	         * @param {string} locale
	         * @param {function} widgetMapping
	         * @param {string} context
	         * @returns {Model}
	         */

	    }, {
	        key: 'buildModel',
	        value: function buildModel(structureMetadata, localizationData, values, layout, entityName, locale, widgetMapping, context) {
	            // Preps the parsers
	            var structureParser = new _ModelStructureParser2.default();
	            var valuesParser = new _ValuesParser2.default();
	            var localizationParser = new _LocalizationParser2.default();

	            // Creates builder and sets context parameters
	            var builder = new _ModelBuilder2.default().setEntityName(entityName).setLocale(locale).addRenderer(new _ModelRenderer2.default()).addLayout(new _Layout2.default(layout)).addSubmit(new _Submit2.default()).addAspectsSource(this.aspectsSource).setWidgetMapping(widgetMapping).setContext(context);

	            // Calls the aspect DSLs parsers, who call appropriate functions on ModelBuilder
	            structureParser.parse(structureMetadata, builder);
	            valuesParser.parse(values, builder);
	            localizationParser.parse(localizationData, builder);

	            return builder.build();
	        }
	    }]);

	    return Nutforms;
	}(_Observable3.default);

	exports.default = Nutforms;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Model = __webpack_require__(5);

	var _Model2 = _interopRequireDefault(_Model);

	var _AttributeBuilder = __webpack_require__(7);

	var _AttributeBuilder2 = _interopRequireDefault(_AttributeBuilder);

	var _RelationBuilder = __webpack_require__(11);

	var _RelationBuilder2 = _interopRequireDefault(_RelationBuilder);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var ModelBuilder = function () {

	    /**
	     * Contains logic for building Model instance.
	     */

	    function ModelBuilder() {
	        _classCallCheck(this, ModelBuilder);

	        this.entityName = null;
	        this.locale = null;
	        this.attributeBuilders = {};
	        this.relationBuilders = {};
	        this.localization = null;
	        this.renderer = null;
	        this.layout = null;
	        this.submit = null;
	        this.aspectsSource = null;
	        this.widgetMapping = null;
	        this.context = null;
	    }

	    /**
	     * Sets name of the represented entity.
	     * @param {string} entityName Identifier of the entity.
	     * @returns {ModelBuilder}
	     */


	    _createClass(ModelBuilder, [{
	        key: 'setEntityName',
	        value: function setEntityName(entityName) {
	            this.entityName = entityName;
	            return this;
	        }

	        /**
	         * Sets name of the locale.
	         * @param {string} locale Identifier of the locale.
	         * @returns {ModelBuilder}
	         */

	    }, {
	        key: 'setLocale',
	        value: function setLocale(locale) {
	            this.locale = locale;
	            return this;
	        }

	        /**
	         * Returns AttributeBuilder for Attribute with given name.
	         * If there isn't one yet, builds a new one.
	         * @param {string} name Name of the Attribute.
	         * @returns {AttributeBuilder}
	         */

	    }, {
	        key: 'getAttributeBuilder',
	        value: function getAttributeBuilder(name) {
	            if (!this.attributeBuilders.hasOwnProperty(name)) {
	                this.attributeBuilders[name] = new _AttributeBuilder2.default();
	            }
	            return this.attributeBuilders[name];
	        }

	        /**
	         * Finds out whether AttributeBuilder for Attribute with given name has already been created.
	         * Returns true if it was, false if not.
	         * @param {string} name Name of the Attribute.
	         * @returns {boolean}
	         */

	    }, {
	        key: 'hasAttributeBuilder',
	        value: function hasAttributeBuilder(name) {
	            return this.attributeBuilders.hasOwnProperty(name);
	        }

	        /**
	         * Returns RelationBuilder for Relation with given name.
	         * If there isn't one yet, builds a new one.
	         * @param {string} name Name of the Relation.
	         * @returns {RelationBuilder}
	         */

	    }, {
	        key: 'getRelationBuilder',
	        value: function getRelationBuilder(name) {
	            if (!this.relationBuilders.hasOwnProperty(name)) {
	                this.relationBuilders[name] = new _RelationBuilder2.default();
	            }
	            return this.relationBuilders[name];
	        }

	        /**
	         * Finds out whether RelationBuilder for Relation with given name has already been created.
	         * Returns true if it was, false if not.
	         * @param {string} name Name of the Relation.
	         * @returns {boolean}
	         */

	    }, {
	        key: 'hasRelationBuilder',
	        value: function hasRelationBuilder(name) {
	            return this.relationBuilders.hasOwnProperty(name);
	        }

	        /**
	         * Adds ModelLocalization.
	         * @param {ModelLocalization} localization The ModelLocalization to add.
	         * @returns {ModelBuilder}
	         */

	    }, {
	        key: 'addLocalization',
	        value: function addLocalization(localization) {
	            this.localization = localization;
	            return this;
	        }

	        /**
	         * Adds ModelRenderer.
	         * @param {ModelRenderer} renderer The ModelRenderer to add.
	         * @returns {ModelBuilder}
	         */

	    }, {
	        key: 'addRenderer',
	        value: function addRenderer(renderer) {
	            this.renderer = renderer;
	            return this;
	        }

	        /**
	         * Adds Layout.
	         * @param {Layout} layout The Layout to add.
	         * @returns {ModelBuilder}
	         */

	    }, {
	        key: 'addLayout',
	        value: function addLayout(layout) {
	            this.layout = layout;
	            return this;
	        }

	        /**
	         * Adds Submit.
	         * @param {Submit} submit The Submit to add.
	         * @returns {ModelBuilder}
	         */

	    }, {
	        key: 'addSubmit',
	        value: function addSubmit(submit) {
	            this.submit = submit;
	            return this;
	        }

	        /**
	         * Adds AspectsSource.
	         * @param {object} aspectsSource The AspectsSource to add.
	         * @returns {ModelBuilder}
	         */

	    }, {
	        key: 'addAspectsSource',
	        value: function addAspectsSource(aspectsSource) {
	            this.aspectsSource = aspectsSource;
	            return this;
	        }

	        /**
	         * Sets widget mapping function.
	         * @param {function} widgetMapping The function to add.
	         * @returns {ModelBuilder}
	         */

	    }, {
	        key: 'setWidgetMapping',
	        value: function setWidgetMapping(widgetMapping) {
	            this.widgetMapping = widgetMapping;
	            return this;
	        }

	        /**
	         * Sets name of the business operation.
	         * @param {string} context Name of the business operation.
	         * @returns {ModelBuilder}
	         */

	    }, {
	        key: 'setContext',
	        value: function setContext(context) {
	            this.context = context;
	            return this;
	        }

	        /**
	         * Builds the Model instance with all parameters and returns it.
	         * @returns {Model}
	         */

	    }, {
	        key: 'build',
	        value: function build() {
	            return new _Model2.default(this.entityName, this.locale, this.buildAttributes(), this.buildRelations(), this.localization, this.renderer, this.layout, this.submit, this.aspectsSource, this.widgetMapping, this.context);
	        }

	        /**
	         * Builds all Attributes by calling the AttributeBuilders.
	         * @returns {Object}
	         * @private
	         */

	    }, {
	        key: 'buildAttributes',
	        value: function buildAttributes() {
	            var _this = this;

	            var attributes = {};
	            Object.keys(this.attributeBuilders).forEach(function (key) {
	                var attributeBuilder = _this.attributeBuilders[key];
	                attributes[key] = attributeBuilder.build();
	            });
	            return attributes;
	        }

	        /**
	         * Builds all Model's Relations by calling the RelationBuilders.
	         * @returns {Object}
	         * @private
	         */

	    }, {
	        key: 'buildRelations',
	        value: function buildRelations() {
	            var _this2 = this;

	            var relations = {};
	            Object.keys(this.relationBuilders).forEach(function (key) {
	                var relationBuilder = _this2.relationBuilders[key];
	                relations[key] = relationBuilder.build();
	            });
	            return relations;
	        }
	    }]);

	    return ModelBuilder;
	}();

	exports.default = ModelBuilder;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _Observable2 = __webpack_require__(6);

	var _Observable3 = _interopRequireDefault(_Observable2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Model = function (_Observable) {
	    _inherits(Model, _Observable);

	    /**
	     * Represents a Model and holds all its components and contextual parameters.
	     * @param {string} entityName               Name of the represented entity.
	     * @param {string} locale                   Identifier of the locale.
	     * @param {object} attributes               Map of Model's Attributes.
	     * @param {object} relations                Map of Model's Relations.
	     * @param {ModelLocalization} localization  Localization of the Model.
	     * @param {ModelRenderer} renderer          Renderer of the Model.
	     * @param {Layout} layout                   Layout of the Model.
	     * @param {Submit} submit                   Submit of the Model.
	     * @param {object} aspectsSource            AspectsResource instance.
	     * @param {function} widgetMapping          Widget mapping function.
	     * @param {string} context                  Business operation identifier.
	     */

	    function Model(entityName, locale, attributes, relations, localization, renderer, layout, submit, aspectsSource, widgetMapping, context) {
	        _classCallCheck(this, Model);

	        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Model).call(this));

	        _this.entityName = entityName;
	        _this.locale = locale;
	        _this.attributes = attributes;
	        _this.relations = relations;
	        _this.localization = localization ? localization.bind(_this) : localization;
	        _this.renderer = renderer ? renderer.bind(_this) : renderer;
	        _this.layout = layout ? layout.bind(_this) : layout;
	        _this.submit = submit ? submit.bind(_this) : submit;
	        _this.aspectsSource = aspectsSource;
	        _this.widgetMapping = widgetMapping;
	        _this.context = context;

	        Object.keys(attributes).forEach(function (key) {
	            _this.attributes[key].bind(_this);
	        });
	        Object.keys(relations).forEach(function (key) {
	            _this.relations[key].bind(_this);
	        });
	        return _this;
	    }

	    return Model;
	}(_Observable3.default);

	exports.default = Model;

/***/ },
/* 6 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Observable = function () {

	    /**
	     * Observable object.
	     * Listeners can subscribe to this object and
	     * receive event notifications.
	     * @abstract
	     */

	    function Observable() {
	        _classCallCheck(this, Observable);

	        this._observers = {
	            "all": []
	        };
	    }

	    /**
	     * Subscribes an observer object or function to an event of the Observable.
	     * @param {string} event
	     * @param {function|object} observer
	     */


	    _createClass(Observable, [{
	        key: "listen",
	        value: function listen(event, observer) {
	            if (!this._observers.hasOwnProperty(event)) {
	                this._observers[event] = [];
	            }
	            this._observers[event].push(observer);
	        }

	        /**
	         * Unsubscribes an observer object or function from an event of the Observable.
	         * @param {string} event
	         * @param {function|object} observer
	         */

	    }, {
	        key: "unsubscribe",
	        value: function unsubscribe(event, observer) {
	            if (!this._observers.hasOwnProperty(event)) {
	                return;
	            }
	            this._observers[event] = this._observers[event].filter(function (i) {
	                return i !== observer;
	            });
	        }

	        /**
	         * Triggers an event with given name and with given parameters on the Observable.
	         * @param {string} event
	         * @param {...*} argument
	         */

	    }, {
	        key: "trigger",
	        value: function trigger(event, argument) {
	            var args = Array.prototype.slice.call(arguments, 1);
	            if (event !== "all" && this._observers.hasOwnProperty(event)) {
	                this._invokeObservers(event, args);
	            }
	            args.unshift(event);
	            this._invokeObservers("all", args);
	        }

	        /**
	         * Invokes all observers subscribed to given event name.
	         * @param {string} eventName
	         * @param {Array} args
	         * @private
	         */

	    }, {
	        key: "_invokeObservers",
	        value: function _invokeObservers(eventName, args) {
	            this._observers[eventName].forEach(function (observer) {
	                if ((typeof observer === "undefined" ? "undefined" : _typeof(observer)) === 'object') {
	                    observer.update.apply(observer, [eventName].concat(_toConsumableArray(args)));
	                } else {
	                    observer.apply(observer, args);
	                }
	            });
	        }
	    }]);

	    return Observable;
	}();

	exports.default = Observable;
	;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Attribute = __webpack_require__(8);

	var _Attribute2 = _interopRequireDefault(_Attribute);

	var _AttributeRenderer = __webpack_require__(10);

	var _AttributeRenderer2 = _interopRequireDefault(_AttributeRenderer);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var AttributeBuilder = function () {

	    /**
	     * Contains logic for building Attribute instance.
	     */

	    function AttributeBuilder() {
	        _classCallCheck(this, AttributeBuilder);

	        this.name = null;
	        this.type = null;
	        this.value = null;
	        this.primary = false;
	        this.localization = null;
	    }

	    /**
	     * Sets name of the Attribute.
	     * @param {string} name  Name of the Attribute.
	     * @returns {AttributeBuilder}
	     */


	    _createClass(AttributeBuilder, [{
	        key: 'setName',
	        value: function setName(name) {
	            this.name = name;
	            return this;
	        }

	        /**
	         * Sets type of the Attribute.
	         * @param {string} type  Type of the Attribute.
	         * @returns {AttributeBuilder}
	         */

	    }, {
	        key: 'setType',
	        value: function setType(type) {
	            this.type = type;
	            return this;
	        }

	        /**
	         * Sets value of the Attribute.
	         * @param {*} value Value of the Attribute.
	         * @returns {AttributeBuilder}
	         */

	    }, {
	        key: 'setValue',
	        value: function setValue(value) {
	            this.value = value;
	            return this;
	        }

	        /**
	         * Sets primary flag of the Attribute.
	         * @param {boolean} primary The primary flag.
	         * @returns {AttributeBuilder}
	         */

	    }, {
	        key: 'setPrimary',
	        value: function setPrimary(primary) {
	            this.primary = primary;
	            return this;
	        }

	        /**
	         * Adds AttributeRenderer to the Attribute.
	         * @param {AttributeRenderer} renderer The renderer.
	         * @returns {AttributeBuilder}
	         */

	    }, {
	        key: 'addRenderer',
	        value: function addRenderer(renderer) {
	            this.renderer = renderer;
	            return this;
	        }

	        /**
	         * Adds AttributeLocalization to the Attribute.
	         * @param {AttributeLocalization} localization The localization.
	         * @returns {AttributeBuilder}
	         */

	    }, {
	        key: 'addLocalization',
	        value: function addLocalization(localization) {
	            this.localization = localization;
	            return this;
	        }

	        /**
	         * Builds and returns the Attribute.
	         * @returns {Attribute}
	         */

	    }, {
	        key: 'build',
	        value: function build() {
	            return new _Attribute2.default(this.name, this.type, this.value, this.primary, this.localization, this.renderer ? this.renderer : new _AttributeRenderer2.default() // TODO: remove wired instantiation
	            );
	        }
	    }]);

	    return AttributeBuilder;
	}();

	exports.default = AttributeBuilder;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Observable2 = __webpack_require__(6);

	var _Observable3 = _interopRequireDefault(_Observable2);

	var _AttributeActions = __webpack_require__(9);

	var AttributeActions = _interopRequireWildcard(_AttributeActions);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Attribute = function (_Observable) {
	    _inherits(Attribute, _Observable);

	    /**
	     * Represents Attribute of Nutforms Rich Model.
	     * @param {string} name                         Unique name of the Attribute. Also servers as identifier.
	     * @param {string} type                         Type of the Attribute.
	     * @param {*} value                             Value of the Attribute. Can be null.
	     * @param {boolean} primary                     Is this the primary Attribute of the Model?
	     * @param {AttributeLocalization} localization  Localization of the Attribute.
	     * @param {AttributeRenderer} renderer          Renderer of the Attribute.
	     */

	    function Attribute(name, type, value, primary, localization, renderer) {
	        _classCallCheck(this, Attribute);

	        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Attribute).call(this));

	        _this.name = name;
	        _this.type = type;
	        _this.value = value;
	        _this.primary = primary;
	        _this.localization = localization ? localization.bind(_this) : null;
	        _this.renderer = renderer ? renderer.bind(_this) : null;
	        _this.model = null;
	        return _this;
	    }

	    /**
	     * Binds to the given Model instance.
	     * @param {Model} model The instance of Model to bind to.
	     * @returns {Attribute}
	     */


	    _createClass(Attribute, [{
	        key: 'bind',
	        value: function bind(model) {
	            this.model = model;
	            return this;
	        }

	        /**
	         * Sets value to given value and triggers FIELD_CHANGED event.
	         * @param {*} value The value.
	         */

	    }, {
	        key: 'setValue',
	        value: function setValue(value) {
	            this.value = value;
	            this.trigger(AttributeActions.VALUE_CHANGED, this);
	        }
	    }]);

	    return Attribute;
	}(_Observable3.default);

	exports.default = Attribute;

/***/ },
/* 9 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var VALUE_CHANGED = exports.VALUE_CHANGED = 'value-changed';

/***/ },
/* 10 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var AttributeRenderer = function () {

	    /**
	     * Renderer for Attribute of Rich Model.
	     */

	    function AttributeRenderer() {
	        _classCallCheck(this, AttributeRenderer);

	        this.attribute = null;
	    }

	    /**
	     * Binds to Attribute instance.
	     * @param {Attribute} attribute The Attribute to bind to.
	     * @returns {AttributeRenderer}
	     */


	    _createClass(AttributeRenderer, [{
	        key: 'bind',
	        value: function bind(attribute) {
	            this.attribute = attribute;
	            return this;
	        }

	        /**
	         * Renders the Attribute widget and appends it to HTMLElement.
	         * <p>
	         * First, the widget is determined by widget mapping function.
	         * Then, the values are injected to the widget.
	         * Finally, the attribute is bound to the HTMLElement.
	         * </p>
	         * @param {HTMLElement} htmlElement The HTMLElement to bind the field to.
	         */

	    }, {
	        key: 'render',
	        value: function render(htmlElement) {
	            htmlElement.innerHTML = this.injectWidgetValues(this.attribute.model.aspectsSource.fetchWidget(this.getWidgetName()));
	        }

	        /**
	         * Determines widget name.
	         * @returns {string}
	         * @private
	         */

	    }, {
	        key: 'getWidgetName',
	        value: function getWidgetName() {
	            return this.attribute.model.widgetMapping(this.attribute.model.entityName, this.attribute.model.context, this.attribute.name, this.attribute.type, this.attribute.primary);
	        }

	        /**
	         * Injects attribute values by replacing the widget meta instructions.
	         * @param {string} widgetString The widget DSL.
	         * @returns {string}
	         * @private
	         */

	    }, {
	        key: 'injectWidgetValues',
	        value: function injectWidgetValues(widgetString) {
	            widgetString = widgetString.replace(new RegExp('{attribute.name}', 'g'), this.attribute.name);
	            widgetString = widgetString.replace(new RegExp('{attribute.formLabel}', 'g'), this.attribute.localization.label);
	            widgetString = widgetString.replace(new RegExp('{attribute.value}', 'g'), this.attribute.value);
	            return widgetString;
	        }
	    }]);

	    return AttributeRenderer;
	}();

	exports.default = AttributeRenderer;

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Relation = __webpack_require__(12);

	var _Relation2 = _interopRequireDefault(_Relation);

	var _AttributeBuilder2 = __webpack_require__(7);

	var _AttributeBuilder3 = _interopRequireDefault(_AttributeBuilder2);

	var _AttributeRenderer = __webpack_require__(10);

	var _AttributeRenderer2 = _interopRequireDefault(_AttributeRenderer);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var RelationBuilder = function (_AttributeBuilder) {
	    _inherits(RelationBuilder, _AttributeBuilder);

	    /**
	     * Contains logic for building Relation instance.
	     */

	    function RelationBuilder() {
	        _classCallCheck(this, RelationBuilder);

	        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(RelationBuilder).call(this));

	        _this.targetEntity = null;
	        return _this;
	    }

	    /**
	     * Sets Relation's target entity name.
	     * @param {string} targetEntity Identifier of the target entity.
	     * @returns {RelationBuilder}
	     */


	    _createClass(RelationBuilder, [{
	        key: 'setTargetEntity',
	        value: function setTargetEntity(targetEntity) {
	            this.targetEntity = targetEntity;
	            return this;
	        }

	        /**
	         * Builds and returns the Relation.
	         * @returns {Relation}
	         */

	    }, {
	        key: 'build',
	        value: function build() {
	            return new _Relation2.default(this.name, this.type, this.value, this.primary, this.localization, this.renderer ? this.renderer : new _AttributeRenderer2.default(), // TODO: remove wired dependency
	            this.targetEntity);
	        }
	    }]);

	    return RelationBuilder;
	}(_AttributeBuilder3.default);

	exports.default = RelationBuilder;

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _Attribute2 = __webpack_require__(8);

	var _Attribute3 = _interopRequireDefault(_Attribute2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Relation = function (_Attribute) {
	    _inherits(Relation, _Attribute);

	    /**
	     * Represents Relation of Model.
	     * @param {string} name                         Name of the Relation.
	     * @param {string} type                         Type of the Relation.
	     * @param {*} value                             Value of the Relation, can be null.
	     * @param {boolean} primary                     Is this the primary Relation in the model?
	     * @param {AttributeLocalization} localization  Localization of the Relation.
	     * @param {string} targetEntity                 Name of relation's target entity.
	     */

	    function Relation(name, type, value, primary, localization, relation, targetEntity) {
	        _classCallCheck(this, Relation);

	        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Relation).call(this, name, type, value, primary, localization, relation));

	        _this.targetEntity = targetEntity;
	        return _this;
	    }

	    return Relation;
	}(_Attribute3.default);

	exports.default = Relation;

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _AttributeIterator = __webpack_require__(14);

	var _AttributeIterator2 = _interopRequireDefault(_AttributeIterator);

	var _DOMHelper = __webpack_require__(15);

	var _DOMHelper2 = _interopRequireDefault(_DOMHelper);

	var _ModelActions = __webpack_require__(16);

	var ModelActions = _interopRequireWildcard(_ModelActions);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var ModelRenderer = function () {

	    /**
	     * Renderer for Model.
	     */

	    function ModelRenderer() {
	        _classCallCheck(this, ModelRenderer);

	        this.model = null;
	    }

	    /**
	     * Bins to Model instance.
	     * @param {Model} model The Model to bind to.
	     * @returns {ModelRenderer}
	     */


	    _createClass(ModelRenderer, [{
	        key: 'bind',
	        value: function bind(model) {
	            this.model = model;
	            return this;
	        }

	        /**
	         * @param {HTMLElement} htmlElement
	         */

	    }, {
	        key: 'render',
	        value: function render(htmlElement) {
	            var _this = this;

	            var parser = new DOMParser();
	            var layoutDOM = parser.parseFromString(this.model.layout.layoutString, "text/html");
	            var attributeIterator = new _AttributeIterator2.default(this.model);

	            // Add form label
	            _DOMHelper2.default.findElementsWithAttribute(layoutDOM, "nf-form-label").forEach(function (formLabel) {
	                formLabel.innerHTML = _this.model.localization.formLabel;
	            });

	            // Add explicit first
	            _DOMHelper2.default.findElementsWithAttribute(layoutDOM, "nf-field-widget").forEach(function (field) {
	                var attributeName = field.getAttribute("nf-field-widget");
	                var attribute = attributeIterator.getByName(attributeName);
	                if (attribute) {
	                    attribute.renderer.render(field);
	                }
	            });

	            // Add implicit
	            while (attributeIterator.hasNext()) {
	                var attribute = attributeIterator.getNext();
	                var element = document.createElement("div");
	                attribute.renderer.render(element);
	                var forms = layoutDOM.getElementsByTagName("form");
	                for (var i = 0; i < forms.length; i++) {
	                    forms[i].appendChild(element);
	                }
	            }

	            // Add form submit
	            // TODO: load users definition?
	            var submit = "<div class=\"form-group\"><input type=\"submit\" class=\"btn btn-default\" nf-submit=\"submit\" value=\"" + this.model.localization.submitLabel + "\" /></div>";

	            htmlElement.innerHTML = new XMLSerializer().serializeToString(layoutDOM) + submit;
	            this.bindListeners(htmlElement);
	        }

	        /**
	         * Binds listeners to the generated form.
	         * @param {HTMLElement} htmlElement The HTML element containing the form.
	         */

	    }, {
	        key: 'bindListeners',
	        value: function bindListeners(htmlElement) {
	            var _this2 = this;

	            var values = _DOMHelper2.default.findElementsWithAttribute(htmlElement, "nf-field-widget-value");

	            var _loop = function _loop() {
	                var value = values[k];
	                var attributeName = value.getAttribute("nf-field-widget-value");
	                var attribute = _this2.model.attributes[attributeName];

	                // Adding event listeners to attributes
	                value.addEventListener("keyup", function () {
	                    console.log("keyup", value);
	                    attribute.setValue(value.value);
	                }, false);
	                value.addEventListener("change", function () {
	                    console.log("change", value);
	                    attribute.setValue(value.value);
	                }, false);
	                value.addEventListener("blur", function () {
	                    console.log("blur", value);
	                    attribute.setValue(value.value);
	                }, false);

	                // Set unique id
	                value.setAttribute("id", _this2.model.entityName + "[" + attributeName + "]");
	            };

	            for (var k = 0, o = values.length; k < o; k++) {
	                _loop();
	            }

	            var submits = _DOMHelper2.default.findElementsWithAttribute(htmlElement, "nf-submit");
	            var model = this.model;
	            if (submits.length > 0) {
	                var submit = submits.shift(); // TODO: Improvement: what about other submits?
	                submit.addEventListener("click", function (e) {
	                    e.preventDefault();

	                    // Transform values from form into simple object
	                    var valuesObject = {};
	                    for (var k = 0, o = values.length; k < o; k++) {
	                        var _value = values[k];
	                        var attributeName = _value.getAttribute("nf-field-widget-value");
	                        valuesObject[attributeName] = _value.value;
	                    }

	                    model.submit.submit(values);

	                    _this2.model.trigger(ModelActions.SUBMITTED, model, valuesObject);
	                });
	            }
	        }
	    }]);

	    return ModelRenderer;
	}();

	exports.default = ModelRenderer;

/***/ },
/* 14 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var AttributeIterator = function () {

	    /**
	     * Iterates through Model's Attributes.
	     * @param {Model} model The Model instance.
	     */

	    function AttributeIterator(model) {
	        var _this = this;

	        _classCallCheck(this, AttributeIterator);

	        this.attributes = [];
	        this.relations = [];
	        Object.keys(model.attributes).forEach(function (key) {
	            _this.attributes.push(model.attributes[key]);
	        });
	        Object.keys(model.relations).forEach(function (key) {
	            _this.relations.push(model.relations[key]);
	        });
	    }

	    /**
	     * Finds out whether there is another Attribute in the iterator.
	     * @returns {boolean} True if there is next Attribute in the iterator, false if not.
	     */


	    _createClass(AttributeIterator, [{
	        key: "hasNext",
	        value: function hasNext() {
	            return this.attributes.length + this.attributes.length > 0;
	        }

	        /**
	         * Returns next Attribute and removes it from the Iterator.
	         * @returns {Attribute|null} The Attribute or null if there is none left.
	         */

	    }, {
	        key: "getNext",
	        value: function getNext() {
	            if (this.attributes.length > 0) {
	                return this.attributes.shift();
	            } else if (this.relations.length > 0) {
	                return this.relations.shift();
	            } else {
	                return null;
	            }
	        }

	        /**
	         * Returns Attribute with given name and removes it from the Iterator.
	         * @param {string} name The name of the Attribute.
	         * @returns {Attribute}
	         */

	    }, {
	        key: "getByName",
	        value: function getByName(name) {
	            var result = null;
	            for (var i = 0; i < this.attributes.length; ++i) {
	                if (this.attributes[i].name === name) {
	                    result = this.attributes[i];
	                    this.attributes = this.removeFromArray(this.attributes, result);
	                    break;
	                }
	            }
	            for (var _i = 0; _i < this.attributes.length && result == null; ++_i) {
	                if (this.relations[_i].name === name) {
	                    result = this.relations[_i];
	                    this.relations = this.removeFromArray(this.relations, result);
	                    break;
	                }
	            }
	            return result;
	        }

	        /**
	         * Removes item by its value from array.
	         * @param {array} array The array
	         * @returns {array}
	         */

	    }, {
	        key: "removeFromArray",
	        value: function removeFromArray(array) {
	            var what = void 0,
	                args = arguments,
	                length = args.length,
	                auxillary = void 0;
	            while (length > 1 && array.length) {
	                what = args[--length];
	                while ((auxillary = array.indexOf(what)) !== -1) {
	                    array.splice(auxillary, 1);
	                }
	            }
	            return array;
	        }
	    }]);

	    return AttributeIterator;
	}();

	exports.default = AttributeIterator;

/***/ },
/* 15 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var DOMHelper = function () {
	    function DOMHelper() {
	        _classCallCheck(this, DOMHelper);
	    }

	    _createClass(DOMHelper, null, [{
	        key: 'findElementsWithAttribute',


	        /**
	         * Finds all elements in the document which have attribute with given name.
	         *
	         * @param {Element|HTMLDocument} doc
	         * @param {string} attribute
	         * @returns {Array}
	         */
	        value: function findElementsWithAttribute(doc, attribute) {
	            var matchingElements = [];
	            var allElements = doc.getElementsByTagName('*');
	            for (var i = 0, n = allElements.length; i < n; i++) {
	                if (allElements[i].getAttribute(attribute) !== null) {
	                    matchingElements.push(allElements[i]);
	                }
	            }
	            return matchingElements;
	        }
	    }]);

	    return DOMHelper;
	}();

	exports.default = DOMHelper;

/***/ },
/* 16 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var SUBMITTED = exports.SUBMITTED = 'submitted';

/***/ },
/* 17 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Layout = function () {

	    /**
	     * Contains Layout aspect data for Model.
	     * @param {string} layoutString
	     */

	    function Layout(layoutString) {
	        _classCallCheck(this, Layout);

	        this.layoutString = layoutString;
	        this.model = null;
	    }

	    /**
	     * Binds to Model instance.
	     * @param {Model} model The Model to bind to.
	     * @returns {Layout}
	     */


	    _createClass(Layout, [{
	        key: "bind",
	        value: function bind(model) {
	            this.model = model;
	            return this;
	        }
	    }]);

	    return Layout;
	}();

	exports.default = Layout;

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _ModelActions = __webpack_require__(16);

	var ModelActions = _interopRequireWildcard(_ModelActions);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Submit = function () {

	    /**
	     * Contains handlers for form submission.
	     */

	    function Submit() {
	        _classCallCheck(this, Submit);

	        this.model = null;
	    }

	    /**
	     * Binds to Model instance.
	     * @param {Model} model The Model to bind to.
	     * @returns {Submit}
	     */


	    _createClass(Submit, [{
	        key: 'bind',
	        value: function bind(model) {
	            this.model = model;
	            return this;
	        }

	        /**
	         * Updates values of the model by settings values for each attribute.
	         * @param {object} values Object with Attribute names as keys and Attribute values as values.
	         * @throws Will throw an error if Attribute with given name does not exist.
	         */

	    }, {
	        key: 'submit',
	        value: function submit(values) {
	            var _this = this;

	            Object.keys(values).forEach(function (key) {
	                if (_this.model.attributes.hasOwnProperty(key)) {
	                    _this.model.attributes[key].setValue(values[key]);
	                } else if (_this.model.relations.hasOwnProperty(key)) {
	                    _this.model.relations[key].setValue(values[key]);
	                }
	            });
	            this.model.trigger(ModelActions.SUBMITTED, this);
	        }
	    }]);

	    return Submit;
	}();

	exports.default = Submit;

/***/ },
/* 19 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var ModelStructureParser = function () {

	    /**
	     * Model structure aspect parser.
	     */

	    function ModelStructureParser() {
	        _classCallCheck(this, ModelStructureParser);
	    }

	    /**
	     * Parses model structure metadata and calls appropriate methods on ModelBuilder.
	     * @param {string} metadata             Model structure metadata.
	     * @param {ModelBuilder} modelBuilder   ModelBuilder instance.
	     */


	    _createClass(ModelStructureParser, [{
	        key: "parse",
	        value: function parse(metadata, modelBuilder) {
	            if (metadata.hasOwnProperty("attributes")) {
	                metadata.attributes.forEach(function (attribute) {
	                    var attributeBuilder = modelBuilder.getAttributeBuilder(attribute.name);
	                    attributeBuilder.setName(attribute.name).setType(attribute.type).setPrimary(attribute.is_primary);
	                });
	            }
	            if (metadata.hasOwnProperty("relationships")) {
	                metadata.relationships.forEach(function (relation) {
	                    var attributeBuilder = modelBuilder.getRelationBuilder(relation.name);
	                    attributeBuilder.setName(relation.name).setType(relation.type).setTargetEntity(relation.target_entity);
	                });
	            }
	        }
	    }]);

	    return ModelStructureParser;
	}();

	exports.default = ModelStructureParser;

/***/ },
/* 20 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var ValuesParser = function () {

	    /**
	     * Model values parser.
	     */

	    function ValuesParser() {
	        _classCallCheck(this, ValuesParser);
	    }

	    /**
	     * Parses model values and calls appropriate methods on ModelBuilder.
	     * @param {object} values               Values of the model.
	     * @param {ModelBuilder} modelBuilder   ModelBuilder instance.
	     */


	    _createClass(ValuesParser, [{
	        key: "parse",
	        value: function parse(values, modelBuilder) {
	            Object.keys(values).forEach(function (key) {
	                if (modelBuilder.hasAttributeBuilder(key)) {
	                    modelBuilder.getAttributeBuilder(key).setValue(values[key]);
	                } else if (modelBuilder.hasRelationBuilder(key)) {
	                    modelBuilder.getRelationBuilder(key).setValue(values[key]);
	                }
	            });
	        }
	    }]);

	    return ValuesParser;
	}();

	exports.default = ValuesParser;

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _ModelLocalization = __webpack_require__(22);

	var _ModelLocalization2 = _interopRequireDefault(_ModelLocalization);

	var _AttributeLocalization = __webpack_require__(23);

	var _AttributeLocalization2 = _interopRequireDefault(_AttributeLocalization);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var LocalizationParser = function () {

	    /**
	     * Localization aspect parser.
	     */

	    function LocalizationParser() {
	        _classCallCheck(this, LocalizationParser);
	    }

	    /**
	     * Parses localization aspect data and calls appropriate methods on ModelBuilder.
	     * @param {string} localizationData     Localization aspect data.
	     * @param {ModelBuilder} modelBuilder   ModelBuilder instance.
	     */


	    _createClass(LocalizationParser, [{
	        key: 'parse',
	        value: function parse(localizationData, modelBuilder) {
	            modelBuilder.addLocalization(new _ModelLocalization2.default(localizationData["form.label"], localizationData["form.submit.value"]));

	            Object.keys(modelBuilder.attributeBuilders).forEach(function (key) {
	                modelBuilder.getAttributeBuilder(key).addLocalization(new _AttributeLocalization2.default(localizationData['form.' + key + '.label'], null // TODO: placeholder?
	                ));
	            });

	            Object.keys(modelBuilder.relationBuilders).forEach(function (key) {
	                modelBuilder.getRelationBuilder(key).addLocalization(new _AttributeLocalization2.default(localizationData['form.' + key + '.label'], null // TODO: placeholder?
	                ));
	            });
	        }
	    }]);

	    return LocalizationParser;
	}();

	exports.default = LocalizationParser;

/***/ },
/* 22 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var ModelLocalization = function () {

	    /**
	     * Holds localization aspect data for Model.
	     * @param {string} formLabel        Label of the form.
	     * @param {string} submitLabel      Label of form's submit button.
	     */

	    function ModelLocalization(formLabel, submitLabel) {
	        _classCallCheck(this, ModelLocalization);

	        this.formLabel = formLabel;
	        this.submitLabel = submitLabel;
	    }

	    /**
	     * Binds to Model instance.
	     * @param {Model} model The Model to bind to.
	     * @returns {ModelLocalization}
	     */


	    _createClass(ModelLocalization, [{
	        key: "bind",
	        value: function bind(model) {
	            this.model = model;
	            return this;
	        }
	    }]);

	    return ModelLocalization;
	}();

	exports.default = ModelLocalization;

/***/ },
/* 23 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var AttributeLocalization = function () {

	    /**
	     * Contains Localization aspect data for Attribute.
	     * @param {string} label        Label of the Attribute.
	     * @param {string} placeholder  Placeholder of the Attribute.
	     */

	    function AttributeLocalization(label, placeholder) {
	        _classCallCheck(this, AttributeLocalization);

	        this.label = label;
	        this.placeholder = placeholder;
	    }

	    /**
	     * Binds to Attribute instance.
	     * @param {Attribute} attribute The Attribute to bind to.
	     * @returns {AttributeLocalization}
	     */


	    _createClass(AttributeLocalization, [{
	        key: "bind",
	        value: function bind(attribute) {
	            this.attribute = attribute;
	            return this;
	        }
	    }]);

	    return AttributeLocalization;
	}();

	exports.default = AttributeLocalization;

/***/ },
/* 24 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var ASPECTS_FETCHED = exports.ASPECTS_FETCHED = 'aspects-fetched';
	var MODEL_BUILT = exports.MODEL_BUILT = 'model-built';
	var FORM_RENDERED = exports.FORM_RENDERED = 'form-rendered';
	var FORM_SUBMITTED = exports.FORM_SUBMITTED = 'form-submitted';

/***/ }
/******/ ]);