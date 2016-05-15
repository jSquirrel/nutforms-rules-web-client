import RuleWeaver from "../rules/RuleWeaver";
import RuleAspectsSource from "../aspectsSource/RuleAspectsSource";
import ContextRules from "../rules/ContextRules";
import * as ValidationState from "../constants/ValidationState";
import * as FormSubmitted from "./FormSubmitted";
import * as ValidationHelper from '../helper/ValidationHelper';

/**
 *
 * Callback for the MODEL_BUILT event that is responsible for invoking aspect weaver and pairing validation functions
 * with respective events.
 *
 * @param {Model} model
 */
export function callback(model) {
    ValidationHelper.enhanceModel(model);
    let ruleAspectsSource = new RuleAspectsSource();
    let rules = ruleAspectsSource.fetchRules(model.entityName, model.context);
    if (rules !== null) {
        let contextRules = new ContextRules(rules, model.context);
        RuleWeaver.addObservers(model, contextRules.validationRules(), model.locale);
        RuleWeaver.disableFields(contextRules.securityRules(), model);
    }
    if (!model.hasRules) {
        model['validation'].state = ValidationState.VALID;
        Nutforms.listen(NutformsActions.FORM_SUBMITTED, FormSubmitted.callback)
    }
}