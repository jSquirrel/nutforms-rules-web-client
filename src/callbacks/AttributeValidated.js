import FeedbackHelper from "../helper/FeedbackHelper";

/**
 * Callback for event ATTRIBUTE_VALIDATED - renders all errors and info messages for given field
 *
 * @param {Attribute} attr attribute on which the event was fired
 * @param htmlElement html element of the attribute
 */
export function callback(attr, htmlElement) {
    let messages = FeedbackHelper.createErrors(attr);

    let errorFields = DOMHelper.findElementsWithAttribute(htmlElement.parentElement, "nf-field-widget-errors");
    if (errorFields.length > 0) {
        errorFields.forEach((field) => {
            // Add validation messages to each nf-field-widget-errors container
            field.innerHTML = messages;
        });
    } else {
        // If there is no nf-field-widget-errors container, create one
        htmlElement.parentElement.insertAdjacentHTML("beforeend", "<div nf-field-widget-errors>"
            + messages + "</div>");
    }
}