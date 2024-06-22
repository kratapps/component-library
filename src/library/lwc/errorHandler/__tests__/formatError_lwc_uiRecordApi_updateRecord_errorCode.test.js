import { formatError, handleError } from 'c/errorHandler';

const somethingWentWrongMessage = '===== Something went wrong. =====';

describe('c-error-handler', () => {
    it('does format lwc_uiRecordApi_updateRecord_errorCode.json', async () => {
        const ui = formatError(error, undefined, false, somethingWentWrongMessage);
        expect(ui.message).toBe(error.body.message);
        expect(ui.payload).toBeUndefined();
        expect(ui.fieldErrors).toHaveLength(0);
        expect(ui.handlerMethod).toBe('handleError');
    });

    it('does format unknown lwc_uiRecordApi_updateRecord_errorCode.json', () => {
        const ui = formatError(error, undefined, true, somethingWentWrongMessage);
        expect(ui.message).toBe(error.body.message);
        expect(ui.payload).toBeUndefined();
        expect(ui.fieldErrors).toHaveLength(0);
        expect(ui.handlerMethod).toBe('somethingWentWrong');
    });
});

const error = {
    status: 400,
    body: {
        message: "'apiName' value should not be provided for PATCH.",
        statusCode: 400,
        errorCode: 'ILLEGAL_QUERY_PARAMETER_VALUE',
        id: '-1433164946'
    },
    headers: {},
    ok: false,
    statusText: 'Bad Request',
    errorType: 'fetchResponse'
};
