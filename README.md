# Component Library

Custom Salesforce LWC and Apex Components.

## Installation
Use our sfdx plugin to install all components without cloning:
```
sfdx kratapps:remote:source:deploy -s https://github.com/kratapps/component-library -p src/main/default -u myOrg
```
or only some components:
```
sfdx kratapps:remote:source:deploy -s https://github.com/kratapps/component-library -p src/main/default/lwc/spinner -u myOrg
```
or clone the project and deploy using standard sfdx command:
```shell
git clone https://github.com/kratapps/component-library.git
cd component-library
sfdx force:source:deploy -p src/main/default/lwc -u myOrg
```

## Documentation
Full documentation available at [kratapps.com/component-library](https://kratapps.com/component-library).

### LWC Components
* Alert
* Error Handler Prompt
* Prompt
* Spinner

### LWC Services
* errorHandler - handle errors and show error messages to users

### Apex Classes
* LightningError - build serialized error in `AuraEnabled` controllers
