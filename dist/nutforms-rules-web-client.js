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

	"use strict";

	var _ModelBuilt = __webpack_require__(1);

	var ModelBuilt = _interopRequireWildcard(_ModelBuilt);

	var _ValidationActions = __webpack_require__(9);

	var ValidationActions = _interopRequireWildcard(_ValidationActions);

	var _ValidationState = __webpack_require__(4);

	var ValidationState = _interopRequireWildcard(_ValidationState);

	var _FormRendered = __webpack_require__(12);

	var FormRendered = _interopRequireWildcard(_FormRendered);

	var _FormSubmitted = __webpack_require__(10);

	var FormSubmitted = _interopRequireWildcard(_FormSubmitted);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	window.ValidationActions = ValidationActions;
	window.ValidationState = ValidationState;
	Nutforms.listen(NutformsActions.MODEL_BUILT, ModelBuilt.callback);
	Nutforms.listen(NutformsActions.FORM_RENDERED, FormRendered.callback);
	Nutforms.listen(NutformsActions.FORM_SUBMITTED, FormSubmitted.setPending);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.callback = callback;

	var _RuleWeaver = __webpack_require__(2);

	var _RuleWeaver2 = _interopRequireDefault(_RuleWeaver);

	var _RuleAspectsSource = __webpack_require__(5);

	var _RuleAspectsSource2 = _interopRequireDefault(_RuleAspectsSource);

	var _ContextRules = __webpack_require__(7);

	var _ContextRules2 = _interopRequireDefault(_ContextRules);

	var _Validation = __webpack_require__(8);

	var _Validation2 = _interopRequireDefault(_Validation);

	var _ValidationActions = __webpack_require__(9);

	var ValidationActions = _interopRequireWildcard(_ValidationActions);

	var _ValidationState = __webpack_require__(4);

	var ValidationState = _interopRequireWildcard(_ValidationState);

	var _FormSubmitted = __webpack_require__(10);

	var FormSubmitted = _interopRequireWildcard(_FormSubmitted);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 *
	 * Callback for the MODEL_BUILT event that is responsible for invoking aspect weaver and pairing validation functions
	 * with respective events.
	 *
	 * @param {Model} model
	 */
	function callback(model) {
	    // create validation objects
	    model.validation = new _Validation2.default().bind(model);
	    model.validated = function () {
	        model.trigger(ValidationActions.MODEL_VALIDATED, model);
	    };
	    model.hasErrors = function () {
	        var errors = false;
	        Object.keys(model.attributes).forEach(function (attr) {
	            return errors |= model.attributes[attr]['validation'].hasErrors();
	        });
	        //Object.keys(model.relations).forEach((relation) => errors |= model.relations[relation]['validation'].hasErrors());
	        errors |= model.validation.hasErrors(); // toDo: probably also add state
	        return errors;
	    };
	    model.hasRules = false;
	    model.listen(ValidationActions.MODEL_VALIDATED, FormSubmitted.callback);
	    Object.keys(model.attributes).forEach(function (attribute) {
	        var attr = model.attributes[attribute];
	        attr.validation = new _Validation2.default().bind(attr);
	        attr.validated = function () {
	            attr.trigger(ValidationActions.ATTRIBUTE_VALIDATED, attr);
	        };
	        attr.hasErrors = function () {
	            attr.validation.hasErrors();
	        };
	        attr.hasRules = false;
	        attr.listen(AttributeActions.VALUE_CHANGED, setPending);
	    });
	    Object.keys(model.relations).forEach(function (rel) {
	        var relation = model.relations[rel];
	        relation.validation = new _Validation2.default().bind(relation);
	        relation.validated = function () {
	            relation.trigger(ValidationActions.ATTRIBUTE_VALIDATED, relation);
	        };
	        relation.hasErrors = function () {
	            relation.validation.hasErrors();
	        };
	        relation.listen(AttributeActions.VALUE_CHANGED, setPending);
	    });
	    var ruleAspectsSource = new _RuleAspectsSource2.default();
	    Promise.resolve(ruleAspectsSource.fetchRules(model.entityName, model.context)).then(function (rules) {
	        var contextRules = new _ContextRules2.default(rules, model.context);
	        _RuleWeaver2.default.addObservers(model, contextRules.validationRules(), model.locale);
	        _RuleWeaver2.default.disableFields(contextRules.securityRules(), model);
	    });
	    if (!model.hasRules) {
	        model['validation'].state = ValidationState.VALID;
	        Nutforms.listen(NutformsActions.FORM_SUBMITTED, FormSubmitted.callback);
	    }
	}

	/**
	 * VALUE_CHANGED callback to set state to PENDING
	 *
	 * @param {Attribute} attribute
	 */
	function setPending(attribute) {
	    attribute['validation'].state = attribute.hasRules ? ValidationState.PENDING : ValidationState.VALID;
	}

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _CollectionHelper = __webpack_require__(3);

	var _CollectionHelper2 = _interopRequireDefault(_CollectionHelper);

	var _ValidationState = __webpack_require__(4);

	var ValidationState = _interopRequireWildcard(_ValidationState);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var RuleWeaver = function () {
	    function RuleWeaver() {
	        _classCallCheck(this, RuleWeaver);
	    }

	    _createClass(RuleWeaver, null, [{
	        key: "addObservers",


	        // toDo: move some methods to ValidationHelper

	        /**
	         * Adds validation observers to suitable field events of the model
	         *
	         * @param {Model} model
	         * @param {Array.<object>} rules
	         * @param {string} locale
	         */
	        value: function addObservers(model, rules, locale) {
	            var _this = this;

	            rules.forEach(function (rule) {
	                if (rule.hasOwnProperty("condition")) {
	                    var _ret = function () {
	                        var fieldNames = _this.getFields(rule.condition);
	                        if (fieldNames.length === 0) {
	                            return {
	                                v: void 0
	                            };
	                        }
	                        var isModelRelated = _this.isModelRelated(rule.condition);
	                        var attributes = [];
	                        fieldNames.forEach(function (name) {
	                            return attributes.push(model.attributes[name]);
	                        });
	                        var validator = _this.createFunction(model, isModelRelated ? [model] : attributes, rule, locale);
	                        if (validator) {
	                            // toDo: also add validators to Relations
	                            if (isModelRelated) {
	                                model.listen(ModelActions.SUBMITTED, validator);
	                                model.hasRules = true;
	                            } else {
	                                attributes.forEach(function (attribute) {
	                                    attribute.listen(AttributeActions.VALUE_CHANGED, validator);
	                                    attribute.hasRules = true;
	                                });
	                            }
	                        }
	                    }();

	                    if ((typeof _ret === "undefined" ? "undefined" : _typeof(_ret)) === "object") return _ret.v;
	                }
	            });
	        }

	        /**
	         * Creates a validation function out of given object (rule as JSON)
	         *
	         * @param {Model} model
	         * @param {Array.<Observable>} observables
	         * @param {object} rule
	         * @param {string} locale
	         */

	    }, {
	        key: "createFunction",
	        value: function createFunction(model, observables, rule, locale) {
	            // get the first word, i.e. sequence of letters separated by non-letter
	            var that = this;
	            return function (args) {
	                var declaration = that.declareVariables(model);
	                // cannot declare with 'let' keyword, otherwise the variable in anonymous function would evaluate as false
	                console.log(declaration + that.rewriteCondition(rule.condition));
	                var evalResult = eval(declaration + that.rewriteCondition(rule.condition));
	                that.updateAttributeStatus(args, observables, !!evalResult);
	                var url = document.location.origin + '/';
	                Nutforms.aspectsSource.fetchLocalizationData("rule." + model.entityName, locale, model.context).then(function (data) {
	                    observables.forEach(function (observable) {
	                        return observable.validation.update({
	                            rule: rule.name,
	                            errors: evalResult ? null : data[rule.name],
	                            info: null
	                        });
	                    });
	                });
	                return evalResult;
	            };
	        }

	        /**
	         * Evaluates given security rules and disables appropriate fields for violated conditions
	         *
	         * @param {Array.<object>} securityRules security rules for current context
	         * @param {Model} model
	         */

	    }, {
	        key: "disableFields",
	        value: function disableFields(securityRules, model) {
	            securityRules.forEach(function (rule) {
	                var declarations = [];
	                Object.keys(rule.declarations).forEach(function (declaration) {
	                    return declarations.push(rule.declarations[declaration].field);
	                });
	                if (!eval(rule.condition)) {
	                    declarations.forEach(function (declaration) {
	                        model.attributes[declaration].readOnly = true;
	                    });
	                }
	            });
	        }

	        /**
	         * Returns a string with variable declarations to be used in eval(). Creates declarations of all
	         * attributes of the model. ToDo: add relation support
	         *
	         * @param {Model} model
	         * @returns {string} variable declaration string
	         */

	    }, {
	        key: "declareVariables",
	        value: function declareVariables(model) {
	            var declaration = '';
	            Object.keys(model.attributes).forEach(function (attr) {
	                var attribute = model.attributes[attr];
	                var currentVariable = "var " + attribute.name + "=\"" + attribute.value + "\";";
	                if (attribute.value === null) {
	                    // null errors should be handled in the rule declaration
	                    currentVariable = currentVariable.replace(/"/g, ''); // do not replace null value with "null"
	                }
	                declaration += currentVariable;
	            });
	            return declaration;
	        }

	        /**
	         * Returns field names, to which the function should be bound
	         *
	         * @param {string} expression
	         * @returns {Array.<string>} field names
	         */

	    }, {
	        key: "getFields",
	        value: function getFields(expression) {
	            var fieldNames = [];
	            expression.split(/AND|OR|&&|\|\|/).forEach(function (part) {
	                var fieldName = /[a-zA-Z0-9]+/.exec(part);
	                if (fieldName !== null && fieldName.length > 0 && fieldNames.indexOf(fieldName[0]) === -1) {
	                    fieldNames.push(fieldName[0]);
	                }
	            });
	            return fieldNames;
	        }

	        /**
	         * Rewrites the raw Drools rule condition to a form where it can be evaluated with JavaScript
	         *
	         * @param {string} condition
	         * @returns {string} rewritten condition that can be safely passed to <code>eval()</code> JS function
	         */

	    }, {
	        key: "rewriteCondition",
	        value: function rewriteCondition(condition) {
	            var rewritten = condition.replace(/AND/g, '&&').replace(/OR/g, '||').replace(/==/g, '===').replace(/!=/g, '!==');
	            // rewrite regex matching
	            while (rewritten.split(' ').indexOf('~=') > -1) {
	                // matches gets rewritten to '~=' in Drools
	                var split = rewritten.split(' ');
	                var matchesIndex = split.indexOf('~=');
	                var regex = split[matchesIndex + 1];
	                var regexIndex = matchesIndex + 1;
	                var skip = 0;
	                for (; regex.length > 1 && regex.charAt(regex.length - 1) !== '"'; ++skip) {
	                    // fix regex containing spaces
	                    regex += ' ' + split[++regexIndex];
	                }
	                var rest = split.slice(3 + skip, split.length);
	                Array.prototype.splice.apply(split, [3, split.length].concat(rest)); // split.length is used to ensure that the array is filled whole (and can be shortened after this)
	                split[matchesIndex + 1] = split[matchesIndex - 1] + ')'; // matches the opening bracket of 'test('
	                split[matchesIndex - 1] = regex.replace(/"/g, '/'); // globally replace quotes by slashes (RegExp notation)
	                split[matchesIndex] = '.test(';
	                rewritten = split.join(' ');
	            }
	            return rewritten;
	        }

	        /**
	         * Returns <code>true</code> if the rule with given condition should be treated as a model-related rule, instead
	         * of being bound to individual fields
	         *
	         * @param {string} condition condition of the rule
	         * @returns {boolean} true if the rule is model-related
	         */

	    }, {
	        key: "isModelRelated",
	        value: function isModelRelated(condition) {
	            return condition.indexOf('||') > -1 || condition.indexOf('OR') > -1;
	        }

	        /**
	         * Updates the ValidationState of given attributes according to the result of validation function
	         *
	         * @param {Observable} observable component on which the function was triggered
	         * @param {Array.<Attribute>} attributes all attributes related to current rule
	         * @param {boolean} valid <code>true</code> if the rule was evaluated as true with current form values
	         */

	    }, {
	        key: "updateAttributeStatus",
	        value: function updateAttributeStatus(observable, attributes, valid) {
	            // is state attribute defined - filters out Model related rules, all fields are
	            if (attributes.length === 1 && !!attributes[0]['validation'].state) {
	                console.log(attributes[0].name + " state changing from " + attributes[0]['validation'].state + "...");
	                if (attributes[0]['validation'].state !== ValidationState.INVALID) {
	                    // if it's invalid, keep it that way (every change should set state to PENDING)
	                    attributes[0]['validation'].state = valid ? ValidationState.VALID : ValidationState.INVALID;
	                }
	                console.log("...to " + attributes[0]['validation'].state);
	            } else if (attributes.length > 1) {
	                (function () {
	                    // multi-field rule
	                    // untouched attributes
	                    var indexes = _CollectionHelper2.default.findWithNestedAttribute(attributes, 'validation', 'state', ValidationState.UNTOUCHED);
	                    // are there no untouched fields, or the only untouched is current attribute (trigger of this event)
	                    var isAloneUntouched = indexes.length === 0 || indexes.length === 1 && indexes[0] === attributes.indexOf(observable);
	                    attributes.forEach(function (attr) {
	                        // if the rule is triggered on Model, name is undefined -> always false
	                        // Model rules are triggered only on submit, thus attributes should not have status BLOCKED after this
	                        if (isAloneUntouched) {
	                            // set valid/invalid to all fields...
	                            console.log(attr.name + " state changing from " + attr['validation'].state + "...");
	                            if (attr['validation'].state !== ValidationState.INVALID) {
	                                attr['validation'].state = valid ? ValidationState.VALID : ValidationState.INVALID;
	                            }
	                            console.log("...to " + attr['validation'].state);
	                        } else if (attr.name === observable.name) {
	                            // ...or set current to blocked
	                            console.log(attr.name + " state changed from " + attr['validation'].state + " to BLOCKED");
	                            attr['validation'].state = ValidationState.BLOCKED;
	                        }
	                    });
	                })();
	            }
	        }
	    }]);

	    return RuleWeaver;
	}();

	exports.default = RuleWeaver;

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var CollectionHelper = function () {
	    function CollectionHelper() {
	        _classCallCheck(this, CollectionHelper);
	    }

	    _createClass(CollectionHelper, null, [{
	        key: "findWithAttribute",


	        /**
	         * Returns array of indexes of objects from given array, that have given attribute equal to given value. For instance,
	         * calling this function as
	         * <code>findWithAttribute([{attr:1}, {attr:2}, {another:'asdf'}, {attr:2}], 'attr', 2)</code>
	         * will return [1,3].
	         *
	         * @param {Array.<object>} array array of objects
	         * @param {string} attribute name of object property that is being tested
	         * @param {*} value desired value of given attribute
	         * @returns {Array.<number>} index of the first object with desired attribute value, or <code>undefined</code> if such
	         * object is not present in the given array
	         */
	        value: function findWithAttribute(array, attribute, value) {
	            var indexes = [];
	            for (var i = 0; i < array.length; ++i) {
	                if (array[i][attribute] === value) {
	                    indexes.push(i);
	                }
	            }
	            return indexes;
	        }
	    }, {
	        key: "findWithNestedAttribute",
	        value: function findWithNestedAttribute(array, attribute, subattribute, value) {
	            var indexes = [];
	            for (var i = 0; i < array.length; ++i) {
	                if (array[i][attribute][subattribute] === value) {
	                    indexes.push(i);
	                }
	            }
	            return indexes;
	        }
	    }]);

	    return CollectionHelper;
	}();

	exports.default = CollectionHelper;

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var UNTOUCHED = exports.UNTOUCHED = 'UNTOUCHED';
	var BLOCKED = exports.BLOCKED = 'BLOCKED';
	var PENDING = exports.PENDING = 'PENDING';
	var INVALID = exports.INVALID = 'INVALID';
	var VALID = exports.VALID = 'VALID';

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	__webpack_require__(6);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var RuleAspectSource = function () {

	    /**
	     * Enables loading rule aspects from the Nutforms Server.
	     */

	    function RuleAspectSource() {
	        _classCallCheck(this, RuleAspectSource);

	        this.RULES_ENDPOINT = 'rules/';
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
	     * Fetches rules for given class within given context
	     *
	     * @param {string} className
	     * @param {string} context
	     * @returns {Promise.<T>}
	     */


	    _createClass(RuleAspectSource, [{
	        key: 'fetchRules',
	        value: function fetchRules(className, context) {
	            return fetch(Nutforms.aspectsSource._buildUrl(this.RULES_ENDPOINT + className + '/' + context)).then(this._toJson).then(this._logResponse("Context rules loaded from API"));
	        }
	    }]);

	    return RuleAspectSource;
	}();

	exports.default = RuleAspectSource;

/***/ },
/* 6 */
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
/* 7 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var ContextRules = function () {

	    /**
	     * ContextRules constructor
	     *
	     * @param {Array.<object>} contextRules array of JSON objects with server-parsed rule declarations
	     * @param {string} context
	     */

	    function ContextRules(contextRules, context) {
	        _classCallCheck(this, ContextRules);

	        this.rules = contextRules;
	        this.context = context;
	    }

	    // toDo: rules distinguishing should be done differently, let this be a proof of concept

	    /**
	     *  Returns an object containing only validation rules for this context
	     *  @returns {Array.<object>} validation rules
	     */


	    _createClass(ContextRules, [{
	        key: 'validationRules',
	        value: function validationRules() {
	            var validationRules = [];
	            this.rules.forEach(function (rule) {
	                if (typeof rule.name !== 'undefined' && rule.name.indexOf('[Security]') === -1) {
	                    validationRules.push(rule);
	                }
	            });
	            return validationRules;
	        }

	        /**
	         *  Returns an object containing only security rules for this context
	         *  @returns {Array.<object>} security rules
	         */

	    }, {
	        key: 'securityRules',
	        value: function securityRules() {
	            var securityRules = [];
	            this.rules.forEach(function (rule) {
	                if (typeof rule.name !== 'undefined' && rule.name.indexOf('[Security]') > -1) {
	                    securityRules.push(rule);
	                }
	            });
	            return securityRules;
	        }
	    }]);

	    return ContextRules;
	}();

	exports.default = ContextRules;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _ValidationState = __webpack_require__(4);

	var ValidationState = _interopRequireWildcard(_ValidationState);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Validation = function () {

	    /**
	     * Validation constructor
	     */

	    function Validation() {
	        _classCallCheck(this, Validation);

	        this.errors = {};
	        this.info = {};
	        this.observable = {};
	        this.state = ValidationState.UNTOUCHED;
	    }

	    /**
	     * Binds the Validation trait to Observable entity.
	     *
	     * @param {Observable} observable
	     * @returns {Validation}
	     */


	    _createClass(Validation, [{
	        key: "bind",
	        value: function bind(observable) {
	            this.observable = observable;
	            return this;
	        }

	        /**
	         * Update the validation status
	         *
	         * @param {object} feedback response object received after validation
	         */

	    }, {
	        key: "update",
	        value: function update(feedback) {
	            this.errors = Validation._updateValidationState(this.errors, feedback.errors, feedback.rule);
	            this.info = Validation._updateValidationState(this.info, feedback.info, feedback.rule);
	            this.observable.validated();
	        }

	        /**
	         * Merges current validation status with received changes and returns the new state
	         *
	         * @param {object} oldState current validation status
	         * @param {object} newState received object
	         * @param {string} ruleName the name of the validation rule
	         * @returns {object} new component state
	         * @private
	         */

	    }, {
	        key: "hasErrors",


	        /**
	         * Returns <code>true</code> if the value of this attribute is not valid, <code>false</code> if valid
	         *
	         * @returns {boolean}
	         */
	        value: function hasErrors() {
	            return this.state !== ValidationState.VALID;
	            // return Object.keys(this.errors).length > 0;
	        }
	    }], [{
	        key: "_updateValidationState",
	        value: function _updateValidationState(oldState, newState, ruleName) {
	            var updated = Object.assign({}, oldState);
	            updated[ruleName] = newState;
	            for (var attr in updated) {
	                if (updated.hasOwnProperty(attr) && updated[attr] === null) {
	                    delete updated[attr];
	                }
	            }
	            return updated;
	        }
	    }]);

	    return Validation;
	}();

	exports.default = Validation;

/***/ },
/* 9 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	/**
	 * Created by Ondřej Kratochvíl on 14.5.16.
	 */
	var ATTRIBUTE_VALIDATED = exports.ATTRIBUTE_VALIDATED = 'attribute-validated';
	var MODEL_VALIDATED = exports.MODEL_VALIDATED = 'model-validated';
	var MODEL_VALID = exports.MODEL_VALID = 'model-valid';

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.callback = callback;
	exports.renderFeedback = renderFeedback;
	exports.setPending = setPending;

	var _ValidationActions = __webpack_require__(9);

	var ValidationActions = _interopRequireWildcard(_ValidationActions);

	var _FeedbackHelper = __webpack_require__(11);

	var _FeedbackHelper2 = _interopRequireDefault(_FeedbackHelper);

	var _ValidationState = __webpack_require__(4);

	var ValidationState = _interopRequireWildcard(_ValidationState);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	/**
	 * Callback for event FORM_SUBMITTED/MODEL_VALIDATED, which is responsible for triggering model related rules and 
	 * firing respective events.
	 *
	 * @param {Model} model form rich model
	 */
	function callback(model) {
	    if (!model.hasErrors()) {
	        model.trigger(ValidationActions.MODEL_VALID, model);
	        console.log("Triggered MODEL_VALID");
	    }
	}

	/**
	 * Callback for event FORM_SUBMITTED/MODEL_VALIDATED, which is responsible for rendering feedback.
	 *
	 * @param model
	 * @param formLabel
	 */
	function renderFeedback(model, formLabel) {
	    var messages = _FeedbackHelper2.default.createErrors(model);

	    var errorFields = DOMHelper.findElementsWithAttribute(formLabel.parentElement, "nf-model-widget-errors");
	    if (errorFields.length > 0) {
	        errorFields.forEach(function (field) {
	            // Add validation messages to each nf-field-widget-errors container
	            field.innerHTML = messages;
	        });
	    } else {
	        // If there is no nf-field-widget-errors container, create one
	        formLabel.insertAdjacentHTML("afterend", "<div nf-model-widget-errors>" + messages + "</div>");
	    }
	}

	/**
	 * Updates model state on form submit before validation.
	 *
	 * @param model
	 */
	function setPending(model) {
	    model['validation'].state = model.hasRules ? ValidationState.PENDING : ValidationState.VALID;
	}

/***/ },
/* 11 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var FeedbackHelper = function () {
	    function FeedbackHelper() {
	        _classCallCheck(this, FeedbackHelper);
	    }

	    _createClass(FeedbackHelper, null, [{
	        key: "createErrors",


	        /**
	         * Creates HTML elements containing error messages to the given Observable object.
	         *
	         * @param {Observable} observable object to which the messages will be related (Model/Attribute)
	         * @returns {string} list of HTML elements with errors
	         */
	        value: function createErrors(observable) {
	            var infos = []; // "<div class=\"validation-error\">" + observable.state + "</div>"
	            for (var info in observable.validation.info) {
	                if (observable.validation.info.hasOwnProperty(info)) {
	                    infos.push("<div class=\"validation-error\">" + observable.validation.info[info] + "</div>");
	                }
	            }

	            var errors = [];
	            for (var error in observable.validation.errors) {
	                if (observable.validation.errors.hasOwnProperty(error)) {
	                    infos.push("<div class=\"validation-error\">" + observable.validation.errors[error] + "</div>");
	                }
	            }

	            return infos.join("\n") + errors.join("\n");
	        }
	    }]);

	    return FeedbackHelper;
	}();

	exports.default = FeedbackHelper;

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.callback = callback;

	var _AttributeValidated = __webpack_require__(13);

	var AttributeValidated = _interopRequireWildcard(_AttributeValidated);

	var _ValidationActions = __webpack_require__(9);

	var ValidationActions = _interopRequireWildcard(_ValidationActions);

	var _FormSubmitted = __webpack_require__(10);

	var FormSubmitted = _interopRequireWildcard(_FormSubmitted);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	/**
	 * Callback for FORM_RENDERED event. This is used to add callback for individual attributes and model to properly
	 * render feedback messages.
	 *
	 * @param {Model} model
	 * @param htmlElement
	 */
	function callback(model, htmlElement) {
	    // render feedback when validation is finished
	    var values = DOMHelper.findElementsWithAttribute(htmlElement, "nf-field-widget-value");

	    var _loop = function _loop() {
	        var value = values[k];
	        var attributeName = value.getAttribute("nf-field-widget-value");
	        var attribute = model.attributes[attributeName];
	        attribute.listen(ValidationActions.ATTRIBUTE_VALIDATED, function (attr) {
	            return AttributeValidated.callback(attr, value);
	        });
	    };

	    for (var k = 0, o = values.length; k < o; k++) {
	        _loop();
	    }
	    var formLabel = DOMHelper.findElementsWithAttribute(htmlElement, "nf-form-label")[0];
	    model.listen(ValidationActions.MODEL_VALIDATED, function (model) {
	        return FormSubmitted.renderFeedback(model, formLabel);
	    });
	    // toDo: add feedback to relations
	}

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.callback = callback;

	var _FeedbackHelper = __webpack_require__(11);

	var _FeedbackHelper2 = _interopRequireDefault(_FeedbackHelper);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * Callback for event ATTRIBUTE_VALIDATED - renders all errors and info messages for given field
	 *
	 * @param {Attribute} attr
	 * @param htmlElement
	 */
	function callback(attr, htmlElement) {
	    var messages = _FeedbackHelper2.default.createErrors(attr);

	    var errorFields = DOMHelper.findElementsWithAttribute(htmlElement.parentElement, "nf-field-widget-errors");
	    if (errorFields.length > 0) {
	        errorFields.forEach(function (field) {
	            // Add validation messages to each nf-field-widget-errors container
	            field.innerHTML = messages;
	        });
	    } else {
	        // If there is no nf-field-widget-errors container, create one
	        htmlElement.parentElement.insertAdjacentHTML("beforeend", "<div nf-field-widget-errors>" + messages + "</div>");
	    }
	}

/***/ }
/******/ ]);