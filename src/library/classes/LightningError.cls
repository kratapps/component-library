/*
 * BSD 3-Clause License
 *
 * Copyright (c) 2022, kratapps.com
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * 3. Neither the name of the copyright holder nor the names of its
 *    contributors may be used to endorse or promote products derived from
 *    this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/**
 * @author kratapps.com
 *
 * @description Build structured errors.
 * Serialize LightningError instance for the AuraHandledException
 * and in lwc use the processError function from errorHandler.js.
 *
 * @see https://docs.kratapps.com/component-library/error-handler
 */
public class LightningError {
    private static final String SOMETHING_WENT_WRONG_MESSAGE = 'Something went wrong';
    private List<LightningError.Error> errors = new List<LightningError.Error>();
    private Map<String, List<LightningError.FieldError>> fieldErrors = new Map<String, List<LightningError.FieldError>>();
    private String message = SOMETHING_WENT_WRONG_MESSAGE;
    private String enhancedErrorType = 'LightningError';
    private Integer statusCode = 400;

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
     * @description Add generic error to Lightning Error.
     *
     * @param message the error message.
     *
     * @return the current Lightning Error.
     */
    public LightningError addError(String message) {
        errors.add(new LightningError.Error(message));
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
        return addFieldError(new LightningError.FieldError(message, dfr.getName(), dfr.getLabel()));
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

    /**
     * @description Serialize the Lightning Error which can be thrown using the AuraHandledException
     * and handled automatically using the errorHandler component.
     *
     * @return the serialized Lightning Error.
     */
    public String serialize() {
        return serialize(message, errors, fieldErrors);
    }

    public AuraHandledException toAuraHandledException() {
        return new AuraHandledException(serialize());
    }

    private LightningError addFieldError(LightningError.FieldError e) {
        if (!fieldErrors.containsKey(e.fieldName)) {
            fieldErrors.put(e.fieldName, new List<LightningError.FieldError>());
        }
        fieldErrors.get(e.fieldName).add(e);
        return this;
    }

    private String serialize(String message, List<LightningError.Error> errors, Map<String, List<LightningError.FieldError>> fieldErrors) {
        Map<String, Object> body = new Map<String, Object>();
        body.put('message', message);
        body.put('statusCode', statusCode);
        body.put('enhancedErrorType', enhancedErrorType);
        body.put('output', new Map<String, Object>{ 'errors' => errors, 'fieldErrors' => fieldErrors });
        return JSON.serialize(body);
    }

    private class Error {
        private String message;
        private Error(String message) {
            this.message = message;
        }
    }

    private class FieldError {
        private String message;
        private String fieldName;
        private String fieldLabel;
        private FieldError(String message, String fieldName, String fieldLabel) {
            this.message = message;
            this.fieldName = fieldName;
            this.fieldLabel = fieldLabel;
        }
    }
}