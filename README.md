# Nutforms Rules Web Client

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

This module is a client side implementation of the business rule support. It enhances the Rich Model with the validation support and defines the rule aspect weaver. The linking with the core Nutforms library is based on an event system.

*Note: in order to use the rule module, Nutforms library must be loaded into the project as well.*

### Architecture

After the Rich Model is built, this module reacts to the fired event and applies slight modifications onto the model. Perhaps the most important one is adding a [Validation](https://github.com/jSquirrel/nutforms-rules-web-client/blob/master/src/model/Validation.js) class to each [attribute](https://github.com/jSquirrel/nutforms-web-client/blob/master/src/model/Attribute.js) and the [model](https://github.com/jSquirrel/nutforms-web-client/blob/master/src/model/Model.js) itself. This class is responsible for holding the localized feedback messages.

### Aspect weaving

When the model is enriched with desired functionality, the rules for current business context are loaded from the [server](https://github.com/jSquirrel/nutforms-rules-server). These are afterwards processed by the aspect weaver, which transforms them into JavaScript functions and binds them to corresponding attributes/model. The functions act as [listeners](https://github.com/jSquirrel/nutforms-web-client/blob/master/src/observer/Observable.js) of events which are distinguished by the type of the rule (`ATTRIBUTE_CHANGED`, or `MODEL_SUBMITTED`, respectively).

Apart from the validation rules, the system also supports the declaration of security rules, which controls the set of user-editable attributes. When a security rule is loaded (before the form is rendered) and its precondition is evaluated as `false`, the `readOnly` flag is set to respective attributes, which causes loading widgets that do not allow user to edit the value during the form generation phase.

### Validation

When a value of a field is changed, or the form is submitted, validation functions are executed. From the result, a proper [state](https://github.com/jSquirrel/nutforms-rules-web-client/blob/master/src/constants/ValidationState.js) is set to the the attribute/model, and if the constraint was evaluated as `false`, feedback message is loaded asynchronously from the server in a language according to current *user context*. The field state can be one of the following:

* `UNTOUCHED` - indicates that the used has not yet interacted with this field
* `PENDING` - indicates that a value was changed and validation is in progress
* `VALID` - the current value does not violate any rule bound to this field
* `INVALID` - the current value violates at least one of the rules bound to this field
* `BLOCKED` - displaying the feedback message for this field is suppressed. This applies e.g. for multi-field constraints with AND operators - when a user enters an invalid value into the first field, but has not yet interacted with the second field, the feedback will not be shown, even though the rule was evaluated as `false`. As soon as the user interacts with the second field, the message will be shown and the state will be changed to either `VALID`, or `INVALID`.

### Form submit

The callback for the for submit is executed after the `FORM_SUBMITTED` event is fired.

* Fistly, all values from the form are set to the respective attributes, which triggers field validation.
* Then, model-related rules are executed in the same way, changing the [state](https://github.com/jSquirrel/nutforms-rules-web-client/blob/master/src/constants/ValidationState.js) of the model to a proper value according to the result of the rule.
* Lastly, validity check is performed, which queries all attributes and the model itself.
* If all attributes and the model itself are in a `VALID` state, event `MODEL_VALID` is fired.

## Using the library
