import * as ModelBuilt from "./callbacks/ModelBuilt";
import * as ValidationActions from "./constants/ValidationActions";
import * as ValidationState from "./constants/ValidationState";
import * as FormRendered from "./callbacks/FormRendered";
import * as FormSubmitted from "./callbacks/FormSubmitted";

window.ValidationActions = ValidationActions;
window.ValidationState = ValidationState;
Nutforms.listen(NutformsActions.MODEL_BUILT, ModelBuilt.callback);
Nutforms.listen(NutformsActions.FORM_RENDERED, FormRendered.callback);
Nutforms.listen(NutformsActions.FORM_SUBMITTED, FormSubmitted.setPending);
