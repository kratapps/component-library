import { createElement } from 'lwc';

import ErrorHandlerModal from 'c/errorHandlerModal';

import { formatError } from '../../errorHandler/errorHandler';

const nbsp = '\xa0';

describe('c-error-handler-modal', () => {
    afterEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('does render error values for lwc_uiRecordApi_updateRecord_errorCode.json', async () => {
        const element = createElement('c-error-handler-modal', {
            is: ErrorHandlerModal
        });
        const { message, payload, fieldErrors } = formatError(error, undefined, false, 'somethingWentWrongMessage');
        element.label = message;
        element.message = payload;
        element.fieldErrors = fieldErrors;
        document.body.appendChild(element);
        const h1 = element.shadowRoot.querySelector('div.slds-modal__header h1');
        expect(h1.textContent).toBe(error.body.message);
        const messageElement = element.shadowRoot.querySelector('lightning-modal-body div .message');
        expect(messageElement.textContent).toContain(payload ?? '');
        (fieldErrors ?? []).forEach((it) => {
            const fieldDiv = element.shadowRoot.querySelector(`lightning-modal-body div [data-field='${it.field}']`);
            expect(fieldDiv.textContent).toContain(`${it.message}${nbsp}[${it.fieldLabel}]`);
        });
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
