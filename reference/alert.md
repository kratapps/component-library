# Alert

![lwc](https://img.shields.io/badge/lwc-blue)

Wrapper for the [slds alert](https://www.lightningdesignsystem.com/components/alert/).

## Installation

Deploy Alert:

```
sfdx kratapps:remote:source:deploy -s https://github.com/kratapps/component-library -p src/main/default/lwc/alert -u myOrg
```

## Specification

### Attributes

| Name            | Type                                | Required | Default | Description                                        |
|-----------------|-------------------------------------|----------|---------|----------------------------------------------------|
| variant         | info / warning / error / offline    |          | info    | Variant of the alert.                              |
| closeable       | boolean                             |          | false   | If true, the alert can be closed by a user action. |
| hidden          | boolean                             |          | false   | Show/hide the alert.                               |
| iconDescription | string                              |          |         | Icon title.                                        |

## Example

```html

<c-alert variant="warning">
    Alert message or component.
</c-alert>
```
