/*
 * BSD 3-Clause License
 *
 * Copyright (c) 2022, kratapps.com
 * See the LICENSE: https://github.com/kratapps/component-library/blob/main/LICENSE
 */

/**
 * @description Build structured errors.
 * Serialize LightningError instance for the AuraHandledException
 * and in lwc use the processError function from errorHandler.js.
 *
 * {@link https://docs.kratapps.com/component-library/error-handler}
 *
 * @author kratapps.com
 */
public class LightningError {
    @AuraEnabled
    public String message;
    @AuraEnabled
    public Integer statusCode = 400;
    @AuraEnabled
    public String errorCode;
    @AuraEnabled
    public final String enhancedErrorType = 'classes/LightningError';
    @AuraEnabled
    public final Map<String, Object> output;

    private transient List<LightningError.Error> errors = new List<LightningError.Error>();
    private transient Map<String, List<LightningError.FieldError>> fieldErrors = new Map<String, List<LightningError.FieldError>>();

    private LightningError() {
        output = new Map<String, Object>{ 'errors' => errors, 'fieldErrors' => fieldErrors };
    }

    /**
     * @description Create a new Lightning Error.
     *
     * @return a new Lightning Error.
     */
    public static LightningError create() {
        return new LightningError();
    }

    /**
     * @description Create a new Lightning Error.
     *
     * @param message the error message.
     *
     * @return a new Lightning Error.
     */
    public static LightningError create(String message) {
        LightningError error = new LightningError();
        error.setMessage(message);
        return error;
    }

    /**
     * @description Create a new Lightning Error from System.DmlException.
     *
     * @param e the DML exception.
     *
     * @return a new Lightning Error.
     */
    public static LightningError create(DmlException e) {
        LightningError error = new LightningError();
        error.setMessage(e.getMessage());
        for (Integer i = 0; i < e.getNumDml() && i < 1; i++) {
            error.setErrorCode(e.getDmlStatusCode(i));
            if (e.getDmlFields(i) != null) {
                for (SObjectField field : e.getDmlFields(i)) {
                    error.addFieldError(field, e.getDmlMessage(i), e.getDmlStatusCode(i));
                }
            } else {
                error.setMessage(e.getDmlMessage(i));
            }
        }
        return error;
    }

    /**
     * @description Add generic error to Lightning Error.
     *
     * @param message the error message.
     *
     * @return the current Lightning Error.
     */
    public LightningError addError(String message) {
        if (message != 'Script-thrown exception') {
            errors.add(new LightningError.Error(message));
        }
        return this;
    }

    /**
     * @description Add field error to Lightning Error.
     *
     * @param field the error SObject field.
     * @param message the error message.
     *
     * @return the current Lightning Error.
     */
    public LightningError addFieldError(SObjectField field, String message) {
        DescribeFieldResult dfr = field.getDescribe();
        return addFieldError(new LightningError.FieldError(message, dfr.getName(), dfr.getLabel(), null));
    }

    /**
     * @description Add field error to Lightning Error.
     *
     * @param field the error SObject field.
     * @param message the error message.
     * @param errorCode the error code. Usually a System.StatusCode value.
     *
     * @return the current Lightning Error.
     */
    public LightningError addFieldError(SObjectField field, String message, String errorCode) {
        DescribeFieldResult dfr = field.getDescribe();
        return addFieldError(new LightningError.FieldError(message, dfr.getName(), dfr.getLabel(), errorCode));
    }

    /**
     * @description Set Lightning Error message.
     *
     * @param message the error message.
     *
     * @return the current Lightning Error.
     */
    public LightningError setMessage(String message) {
        this.message = message;
        return this;
    }

    public LightningError setStatusCode(Integer statusCode) {
        this.statusCode = statusCode;
        return this;
    }

    public LightningError setErrorCode(String errorCode) {
        this.errorCode = errorCode;
        return this;
    }

    private LightningError addFieldError(LightningError.FieldError e) {
        if (!fieldErrors.containsKey(e.fieldName)) {
            fieldErrors.put(e.fieldName, new List<LightningError.FieldError>());
        }
        fieldErrors.get(e.fieldName).add(e);
        return this;
    }

    private class Error {
        @AuraEnabled
        public String message;

        private Error(String message) {
            this.message = message;
        }
    }

    private class FieldError {
        @AuraEnabled
        public String message;
        @AuraEnabled
        public String fieldName;
        @AuraEnabled
        public String fieldLabel;
        @AuraEnabled
        public String errorCode;

        private FieldError(String message, String fieldName, String fieldLabel, String errorCode) {
            this.message = message;
            this.fieldName = fieldName;
            this.fieldLabel = fieldLabel;
            this.errorCode = errorCode;
        }
    }
}