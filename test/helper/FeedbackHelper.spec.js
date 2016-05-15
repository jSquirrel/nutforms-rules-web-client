"use strict";
import FeedbackHelper from '../../src/helper/FeedbackHelper'

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
                '<div class="validation-info">info1</div>\n' +
                '<div class="validation-error">err1</div>\n' +
                '<div class="validation-error">err2</div>'
            );
        });
        it('should return empty string for objects without feedback', function() {
            let mock = new ObservableMock();
            mock.validation.errors = null;
            mock.validation.info = null;
            let messages = FeedbackHelper.createErrors(mock);
            messages.should.be.empty;
        })
    });
});