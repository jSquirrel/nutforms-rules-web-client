"use strict";
import * as FormSubmitted from '../../src/callbacks/FormSubmitted'
import * as ValidationActions from '../../src/constants/ValidationActions'
import ListenerMock from '../ListenerMock'
import ModelMock from "../ModelMock";

let chai = require('chai'),
    expect = require('chai').expect,
    assert = require('chai').assert;

chai.should();

describe('FormSubmitted', function () {
    let model;
    beforeEach(function () {
        model = new ModelMock();
        model.hasErrors = () => {
            return false
        };
    });
    describe('#callback', function () {
        it('should trigger event MODEL_VALID if given model is valid', function () {
            let listener = new ListenerMock();
            model.listen(ValidationActions.MODEL_VALID, listener);
            FormSubmitted.callback(model);
            listener.called.should.equal(1);
            assert.equal(listener.lastArguments[0], 'model-valid');
        });
        it('should not trigger method MODEL_VALID if given model is invalid', function () {
            model.hasErrors = () => {
                return true;
            };
            let listener = new ListenerMock();
            model.listen(ValidationActions.MODEL_VALID, listener);
            FormSubmitted.callback(model);
            listener.called.should.equal(0);
        });
    });
});