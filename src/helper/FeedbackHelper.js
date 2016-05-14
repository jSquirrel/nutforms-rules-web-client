export default class FeedbackHelper {
    
    /**
     * Creates HTML elements containing error messages to the given Observable object.
     *
     * @param {Observable} observable object to which the messages will be related (Model/Attribute)
     * @returns {string} list of HTML elements with errors
     */
    static createErrors(observable) {
        let infos = [];  // "<div class=\"validation-error\">" + observable.state + "</div>"
        for (let info in observable.validation.info) {
            if (observable.validation.info.hasOwnProperty(info)) {
                infos.push("<div class=\"validation-error\">" + observable.validation.info[info] + "</div>");
            }
        }

        let errors = [];
        for (let error in observable.validation.errors) {
            if (observable.validation.errors.hasOwnProperty(error)) {
                infos.push("<div class=\"validation-error\">" + observable.validation.errors[error] + "</div>");
            }
        }

        return infos.join("\n") + errors.join("\n");
    }
}