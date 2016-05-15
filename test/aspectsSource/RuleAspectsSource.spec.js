"use strict";
import RuleAspectsSource from '../../src/aspectsSource/RuleAspectsSource'

let chai = require('chai'),
    expect = require('chai').expect,
    assert = require('chai').assert;

chai.should();

describe('RuleAspectsSource', function() {
    describe('#constructor', function() {
        let aspectsSource = new RuleAspectsSource();
        it('should define _toJson method', function() {
            expect(aspectsSource).to.have.property('_toJson').that.is.a('function');
        });
        it('...that should parse string to JSON', function() {
            let parsedJson = aspectsSource._toJson('{"property":"value"}');
            parsedJson.should.have.a.property('property').that.equals('value');
        });
        it('...or return null', function() {
            let parsedJson = aspectsSource._toJson('nmunsjz');
            assert.equal(parsedJson, null);
        });
    });
});