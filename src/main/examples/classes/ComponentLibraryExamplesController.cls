public with sharing class ComponentLibraryExamplesController {
    @AuraEnabled
    public static void throwLightningError() {
        throw new AuraHandledException(LightningError.create('My error message')
                .addFieldError(Account.Name, 'Field is required.').serialize());
    }
}