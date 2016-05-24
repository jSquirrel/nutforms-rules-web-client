import * as ValidationActions from "../constants/ValidationActions";
import FeedbackHelper from "../helper/FeedbackHelper";
import * as ValidationState from "../constants/ValidationState";
/**
 * Callback for event FORM_SUBMITTED/MODEL_VALIDATED, which is responsible for triggering model related rules and 
 * firing respective events.
 *
 * @param {Model} model form rich model
 */
export function callback(model) {
    if (!model.hasErrors()) {
        model.trigger(ValidationActions.MODEL_VALID, model);
    }
}

/**
 * Callback for event FORM_SUBMITTED/MODEL_VALIDATED, which is responsible for rendering feedback.
 *
 * @param {Model} model model on which the event was fired
 * @param formLabel html element of the model
 */
export function renderFeedback(model, formLabel) {
    let messages = FeedbackHelper.createErrors(model);

    let errorFields = DOMHelper.findElementsWithAttribute(formLabel.parentElement, "nf-model-widget-errors");
    if (errorFields.length > 0) {
        errorFields.forEach((field) => {
            // Add validation messages to each nf-field-widget-errors container
            field.innerHTML = messages;
        });
    } else {
        // If there is no nf-field-widget-errors container, create one
        formLabel.insertAdjacentHTML("afterend", "<div nf-model-widget-errors>"
            + messages + "</div>");
    }
}

/**
 * Updates model state on form submit before validation.
 *
 * @param {Model} model model instance
 */
export function setPending(model) {
    model['validation'].state = model.hasRules ? ValidationState.PENDING : ValidationState.VALID;
}