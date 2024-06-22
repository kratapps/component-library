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

    it('does render error values for lwc_uiRecordApi_updateRecord_fieldErrors.json', async () => {
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
            errors: [],
            fieldErrors: {
                ProfileId: [
                    {
                        constituentField: null,
                        duplicateRecordError: null,
                        errorCode: 'REQUIRED_FIELD_MISSING',
                        field: 'ProfileId',
                        fieldLabel: 'Profile ID',
                        message:
                            'Required fields are missing: [Username, Email, Alias, TimeZoneSidKey, LocaleSidKey, EmailEncodingKey, ProfileId, LanguageLocaleKey]'
                    }
                ],
                Email: [
                    {
                        constituentField: null,
                        duplicateRecordError: null,
                        errorCode: 'REQUIRED_FIELD_MISSING',
                        field: 'Email',
                        fieldLabel: 'Email',
                        message:
                            'Required fields are missing: [Username, Email, Alias, TimeZoneSidKey, LocaleSidKey, EmailEncodingKey, ProfileId, LanguageLocaleKey]'
                    }
                ],
                LocaleSidKey: [
                    {
                        constituentField: null,
                        duplicateRecordError: null,
                        errorCode: 'REQUIRED_FIELD_MISSING',
                        field: 'LocaleSidKey',
                        fieldLabel: 'Locale',
                        message:
                            'Required fields are missing: [Username, Email, Alias, TimeZoneSidKey, LocaleSidKey, EmailEncodingKey, ProfileId, LanguageLocaleKey]'
                    }
                ],
                TimeZoneSidKey: [
                    {
                        constituentField: null,
                        duplicateRecordError: null,
                        errorCode: 'REQUIRED_FIELD_MISSING',
                        field: 'TimeZoneSidKey',
                        fieldLabel: 'Time Zone',
                        message:
                            'Required fields are missing: [Username, Email, Alias, TimeZoneSidKey, LocaleSidKey, EmailEncodingKey, ProfileId, LanguageLocaleKey]'
                    }
                ],
                LanguageLocaleKey: [
                    {
                        constituentField: null,
                        duplicateRecordError: null,
                        errorCode: 'REQUIRED_FIELD_MISSING',
                        field: 'LanguageLocaleKey',
                        fieldLabel: 'Language',
                        message:
                            'Required fields are missing: [Username, Email, Alias, TimeZoneSidKey, LocaleSidKey, EmailEncodingKey, ProfileId, LanguageLocaleKey]'
                    }
                ],
                Username: [
                    {
                        constituentField: null,
                        duplicateRecordError: null,
                        errorCode: 'REQUIRED_FIELD_MISSING',
                        field: 'Username',
                        fieldLabel: 'Username',
                        message:
                            'Required fields are missing: [Username, Email, Alias, TimeZoneSidKey, LocaleSidKey, EmailEncodingKey, ProfileId, LanguageLocaleKey]'
                    }
                ],
                Alias: [
                    {
                        constituentField: null,
                        duplicateRecordError: null,
                        errorCode: 'REQUIRED_FIELD_MISSING',
                        field: 'Alias',
                        fieldLabel: 'Alias',
                        message:
                            'Required fields are missing: [Username, Email, Alias, TimeZoneSidKey, LocaleSidKey, EmailEncodingKey, ProfileId, LanguageLocaleKey]'
                    }
                ],
                EmailEncodingKey: [
                    {
                        constituentField: null,
                        duplicateRecordError: null,
                        errorCode: 'REQUIRED_FIELD_MISSING',
                        field: 'EmailEncodingKey',
                        fieldLabel: 'Email Encoding',
                        message:
                            'Required fields are missing: [Username, Email, Alias, TimeZoneSidKey, LocaleSidKey, EmailEncodingKey, ProfileId, LanguageLocaleKey]'
                    }
                ]
            }
        },
        id: '-1811437745'
    },
    headers: {},
    ok: false,
    statusText: 'Bad Request',
    errorType: 'fetchResponse'
};
