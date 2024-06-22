/*
 * BSD 3-Clause License
 *
 * Copyright (c) 2022, kratapps.com
 * See the LICENSE: https://github.com/kratapps/component-library/blob/main/LICENSE
 */

/**
 * @description Generic response wrapper for AuraEnabled methods.
 * {@link https://docs.kratapps.com/component-library/error-handler}
 *
 * @author  kratapps.com
 */
public class LightningResponse {
    @AuraEnabled
    public Object data;
    @AuraEnabled
    public Map<String, Object> error;

    public static LightningResponse send() {
        LightningResponse response = new LightningResponse();
        response.data = 'ok';
        return response;
    }

    public static LightningResponse send(Object responseData) {
        LightningResponse response = new LightningResponse();
        response.data = responseData;
        return response;
    }

    public static LightningResponse error(String errorMessage) {
        return error(LightningError.create(errorMessage));
    }

    public static LightningResponse error(LightningError error) {
        LightningResponse response = new LightningResponse();
        response.error = new Map<String, Object>{ 'body' => error, 'ok' => false };
        return response;
    }

    public static LightningResponse somethingWentWrong(Exception e) {
        if (e instanceof DmlException) {
            DmlException dmlE = (DmlException) e;
            for (Integer i = 0; i < dmlE.getNumDml(); i++) {
                // Unexpected error, we will hide the implementation details with AuraHandledException.
                if (dmlE.getDmlType(i) == StatusCode.CANNOT_INSERT_UPDATE_ACTIVATE_ENTITY) {
                    throw new AuraHandledException(e.getMessage());
                }
            }
            return LightningResponse.error(LightningError.create(dmlE));
        }
        throw new AuraHandledException(e.getMessage());
    }
}