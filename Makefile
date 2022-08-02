alias=lib
alias_packaging=kratapps-prod

scratch-org:
	sfdx force:org:create -s -a ${alias} -f config/project-scratch-def.json -d 30
	sfdx force:source:push -u ${alias}

unit-test:
	sfdx force:apex:test:run -u ${alias} --codecoverage --testlevel RunLocalTests --resultformat human

create-package:
	sfdx force:package:create --name "Component Library" --packagetype Unlocked --path "src/main/default/" -v ${alias_packaging}

create-package-version:
	sfdx force:package:version:create --codecoverage --package "Component Library" --definitionfile config/project-scratch-def.json --wait 60 --installationkeybypass -v ${alias_packaging}
	
lint:
	npm run lint:lwc
	sfdx scanner:run -t src/ --engine "pmd" --severity-threshold 3