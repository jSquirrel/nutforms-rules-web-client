import * as AttributeValidated from "./AttributeValidated";
import * as ValidationActions from "../constants/ValidationActions";
import * as FormSubmitted from "./FormSubmitted";

/**
 * Callback for FORM_RENDERED event. This is used to add callback for individual attributes and model to properly
 * render feedback messages.
 *
 * @param {Model} model
 * @param htmlElement
 */
export function callback(model, htmlElement) {
    // render feedback when validation is finished
    let values = DOMHelper.findElementsWithAttribute(htmlElement, "nf-field-widget-value");
    for (var k = 0, o = values.length; k < o; k++) {
        let value = values[k];
        let attributeName = value.getAttribute("nf-field-widget-value");
        let attribute = model.attributes[attributeName];
        attribute.listen(ValidationActions.ATTRIBUTE_VALIDATED, (attr) => AttributeValidated.callback(attr, value));
    }
    let formLabel = DOMHelper.findElementsWithAttribute(htmlElement, "nf-form-label")[0];
    model.listen(ValidationActions.MODEL_VALIDATED, (model) => FormSubmitted.renderFeedback(model, formLabel));
    // toDo: add feedback to relations
}