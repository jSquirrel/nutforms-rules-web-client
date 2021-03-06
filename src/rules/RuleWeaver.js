import CollectionHelper from "../helper/CollectionHelper";
import * as ValidationState from './../constants/ValidationState'
/**
 * The aspect weaver of rules
 */
export default class RuleWeaver {

    /**
     * Adds validation observers to suitable field events of the model
     *
     * @param {Model} model backing object of the form
     * @param {Array.<object>} rules list of rules received from the server
     * @param {string} locale current locale from user context
     */
    static addObservers(model, rules, locale) {
        rules.forEach(rule => {
            if (rule.hasOwnProperty("condition")) {
                let fieldNames = this.getFields(rule.condition);
                if (fieldNames.length === 0) {
                    return;
                }
                let isModelRelated = this.isModelRelated(rule.condition);
                let attributes = [];
                fieldNames.forEach(name => attributes.push(model.attributes[name]));
                let validator = this.createFunction(model, isModelRelated ? [model] : attributes, rule, locale);
                if (validator) {
                    // toDo: also add validators to Relations
                    if (isModelRelated) {
                        model.listen(ModelActions.SUBMITTED, validator);
                        model.hasRules = true;
                    } else {
                        attributes.forEach(attribute => {
                            attribute.listen(AttributeActions.VALUE_CHANGED, validator);
                            attribute.hasRules = true;
                        });
                    }
                }
            }
        })
    }

    /**
     * Creates a validation function out of given object (rule as JSON)
     *
     * @param {Model} model backing object of the form
     * @param {Array.<Observable>} observables list of elements, that are bound to the rule
     * @param {object} rule rule JSON received from the server
     * @param {string} locale current locale from user context
     */
    static createFunction(model, observables, rule, locale) {
        // get the first word, i.e. sequence of letters separated by non-letter
        var that = this;
        return function (args) {
            var declaration = that.declareVariables(model);
            // cannot declare with 'let' keyword, otherwise the variable in anonymous function would evaluate as false
            console.log(declaration + that.rewriteCondition(rule.condition));
            var evalResult = eval(declaration + that.rewriteCondition(rule.condition));
            that.updateAttributeStatus(args, observables, !!evalResult);
            Nutforms.aspectsSource.fetchLocalizationData(`rule.${model.entityName}`, locale, model.context).then((data) => {
                observables.forEach(observable => observable.validation.update({
                    rule: rule.name,
                    errors: evalResult ? null : data[rule.name],
                    info: null
                }));
            });
            return evalResult;
        }
    }

    /**
     * Evaluates given security rules and disables appropriate fields for violated conditions
     *
     * @param {Array.<object>} securityRules security rules for current context
     * @param {Model} model backing object of the form
     */
    static disableFields(securityRules, model) {
        securityRules.forEach(rule => {
            let declarations = [];
            Object.keys(rule.declarations).forEach(declaration => declarations.push(rule.declarations[declaration].field));
            if (!eval(rule.condition)) {
                declarations.forEach(declaration => {
                    model.attributes[declaration].readOnly = true;
                });
            }
        });
    }

    /**
     * Returns a string with variable declarations to be used in eval(). Creates declarations of all
     * attributes of the model. ToDo: add relation support
     *
     * @param {Model} model backing object of the form
     * @returns {string} variable declaration string
     */
    static declareVariables(model) {
        var declaration = '';
        Object.keys(model.attributes).forEach(attr => {
            let attribute = model.attributes[attr];
            var currentVariable = `var ${attribute.name}="${attribute.value}";`;
            if (attribute.value === null) {  // null errors should be handled in the rule declaration
                currentVariable = currentVariable.replace(/"/g, ''); // do not replace null value with "null"
            }
            declaration += currentVariable;
        });
        return declaration;
    }

    /**
     * Returns field names, to which the function should be bound
     *
     * @param {string} expression precondition of the rule
     * @returns {Array.<string>} field names
     */
    static getFields(expression) {
        let fieldNames = [];
        expression.split(/AND|OR|&&|\|\|/).forEach(part => {
            let fieldName = /[a-zA-Z0-9]+/.exec(part);
            if (fieldName !== null && fieldName.length > 0 && fieldNames.indexOf(fieldName[0]) === -1) {
                fieldNames.push(fieldName[0]);
            }
        });
        return fieldNames;
    }

    /**
     * Rewrites the raw Drools rule condition to a form where it can be evaluated with JavaScript
     *
     * @param {string} condition precondition of the rule
     * @returns {string} rewritten condition that can be safely passed to <code>eval()</code> JS function
     */
    static rewriteCondition(condition) {
        let rewritten = condition
            .replace(/AND/g, '&&')
            .replace(/OR/g, '||')
            .replace(/==/g, '===')
            .replace(/!=/g, '!==');
        // rewrite regex matching
        while (rewritten.split(' ').indexOf('~=') > -1) {  // matches gets rewritten to '~=' in Drools
            let split = rewritten.split(' ');
            let matchesIndex = split.indexOf('~=');
            let regex = split[matchesIndex + 1];
            var regexIndex = matchesIndex + 1;
            let skip = 0;
            for (; regex.length > 1 && regex.charAt(regex.length - 1) !== '"'; ++skip) {    // fix regex containing spaces
                regex += ' ' + split[++regexIndex];
            }
            let rest = split.slice(3 + skip, split.length);
            Array.prototype.splice.apply(split, [3, split.length].concat(rest));    // split.length is used to ensure that the array is filled whole (and can be shortened after this)
            split[matchesIndex + 1] = split[matchesIndex - 1] + ')';    // matches the opening bracket of 'test('
            split[matchesIndex - 1] = regex.replace(/"/g, '/');  // globally replace quotes by slashes (RegExp notation)
            split[matchesIndex] = '.test(';
            rewritten = split.join(' ');
        }
        return rewritten;
    }

    /**
     * Returns <code>true</code> if the rule with given condition should be treated as a model-related rule, instead
     * of being bound to individual fields
     *
     * @param {string} condition precondition of the rule
     * @returns {boolean} true if the rule is model-related
     */
    static isModelRelated(condition) {
        return condition.indexOf('||') > -1 || condition.indexOf('OR') > -1;
    }

    /**
     * Updates the ValidationState of given attributes according to the result of validation function
     *
     * @param {Observable} observable component on which the function was triggered
     * @param {Array.<Attribute>} attributes all attributes related to current rule
     * @param {boolean} valid <code>true</code> if the rule was evaluated as true with current form values
     */
    static updateAttributeStatus(observable, attributes, valid) {
        // is state attribute defined - filters out Model related rules, all fields are
        if (attributes.length === 1 && !!attributes[0]['validation'].state) {
            console.log(`${attributes[0].name} state changing from ${attributes[0]['validation'].state}...`);
            if (attributes[0]['validation'].state !== ValidationState.INVALID) {   // if it's invalid, keep it that way (every change should set state to PENDING)
                attributes[0]['validation'].state = valid ? ValidationState.VALID : ValidationState.INVALID;
            }
            console.log(`...to ${attributes[0]['validation'].state}`)
        } else if (attributes.length > 1) { // multi-field rule
            // untouched attributes
            let indexes = CollectionHelper.findWithNestedAttribute(attributes, 'validation', 'state', ValidationState.UNTOUCHED);
            // are there no untouched fields, or the only untouched is current attribute (trigger of this event)
            let isAloneUntouched = indexes.length === 0 || (indexes.length === 1 && indexes[0] === (attributes.indexOf(observable)));
            attributes.forEach(attr => {
                // if the rule is triggered on Model, name is undefined -> always false
                // Model rules are triggered only on submit, thus attributes should not have status BLOCKED after this
                if (isAloneUntouched) { // set valid/invalid to all fields...
                    console.log(`${attr.name} state changing from ${attr['validation'].state}...`);
                    if (attr['validation'].state !== ValidationState.INVALID) {
                        attr['validation'].state = valid ? ValidationState.VALID : ValidationState.INVALID;
                    }
                    console.log(`...to ${attr['validation'].state}`);
                } else if (attr.name === observable.name) { // ...or set current to blocked
                    console.log(`${attr.name} state changed from ${attr['validation'].state} to BLOCKED`);
                    attr['validation'].state = ValidationState.BLOCKED;
                }
            })
        }
    }
}