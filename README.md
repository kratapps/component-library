# Component Library

Custom LWC and Apex Components.

## Installation
Use our sfdx plugin to install all components without cloning:
```
sfdx kratapps:remote:source:deploy -s https://github.com/kratapps/component-library -p src/main/default/lwc -u myOrg
```
or only some components:
```
sfdx kratapps:remote:source:deploy -s https://github.com/kratapps/component-library -p src/main/default/lwc/spinner -u myOrg
```
or clone the project and deploy using standard sfdx command:
```shell
git clone https://github.com/kratapps/lwc-component.git
cd component-library
sfdx force:source:deploy -p src/main/default/lwc -u myOrg
```

## Components
* Alert
* Error Handler Prompt
* Prompt
* Spinner

## Services
* errorHandler - process structured errors for better UX

## Classes
* LightningError - build structured errors for better UX
