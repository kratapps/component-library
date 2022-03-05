/**
 * Build structured errors.
 * Serialize LightningError instance for the AuraHandledException 
 * and in lwc use the processError function from errorHandler.js.
 *
 * @author  kratapps.com
 * @date    2021-11-07
 */
global class LightningError {
    private List<LightningError.Error> errors = new List<LightningError.Error>();
    private Map<String, List<LightningError.FieldError>> fieldErrors = new Map<String, List<LightningError.FieldError>>();
    private String message;
    private class Error {
        private String message;
        private Error(String message) {
            this.message = message;
        }
    }
    private class FieldError {
        private String message;
        private String field;
        private String fieldLabel;
        private FieldError(String message, String field, String fieldLabel) {
            this.message = message;
            this.field = field;
            this.fieldLabel = fieldLabel;
        }
    }
    global LightningError(String message) {
        this.message = message;
    }
    global LightningError addError(String message) {
        errors.add(new LightningError.Error(message));
        return this;
    }
    global LightningError addFieldError(String message, SObjectField f) {
        DescribeFieldResult dfr = f.getDescribe();
        return addFieldError(new LightningError.FieldError(message, dfr.getName(), dfr.getLabel()));
    }
    private LightningError addFieldError(LightningError.FieldError e) {
        if (!fieldErrors.containsKey(e.field)) {
            fieldErrors.put(e.field, new List<LightningError.FieldError>());
        }
        fieldErrors.get(e.field).add(e);
        return this;
    }
    global String serialize() {
        return serialize(message, errors, fieldErrors);
    }
    private String serialize(String message, List<LightningError.Error> errors, Map<String, List<LightningError.FieldError>> fieldErrors) {
        Map<String, Object> body = new Map<String, Object>();
        body.put('message', message);
        body.put('statusCode', 400);
        body.put('enhancedErrorType', 'LightningError');
        body.put('output', new Map<String, Object>{
                'errors' => errors,
                'fieldErrors' => fieldErrors
        });
        return JSON.serialize(body);
    }
}
