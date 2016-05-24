# Nutforms Rules Web Client

https://travis-ci.org/jSquirrel/nutforms-rules-web-client.svg?branch=master

Client side implementation of business rules integration into the Nutforms library.

The Nutforms library consists of following modules:

* [Nutforms Server](https://github.com/jSquirrel/nutforms-server)
* [Nutforms Rules Server](https://github.com/jSquirrel/nutforms-rules-server)
* [Nutforms Web Client](https://github.com/jSquirrel/nutforms-web-client)
* [Nutforms Rules Web Client](https://github.com/jSquirrel/nutforms-rules-web-client)

## Installation

The library is published as an [npm](https://www.npmjs.com/) module, thus it can installed from CLI:

```
npm install nutforms-rules-web-client --save
```

Alternatively, it can be cloned and built manually:

```
git clone git@github.com:jSquirrel/nutforms-rules-web-client.git
cd nutforms-rules-web-client
webpack
```

Afterwards, file `dist/nutforms-rules-web-client.js` will be created, which contains the compiled version of the library.

## Running tests

Tests can be executed via `npm`:

```
npm test
```

## Contributing

Feel free to contribute to the project by reporting [issues](https://github.com/jSquirrel/nutforms-rules-web-client/issues)
or creating [pull requests](https://github.com/jSquirrel/nutforms-rules-web-client/pulls).

## License

This software is provided under [MIT License](https://opensource.org/licenses/MIT).

## Documentation

This module is a client side implementation of the business rules integration. It enhances the Rich Model with the validation support and defines the rule aspect weaver. The linking with the core Nutforms library is based on event system.

*Note: in order to use the rule module, Nutforms library must be loaded into the project as well.*

### Architecture

After the Rich Model is built, this module reacts to the fired event (`MODEL_BUILT`) and applies slight modifications onto the model. Perhaps the most important one is adding a [Validation](https://github.com/jSquirrel/nutforms-rules-web-client/blob/master/src/model/Validation.js) class to each [attribute](https://github.com/jSquirrel/nutforms-web-client/blob/master/src/model/Attribute.js) and the [model](https://github.com/jSquirrel/nutforms-web-client/blob/master/src/model/Model.js) itself. This class is responsible for holding the localized feedback messages.

### Aspect weaving

When the model is enriched with desired functionality, the rules for current business context are loaded from the [server](https://github.com/jSquirrel/nutforms-rules-server). These are afterwards processed by the aspect weaver, which transforms them into JavaScript functions and binds them to corresponding attributes/model. The functions act as [listeners](https://github.com/jSquirrel/nutforms-web-client/blob/master/src/observer/Observable.js) of events which are distinguished by the type of the rule (`ATTRIBUTE_CHANGED`, or `MODEL_SUBMITTED`, respectively).

Apart from validation rules, the system also supports the declaration of security rules, which controls the set of user-editable attributes. When a security rule is loaded (before the form is rendered) and its precondition is evaluated as `false`, the `readOnly` flag is set to respective attributes, which causes loading widgets that do not allow user to edit the value during the form generation phase.

### Validation

When a value of a field is changed, or the form is submitted, validation functions are executed. From the result, a proper [state](https://github.com/jSquirrel/nutforms-rules-web-client/blob/master/src/constants/ValidationState.js) is set to the the attribute/model, and if the constraint was evaluated as `false`, feedback message is also loaded asynchronously from the server in a language according to current *user context*. The field state can be one of the following:

* `UNTOUCHED` - indicates that the used has not yet interacted with this field
* `PENDING` - indicates that a value was changed and validation is in progress
* `VALID` - the current value does not violate any rule bound to this field
* `INVALID` - the current value violates at least one of the rules bound to this field
* `BLOCKED` - displaying the feedback message for this field is suppressed. This applies e.g. for multi-field constraints with AND operators - when a user enters an invalid value into the first field, but has not yet interacted with the second field, the feedback will not be shown, even though the rule was evaluated as `false`. As soon as the user interacts with the second field, the message will be shown and the state will be changed to either `VALID`, or `INVALID`.

### Form submit

The callback for the form submit is executed after the `FORM_SUBMITTED` event is fired.

* Fistly, all values from the form are set to the respective attributes, which triggers field validation.
* Then, model-related rules are executed in the same way, changing the [state](https://github.com/jSquirrel/nutforms-rules-web-client/blob/master/src/constants/ValidationState.js) of the model to a proper value according to the result of the rule evaluation.
* Lastly, validity check is performed, which queries all attributes and the model itself.
* If the model and all its attributes are in a `VALID` state, event `MODEL_VALID` is fired.

## Using the library

In order to use the library, both the core Nutforms modules ([server](https://github.com/jSquirrel/nutforms-server) and [web-client](https://github.com/jSquirrel/nutforms-web-client)) and the [rule server](https://github.com/jSquirrel/nutforms-rules-server) must be loaded into the application. User guides are part of documentation of these modules. 

Then, both the core and rules client scripts must be loaded into the page:

```javascript
<script src="../../dist/nutforms.js"></script>
<script src="../../dist/nutforms-rules-web-client.js"></script>
```

After the scripts are loaded, configurations of the core part of the library must be done in order to be able to generate the form ([see documentation](https://github.com/jSquirrel/nutforms-web-client/blob/master/docs/en/usage.md)). After that, the form can be automatically generated using the following script (taken from the [nutforms-web-client](https://github.com/jSquirrel/nutforms-web-client) documentation):

```javascript
// Generate the form
Nutforms.generateForm(
    document.getElementById("form"),                // HTML Element
    "cz.cvut.fel.nutforms.example.model.Bug",       // Entity name
    "cz_CS",                                        // Locale
    1,                                              // Entity id
    "cz.cvut.fel.nutforms.example.model.Bug/new",   // Layout name
    mappingFunction,                                // Mapping function
    "new"                                           // Business context
);
```

From the business rule perspective, the most important argument are the context and the entity name. These together are used to determine the set of applicable business rules. The [guide to defining aspects](https://github.com/jSquirrel/nutforms-rules-server#rule-aspect-definition) or [example application](https://github.com/jSquirrel/nutforms-example) can be seen for reference.

### Rules related events

This module adds a portion of new events to the system, which can be listened to. Below is a list of these events, including a brief description and a list of parameters these events pass to the callback functions:

* `ATTRIBUTE_VALIDATED` - fired when a validation feedback is received after the evaluation of a validation function on an attribute
  * `attribute` - reference to the validated  [attribute](https://github.com/jSquirrel/nutforms-web-client/blob/master/src/model/Attribute.js)
* `MODEL_VALIDATED` - the same as above, but applies for model related rules
  * `model` - reference to the validated [model](https://github.com/jSquirrel/nutforms-web-client/blob/master/src/model/Model.js)
* `MODEL_VALID` - fired only if the model and all its attributes are in a `VALID` state
  * `model` - the [model](https://github.com/jSquirrel/nutforms-web-client/blob/master/src/model/Model.js) of the submitted form
