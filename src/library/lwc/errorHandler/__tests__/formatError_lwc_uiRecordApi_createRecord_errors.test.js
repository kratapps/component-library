import { formatError } from 'c/errorHandler';

const somethingWentWrongMessage = '===== Something went wrong. =====';

describe('c-error-handler', () => {
    it('does format lwc_uiRecordApi_createRecord_errors.json', () => {
        const ui = formatError(error, undefined, false, somethingWentWrongMessage);
        expect(ui.message).toBe(error.body.message);
        expect(ui.payload).toBe('portal user already exists for contact\n');
        expect(ui.fieldErrors).toHaveLength(0);
        expect(ui.handlerMethod).toBe('handleError');
    });

    it('does format unknown lwc_uiRecordApi_createRecord_errors.json', () => {
        const ui = formatError(error, undefined, true, somethingWentWrongMessage);
        expect(ui.message).toBe(error.body.message);
        expect(ui.payload).toBe('portal user already exists for contact\n');
        expect(ui.fieldErrors).toHaveLength(0);
        expect(ui.handlerMethod).toBe('somethingWentWrong');
    });
});

const error = {
    status: 400,
    body: {
        message: 'An error occurred while trying to update the record. Please try again.',
        statusCode: 400,
        enhancedErrorType: 'RecordError',
        output: {
            errors: [
                {
                    constituentField: null,
                    duplicateRecordError: null,
                    errorCode: 'PORTAL_USER_ALREADY_EXISTS_FOR_CONTACT',
                    field: null,
                    fieldLabel: null,
                    message: 'portal user already exists for contact'
                }
            ],
            fieldErrors: {}
        },
        id: '-1811437745'
    },
    headers: {},
    ok: false,
    statusText: 'Bad Request',
    errorType: 'fetchResponse'
};
