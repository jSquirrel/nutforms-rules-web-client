import * as ValidationActions from "../constants/ValidationActions";
/**
 * Callback for event FORM_SUBMITTED, which is responsible for triggering model related rules and firing respective
 * events.
 *
 * @param {Model} model form rich model
 * @param values
 */
export function callback(model, values) {
    console.log("Forms submitted callback", model);
    if (!model.hasErrors()) {
        model.trigger(ValidationActions.MODEL_VALID, model);
        console.log("Triggered MODEL_VALID");
    }
}