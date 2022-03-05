alias=lib

scratch-org:
	make create-scratch-org
	sfdx force:source:push -u ${lib}

create-scratch-org:
	sfdx force:org:create -s -a ${lib} -f config/project-scratch-def.json -d 30

unit-test:
	sfdx force:apex:test:run -u ${lib} --codecoverage --testlevel RunLocalTests --resultformat human