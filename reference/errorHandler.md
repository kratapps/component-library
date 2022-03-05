# Error Handler

![lwc](https://img.shields.io/badge/service-yellow)

Handle errors and show either a toast or error prompt to a user.

## Installation

Deploy service with dependencies:

```
sfdx kratapps:remote:source:deploy -s https://github.com/kratapps/component-library -p src/main/default/lwc/errorHandler,src/main/default/lwc/prompt,src/main/default/lwc/errorHandlerPrompt,src/main/default/classes/LightningError.cls,src/main/default/classes/LightningError.cls-meta.xml -u myOrg
```

## Specification

Use `handleError` function to handle errors in a generic way. Pass config with the lightning element and optionally set
whether toast or prompt should be shown.

### Exports

| Name         | Arguments                                | Returns   | Description                                                     |
|--------------|------------------------------------------|-----------|-----------------------------------------------------------------|
| handleError  | error: any, [config: ProcessErrorConfig] | undefined | Handle error and show either a toast or error prompt to a user. |

### ProcessErrorConfig Type

| Name        | Type             | Required | Default | Description                                                    |
|-------------|------------------|----------|---------|----------------------------------------------------------------|
| element     | LightningElement | yes      |         | Usually the 'this' component. Required to show toast/prompt.   |
| showToast   | boolean          |          | true    | Show error toast.                                              |
| showPrompt  | boolean          |          |         | Show error prompt. Used to show more detail than toast.        |

## Example

### Basic handler

Simply import the `handleError` and call the function when error occurs. The `element` property must be a
LightningElement.

```javascript
import {processError} from "c/errorHandler";

try {
    // do your logic here
} catch (e) {
    handleError(e, {element: this});
}
```

### Handler with error prompt

Add `c-error-handler-prompt` component to your component.

When using in the `connectedCallback` hook, ensure the `c-error-handler-prompt` is already rendered otherwise the prompt
won't be shown.

```html

<c-error-handler-prompt></c-error-handler-prompt>
```

Set `showPrompt` to true.

```javascript
try {
    // do your logic here
} catch (e) {
    handleError(e, {element: this, showPrompt: true});
}
```

### Lightning Error handling

`LightningError` can be used to build serialized error in `AuraEnabled` controllers. This error is then parsed and
processed by `handleError` function.

```apex
@AuraEnabled
public static Case submitCase(Case myCase) {
    try {
        return CaseService.submitCase(myCase);
    } catch (Exception e) {
        throw new AuraHandledException(LightningError.create('Case submission failed').addError(e.getMessage()).serialize());
    }
}
```
