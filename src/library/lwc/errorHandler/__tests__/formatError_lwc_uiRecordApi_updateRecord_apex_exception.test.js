import { formatError } from 'c/errorHandler';

const somethingWentWrongMessage = '===== Something went wrong. =====';

describe('c-error-handler', () => {
    it('does format lwc_uiRecordApi_updateRecord_apex_exception.json', () => {
        const ui = formatError(error, undefined, false, somethingWentWrongMessage);
        expect(ui.message).toBe(error.body.message);
        expect(ui.payload).toBe(somethingWentWrongMessage + '\n');
        expect(ui.fieldErrors).toHaveLength(0);
        expect(ui.handlerMethod).toBe('handleError');
    });

    it('does format unknown lwc_uiRecordApi_updateRecord_apex_exception.json', () => {
        const ui = formatError(error, undefined, true, somethingWentWrongMessage);
        expect(ui.message).toBe(error.body.message);
        expect(ui.payload).toBe(somethingWentWrongMessage + '\n');
        expect(ui.fieldErrors).toHaveLength(0);
        expect(ui.handlerMethod).toBe('somethingWentWrong');
    });
});

const error = {
    status: 403,
    body: {
        message: 'An error occurred while trying to update the record. Please try again.',
        statusCode: 403,
        enhancedErrorType: 'RecordError',
        output: {
            errors: [
                {
                    constituentField: null,
                    duplicateRecordError: null,
                    errorCode: 'CANNOT_INSERT_UPDATE_ACTIVATE_ENTITY',
                    field: null,
                    fieldLabel: null,
                    message:
                        'UserTrigger: execution of BeforeUpdate\n\ncaused by: System.DmlException: Insert failed. First exception on row 0; first error: REQUIRED_FIELD_MISSING, Required fields are missing: [Username, LastName, Email, Alias, TimeZoneSidKey, LocaleSidKey, EmailEncodingKey, ProfileId, LanguageLocaleKey]: [Username, LastName, Email, Alias, TimeZoneSidKey, LocaleSidKey, EmailEncodingKey, ProfileId, LanguageLocaleKey]\n\nTrigger.UserTrigger: line 14, column 1'
                }
            ],
            fieldErrors: {}
        },
        id: '1826616658'
    },
    headers: {},
    ok: false,
    statusText: 'Unexpected HTTP Status Code: 403',
    errorType: 'fetchResponse'
};
