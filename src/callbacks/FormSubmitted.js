import * as ValidationActions from "../constants/ValidationActions";
/**
 * Callback for event FORM_SUBMITTED, which is responsible for triggering model related rules and firing respective 
 * events.
 * 
 * @param {Model} model form rich model
 * @param values
 */
export function callback(model, values) {
    if (model.hasObserver(ModelActions.SUBMITTED)) {
        if (!model.hasErrors()) {
            model.trigger(ValidationActions.MODEL_VALID, model);
        }
    } else {
        model.validated();
    }
}