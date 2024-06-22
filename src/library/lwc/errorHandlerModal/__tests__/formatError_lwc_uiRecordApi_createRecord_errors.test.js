import { createElement } from 'lwc';

import { formatError } from 'c/errorHandler';

import ErrorHandlerModal from '../errorHandlerModal';

const nbsp = '\xa0';

describe('c-error-handler', () => {
    afterEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('does render error values for lwc_uiRecordApi_updateRecord_errors.json', async () => {
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
