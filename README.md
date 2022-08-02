# Component Library

[![GitHub](https://img.shields.io/badge/GitHub-Public-black?logo=github)](https://github.com/kratapps/component-library)

Custom Salesforce LWC and Apex Components.

## Installation

Use our sfdx plugin to install all components without cloning:

```text
sfdx kratapps:remote:source:deploy -s https://github.com/kratapps/component-library -p src/main/default -u myOrg
```

or only some components:

```text
sfdx kratapps:remote:source:deploy -s https://github.com/kratapps/component-library -p src/main/default/lwc/spinner -u myOrg
```

or clone the project and deploy using standard sfdx command.

## Documentation

Full documentation available at [kratapps.com/component-library](https://kratapps.com/component-library).

### LWC Components

- [Alert](https://kratapps.com/component-library/alert)
- Error Handler Prompt
- [Prompt (deprecated)](https://kratapps.com/component-library/prompt)
- [Spinner](https://kratapps.com/component-library/spinner)

### LWC Services

- [Error Handler](https://kratapps.com/component-library/error_handler) - handle errors and show error messages to users

### Apex Classes

- [LightningError](https://kratapps.com/component-library/error_handler) - build serialized error in `AuraEnabled` controllers
