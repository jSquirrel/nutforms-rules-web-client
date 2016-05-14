import RuleWeaver from "../rules/RuleWeaver";
import RuleAspectsSource from "../aspectsSource/RuleAspectsSource";
import ContextRules from "../rules/ContextRules";
import Validation from "../model/Validation";
import * as ValidationActions from "../constants/ValidationActions";
import * as ValidationState from "../constants/ValidationState";
import * as FormSubmitted from "./FormSubmitted";

/**
 *
 * Callback for the MODEL_BUILT event that is responsible for invoking aspect weaver and pairing validation functions
 * with respective events.
 *
 * @param {Model} model
 */
export function callback(model) {
    // create validation objects
    model.validation = new Validation().bind(model);
    model.validated = function () {
        model.trigger(ValidationActions.MODEL_VALIDATED, model);
    };
    model.hasErrors = function () {
        let errors = false;
        Object.keys(model.attributes).forEach((attr) => errors |= model.getAttribute(attr).hasErrors());
        //Object.keys(model.relations).forEach((relation) => errors |= model.getRelation(relation).hasErrors());
        errors |= model.validation.hasErrors();  // toDo: probably also add state
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
        attr.listen(AttributeActions.VALUE_CHANGED, setPending)
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
        relation.listen(AttributeActions.VALUE_CHANGED, setPending)
    });
    let ruleAspectsSource = new RuleAspectsSource();
    Promise.resolve(
        ruleAspectsSource.fetchRules(model.entityName, model.context)
    ).then((rules) => {
        let contextRules = new ContextRules(rules, model.context);
        RuleWeaver.addObservers(model, contextRules.validationRules(), model.locale);
        // toDo: handle security rules
    });
    if (!model.hasRules) {
        Nutforms.listen(NutformsActions.FORM_SUBMITTED, FormSubmitted.callback)
    }
}

/**
 * VALUE_CHANGED callback to set state to PENDING
 *
 * @param {Attribute} attribute
 */
function setPending(attribute) {
    attribute['validation'].state = attribute.hasRules ?
        ValidationState.PENDING : ValidationState.VALID;
}