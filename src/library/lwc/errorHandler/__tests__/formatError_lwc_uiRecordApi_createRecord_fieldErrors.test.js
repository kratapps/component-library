import { formatError } from 'c/errorHandler';

const somethingWentWrongMessage = '===== Something went wrong. =====';

describe('c-error-handler', () => {
    it('does format lwc_uiRecordApi_updateRecord_fieldErrors.json', () => {
        const ui = formatError(error, undefined, false, somethingWentWrongMessage);
        expect(ui.message).toBe(error.body.message);
        expect(ui.payload).toBe('');
        expect(ui.fieldErrors).toHaveLength(8);
        expect(ui.handlerMethod).toBe('handleError');
    });

    it('does format unknown lwc_uiRecordApi_updateRecord_fieldErrors.json', () => {
        const ui = formatError(error, undefined, true, somethingWentWrongMessage);
        expect(ui.message).toBe(error.body.message);
        expect(ui.payload).toBe('');
        expect(ui.fieldErrors).toHaveLength(8);
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
