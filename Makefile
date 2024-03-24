alias=lib
alias_packaging=kratapps-prod

scratch-org:
	sf org create scratch -a ${alias} -f config/project-scratch-def.json --duration-days 30
	sf project deploy start -o ${alias}

unit-test:
	sfdx force:apex:test:run -u ${alias} --codecoverage --testlevel RunLocalTests --resultformat human

create-package:
	sfdx force:package:create --name "Component Library" --packagetype Unlocked --path "src/main/default/" -v ${alias_packaging}

create-package-version:
	sfdx force:package:version:create --codecoverage --package "Component Library" --definitionfile config/project-scratch-def.json --wait 60 --installationkeybypass -v ${alias_packaging}
	
lint:
	npm run lint:lwc
	sfdx scanner:run -t src/ --engine "pmd" --severity-threshold 3