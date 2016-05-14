import 'whatwg-fetch'

export default class RuleAspectSource {

    /**
     * Enables loading rule aspects from the Nutforms Server.
     */
    constructor() {
        this.RULES_ENDPOINT = 'rules/';
        this._toText = response => response.text();
        this._toJson = response => {
            try {
                return JSON.parse(response);
            } catch (err) {
                console.log("Error while parsing JSON", response);
                return null;
            }
        };
        this._logResponse = (message) => {
            return response => {
                console.log(message, response);
                return response
            };
        };
    }

    /**
     * Fetches rules for given class within given context
     *
     * @param {string} className
     * @param {string} context
     * @returns {string}
     */
    fetchRules(className, context) {
        var request = new XMLHttpRequest();
        request.open('GET', Nutforms.aspectsSource._buildUrl(this.RULES_ENDPOINT + className + '/' + context), false);
        request.send(null);
        return this._toJson(request.response);
    }
}