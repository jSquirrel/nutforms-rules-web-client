"use strict";
import ContextRules from '../../src/rules/ContextRules'

Object.assign = require('object-assign');
let chai = require('chai'),
    expect = require('chai').expect,
    assert = require('chai').assert;

chai.should();

describe('ContextRules', function () {
    describe('#constructor', function () {
        it('should initialize attributes', function () {
            let rules = [{name: 'rule1'}, {name: 'rule2'}];
            let contextRules = new ContextRules(rules, 'ctxName');
            expect(contextRules.rules).to.equal(rules);
            contextRules.context.should.equal('ctxName');
        });
    });
    let rules = [{name: 'rule1'}, {name: '[Security]rule2'}];
    let contextRules = new ContextRules(rules, 'ctxName');

    describe('#validationRules', function () {
        it('should return only validation functions', function () {
            let validationRules = contextRules.validationRules();
            validationRules.should.be.a('array').with.length(1);
            assert.equal(validationRules[0], rules[0]);
        });
    });

    describe('#securityRules', function () {
        it('should return only security functions', function () {
            let securityRules = contextRules.securityRules();
            securityRules.should.be.a('array').with.length(1);
            assert.equal(securityRules[0], rules[1]);
        });
    });
});