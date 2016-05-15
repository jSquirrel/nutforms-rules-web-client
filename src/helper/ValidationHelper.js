import ValidationActions from "../constants/ValidationActions";
import Validation from "../model/Validation";
import * as FormSubmitted from "../callbacks/FormSubmitted";
import * as ValidationState from "../constants/ValidationState";

export default class ValidationHelper {

    /**
     * Adds validation functionality to given model
     *
     * @param {Model} model
     */
    enhanceModel(model) {
        // create validation objects
        model.validation = new Validation().bind(model);
        model.validated = function () {
            model.trigger(ValidationActions.MODEL_VALIDATED, model);
        };
        model.hasErrors = function () {
            let errors = false;
            Object.keys(model.attributes).forEach((attr) => errors |= model.attributes[attr]['validation'].hasErrors());
            //Object.keys(model.relations).forEach((relation) => errors |= model.relations[relation]['validation'].hasErrors());
            errors |= model.validation.hasErrors();
            return errors;
        };
        model.hasRules = false;
        model.listen(ValidationActions.MODEL_VALIDATED, FormSubmitted.callback);
        Object.keys(model.attributes).forEach((attribute) => {
            let attr = model.attributes[attribute];
            attr.validation = new Validation().bind(attr);
            attr.validated = function () {
                attr.trigger(ValidationActions.ATTRIBUTE_VALIDATED, attr);
            };
            attr.hasErrors = function () {
                attr.validation.hasErrors();
            };
            attr.hasRules = false;
            attr.listen(AttributeActions.VALUE_CHANGED, ValidationHelper.setPending)
        });
        Object.keys(model.relations).forEach((rel) => {
            let relation = model.relations[rel];
            relation.validation = new Validation().bind(relation);
            relation.validated = function () {
                relation.trigger(ValidationActions.ATTRIBUTE_VALIDATED, relation);
            };
            relation.hasErrors = function () {
                relation.validation.hasErrors();
            };
            relation.listen(AttributeActions.VALUE_CHANGED, ValidationHelper.setPending)
        });
    }

    /**
     * VALUE_CHANGED callback to set state to PENDING
     *
     * @param {Attribute} attribute
     */
    static setPending(attribute) {
        attribute['validation'].state = attribute.hasRules ? ValidationState.PENDING : ValidationState.VALID;
    }
}