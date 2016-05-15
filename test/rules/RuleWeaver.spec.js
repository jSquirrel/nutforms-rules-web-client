"use strict";
import RuleWeaver from '../../src/rules/RuleWeaver'
import ModelMock from "../ModelMock";
import Validation from "../../src/model/Validation";
import * as ValidationState from "../../src/constants/ValidationState";

let chai = require('chai'),
    expect = require('chai').expect,
    assert = require('chai').assert;

chai.should();

describe('RuleWeaver', function () {
    let model, attr1, attr2;
    beforeEach(function () {
        model = new ModelMock();
        model.validation = new Validation();
        model.addAttribute('attr1');
        model.addAttribute('attr2');
        attr1 = model.attributes['attr1'];
        attr2 = model.attributes['attr2'];
        attr1['validation'] = new Validation();
        attr2['validation'] = new Validation();
    });
    describe('#disableFields', function () {
        it('should set readonly flag to attributes from given rules', function () {
            let securityRules = [{declarations: {$attribute: {field: 'attr2'}}}];
            RuleWeaver.disableFields(securityRules, model);
            assert.equal(attr2.readOnly, true);
        });
    });

    describe('#declareVariables', function () {
        it('should should return a string of variable declarations from given model', function () {
            let declarations = RuleWeaver.declareVariables(model);
            declarations.should.equal('var attr1="testValue";var attr2="testValue";');
        });
    });

    describe('#getFields', function () {
        it('should return array of field names', function () {
            let fieldNames = RuleWeaver.getFields('A != null && (B.length > 0 || C != null) && D ~= "[a-zA-Z]+"');
            fieldNames.should.be.an('array').with.length(4);
            assert.equal(fieldNames[0], 'A');
            assert.equal(fieldNames[1], 'B');
            assert.equal(fieldNames[2], 'C');
            assert.equal(fieldNames[3], 'D');
        });
    });

    describe('#rewriteCondition', function () {
        it('should rewrite logical and comparison operators', function () {
            let logical = RuleWeaver.rewriteCondition('a AND (b OR c)');
            logical.should.equal('a && (b || c)');
            let compare = RuleWeaver.rewriteCondition('property == 15 OR property != 20');
            compare.should.equal('property === 15 || property !== 20');
        });
        it('should rewrite regex', function () {
            let regex = RuleWeaver.rewriteCondition('property ~= "^[a-zA-Z0-9 ]*$"');
            regex.should.equal('/^[a-zA-Z0-9 ]*$/ .test( property)');
        });
    });

    describe('#isModelRelated', function () {
        it('should return true only for model related rules', function () {
            assert.equal(RuleWeaver.isModelRelated('a == true OR a != true'), true);
            assert.equal(RuleWeaver.isModelRelated('a == true AND a == false'), false);
        });
    });

    describe('#updateAttributeStatus', function () {
        it('should change state to VALID for valid fields', function () {
            attr1['validation'].state = ValidationState.PENDING;
            attr2['validation'].state = ValidationState.PENDING;
            RuleWeaver.updateAttributeStatus(attr1,[attr1, attr2],true);
            attr1['validation'].state.should.equal(ValidationState.VALID);
            attr2['validation'].state.should.equal(ValidationState.VALID);
        });
        it('should change state to INVALID for invalid fields', function () {
            attr1['validation'].state = ValidationState.PENDING;
            attr2['validation'].state = ValidationState.PENDING;
            RuleWeaver.updateAttributeStatus(attr1,[attr1, attr2],false);
            attr1['validation'].state.should.equal(ValidationState.INVALID);
            attr2['validation'].state.should.equal(ValidationState.INVALID);
        });
        it('should change state to BLOCKED for multifield rules when the other field is UNTOUCHED', function () {
            attr1['validation'].state = ValidationState.PENDING;
            attr2['validation'].state = ValidationState.UNTOUCHED;
            RuleWeaver.updateAttributeStatus(attr1,[attr1, attr2],true);
            attr1['validation'].state.should.equal(ValidationState.BLOCKED);
            attr2['validation'].state.should.equal(ValidationState.UNTOUCHED);
        });
        it('should change state to VALID/INVALID for multifield rules when the other field is not UNTOUCHED', function () {
            attr1['validation'].state = ValidationState.UNTOUCHED;
            attr2['validation'].state = ValidationState.VALID;
            RuleWeaver.updateAttributeStatus(attr1,[attr1, attr2],false);
            attr1['validation'].state.should.equal(ValidationState.INVALID);
            attr2['validation'].state.should.equal(ValidationState.INVALID);
        });
    });

    describe('#createFunction', function () {
        it('should return a validation function', function () {
            let rule = {condition: 'attr1 != false'};
            let validator = RuleWeaver.createFunction(model, [attr1], rule, 'en_US');
            validator.should.be.a('function');
        });
    });
});