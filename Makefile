alias=lib

scratch-org:
	make create-scratch-org
	sfdx force:source:push -u ${alias}

create-scratch-org:
	sfdx force:org:create -s -a ${alias} -f config/project-scratch-def.json -d 30

unit-test:
	sfdx force:apex:test:run -u ${alias} --codecoverage --testlevel RunLocalTests --resultformat human