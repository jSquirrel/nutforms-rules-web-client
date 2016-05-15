"use strict";
import FeedbackHelper from '../../src/helper/FeedbackHelper'

Object.assign = require('object-assign');
let chai = require('chai'),
    expect = require('chai').expect,
    assert = require('chai').assert;

chai.should();

class ObservableMock {

    constructor() {
        this.validation = {
            errors: {
                'rule1': 'err1',
                'rule2': 'err2'
            },
            info: {
                'rule1': 'info1'
            }
        }
    }
}

describe('FeedbackHelper', function () {
    describe('#createErrors', function () {
        it('should return string of HTML elements with feedback', function () {
            let messages = FeedbackHelper.createErrors(new ObservableMock());
            messages.should.not.be.empty;
            messages.should.equal(
                '<div class="validation-error">err1</div>\n' +
                '<div class="validation-error">err2</div>\n' +
                '<div class="validation-info">info1</div>'
            );
        });
    });
});