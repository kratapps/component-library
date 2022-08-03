# Prompt

![deprecated](https://img.shields.io/badge/DEPRECATED-red)
![lwc](https://img.shields.io/badge/LWC-component-blue)

> This component was deprecated.
> Use the standard
> [lightning-alert](https://developer.salesforce.com/docs/component-library/bundle/lightning-alert/documentation)
> component.

Wrapper for the [slds prompt](https://www.lightningdesignsystem.com/components/prompt/).

Prompt notice grabs the user’s attention & alerts them of system-related issues/updates.

## Installation

Deploy Prompt:

```text
sfdx kratapps:remote:source:deploy -s https://github.com/kratapps/component-library -p src/main/deprecated/lwc/prompt -u myOrg
```

## Specification

### Attributes

| Name         | Type                             | Required | Default          | Description                                       |
|--------------|----------------------------------|----------|------------------|---------------------------------------------------|
| title        | string                           | true     |                  | Prompt title.                                     |
| variant      | info / warning / error / offline |          | info             | Prompt variant.                                   |
| show         | boolean                          |          | false            | Show/hide prompt.                                 |
| disableClose | boolean                          |          | false            | Disable the close button in the top right corner. |
| buttons      | PromptButton[]                   |          | one close button | Footer button actions.                            |

### PromptButton Type

| Name      | Type   | Required | Default | Description                                                                                                         |
|-----------|--------|----------|---------|---------------------------------------------------------------------------------------------------------------------|
| value     | string | yes      |         | The value for the button element.                                                                                   |
| label     | string | yes      |         | The text to be displayed inside the button.                                                                         |
| variant   | string | yes      | neutral | Accepted variants include base, neutral, brand, brand-outline, destructive, destructive-text, inverse, and success. |
| eventName | string |          |         | Show error prompt. Used to show more detail than toast.                                                             |

## Example

```html
<c-prompt
  variant="error"
  title="Prompt Title"
  show="{_showPrompt}"
  onclose="{handlePromptCloseClick}"
>
  Prompt Content
</c-prompt>
```

```javascript
export default class MyComponent extends LightningElement {
  @track _showPrompt = false;

  showPrompt() {
    this._showPrompt = true;
  }

  handlePromptCloseClick() {
    this._showPrompt = false;
  }
}
```
