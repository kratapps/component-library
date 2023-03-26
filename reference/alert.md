# Alert

![lwc](https://img.shields.io/badge/LWC-component-blue)

Wrapper for the [slds alert](https://www.lightningdesignsystem.com/components/alert/).

Alert banners communicate a state that affects the entire system, not just a feature or page. It persists over a session and appears without the user initiating the action.

## Installation

Deploy Alert:

```text
sfdx kratapps:remote:source:deploy -s https://github.com/kratapps/component-library -p src/main/default/lwc/alert -u myOrg
```

## Specification

Components

- [lwc/alert](https://github.com/kratapps/component-library/blob/main/src/main/default/lwc/alert)

### Attributes

| Name            | Type                             | Required | Default | Description                                        |
| --------------- | -------------------------------- | -------- | ------- | -------------------------------------------------- |
| variant         | info / warning / error / offline |          | info    | Variant of the alert.                              |
| closeable       | boolean                          |          | false   | If true, the alert can be closed by a user action. |
| hidden          | boolean                          |          | false   | Show/hide the alert.                               |
| iconDescription | string                           |          |         | Icon title.                                        |

## Example

```html
<c-alert variant="warning"> Alert message or component. </c-alert>
```
