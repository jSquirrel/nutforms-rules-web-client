"use strict";
import Validation from '../../src/model/Validation'
import * as ValidationState from '../../src/constants/ValidationState'
import ListenerMock from '../ListenerMock'

Object.assign = require('object-assign');
let chai = require('chai'),
    expect = require('chai').expect,
    assert = require('chai').assert;

chai.should();

class ObservableMock {
    constructor() {
        this.validatedCalled = 0;
    }

    validated() {
        ++this.validatedCalled;
    }
}

describe('Validation', function () {
    describe('#constructor', function () {
        it('should initialize attributes and set default state', function () {
            let validation = new Validation();
            expect(validation.errors).to.be.empty;
            expect(validation.info).to.be.empty;
            expect(validation.observable).to.be.empty;
            validation.state.should.equal(ValidationState.UNTOUCHED);
        })
    });

    describe('#bind', function () {
        let validation;
        beforeEach(function () {
            validation = new Validation();
        });
        it('should update observable', function () {
            let model = 'model';
            validation.bind(model).observable.should.equal(model);
        });
        it('should return itself', function () {
            let model = 'model';
            validation.bind(model).should.equal(validation);
        })
    });

    describe('#update', function () {
        let validation,feedback;
        before(function () {
            validation = new Validation();
            validation.bind(new ObservableMock());
            feedback = {
                rule: 'testRule',
                errors: 'err1',
                info: 'info1'
            };
        });
        it('should save feedback data', function() {
            validation.update(feedback);
            expect(validation.errors).to.have.property('testRule').with.valueOf('err1');
            expect(validation.info).to.have.property('testRule').with.valueOf('info1');
        });
        it('should call validated on observable', function() {
            assert.equal(validation.observable.validatedCalled, 1);
            validation.update(feedback);
            assert.equal(validation.observable.validatedCalled, 2);
        });
    });

    describe('#hasErrors', function() {
        let validation;
        beforeEach(function () {
            validation = new Validation();
        });
        it('should return false only for VALID state', function() {
            validation.hasErrors().should.equal(true);
            validation.state = ValidationState.BLOCKED;
            validation.hasErrors().should.equal(true);
            validation.state = ValidationState.INVALID;
            validation.hasErrors().should.equal(true);
            validation.state = ValidationState.PENDING;
            validation.hasErrors().should.equal(true);
            validation.state = ValidationState.VALID;
            validation.hasErrors().should.equal(false);
        });
    })
});