import * as ValidationState from "../constants/ValidationState";

export default class Validation {

    /**
     * Validation constructor
     */
    constructor() {
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
    bind (observable) {
        this.observable = observable;
        return this;
    }

    /**
     * Update the validation status
     *
     * @param {object} feedback response object received after validation
     */
    update(feedback) {
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
    static _updateValidationState(oldState, newState, ruleName) {
        let updated = Object.assign({}, oldState);
        updated[ruleName] = newState;
        for (let attr in updated) {
            if (updated.hasOwnProperty(attr) && updated[attr] === null) {
                delete updated[attr];
            }
        }
        return updated;
    }

    /**
     * Returns <code>true</code> if the value of this attribute is not valid, <code>false</code> if valid
     *
     * @returns {boolean}
     */
    hasErrors() {
        return this.state !== ValidationState.VALID; 
        // return Object.keys(this.errors).length > 0;
    }
}