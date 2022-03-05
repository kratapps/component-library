# Prompt

![lwc](https://img.shields.io/badge/lwc-blue)

Prompt notice grabs the user’s attention & alerts them of system-related issues/updates.

## Installation

Deploy Prompt:

```
sfdx kratapps:remote:source:deploy -s https://github.com/kratapps/component-library -p src/main/default/lwc/prompt -u myOrg
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

<c-prompt variant="error" title="Prompt Title" show={_showPrompt} onclose={handlePromptCloseClick}>
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
