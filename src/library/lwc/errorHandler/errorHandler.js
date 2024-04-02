/*
 * BSD 3-Clause License
 *
 * Copyright (c) 2022, kratapps.com
 * See the LICENSE: https://github.com/kratapps/component-library/blob/main/LICENSE
 */

/**
 * @file    Generic Error Handler.
 *
 * @link    https://docs.kratapps.com/component-library/error-handler
 *
 * @author  kratapps.com
 */
import { LightningElement } from 'lwc';

import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import ErrorHandlerModal from 'c/errorHandlerModal';

const debouncedShowToastEvent = debounced(showToastEvent);
const debouncedShowErrorModal = debounced(showErrorModal);

let somethingWentWrongLabel = 'Something went wrong.';
try {
    somethingWentWrongLabel = require('@salesforce/label/SomethingWentWrong');
} catch (ignored) {
    // Label probably does not exist.
}

/**
 * @typedef {Object} ErrorHandlerOptions
 * @property {LightningElement | undefined} element - Usually the 'this' component. Required to show toast/prompt.
 * @property {'modal' | 'toast' | string | undefined} [type] - Default is 'modal' for 'somethingWentWrong' and 'toast' for 'handleError'.
 * @property {boolean | undefined} [disableDebounce] - By default, show only one error if multiple errors handled within a second. Set to true to disable debouncing.
 * @property {string | undefined} [somethingWentWrongMessage] - Generic message to show when unexpected error is handled. Default: "Something went wrong.".
 * @property {ErrorHandlerAction[] | undefined} [actions] - List of error handler footer action buttons.
 * @property {Logger | undefined} [logger] - Logger. Default logger only prints to console. Use custom logger to persist logs.
 */

/**
 * @typedef {Object} ErrorHandlerAction
 * @property {string} name - The name for the button element.
 * @property {string} label - The text to be displayed inside the button.
 * @property {string} variant - The variant changes the appearance of the button.
 * @property {Function | undefined} onclick - The function to be executed when the action is clicked.
 */

/**
 * @typedef {Object} Logger
 * @property {({error: any, ui: UiError}) => void} log - Function to log errors.
 */

/**
 * Handle error, show error modal or toast.
 * Show error details to user. Use for expected errors.
 * Toast is the default error component.
 * Use 'somethingWentWrong' function for unexpected errors instead.
 *
 * @param {any} error
 * @param {LightningElement | ErrorHandlerOptions | undefined} options
 */
export async function handleError(error, options) {
    const {
        element,
        type,
        disableDebounce,
        actions,
        somethingWentWrongMessage = somethingWentWrongLabel,
        logger = consoleLogger
    } = mergeErrorHandlerOptions({}, options);
    const ui = formatError(error, element, false, somethingWentWrongMessage);
    logger?.log({ error, ui });
    const debounce = !disableDebounce;
    const { message, payload, fieldErrors } = ui;
    if (type === 'modal' || (type !== 'toast' && (payload || fieldErrors?.length))) {
        await showErrorModal({ title: message, payload, fieldErrors, debounce, actions });
    } else {
        showToastEvent({ element, title: message, payload, debounce });
    }
}

/**
 * Handle unexpected error, show error modal or toast with generic Something went wrong message.
 * Modal is the default error component.
 * Hides technical details from user.
 *
 * @param {any} error
 * @param {LightningElement | ErrorHandlerOptions | undefined} options
 */
export async function somethingWentWrong(error, options) {
    const {
        element,
        type,
        disableDebounce,
        actions,
        somethingWentWrongMessage = somethingWentWrongLabel,
        logger = consoleLogger
    } = mergeErrorHandlerOptions({}, options);
    const ui = formatError(error, element, true, somethingWentWrongMessage);
    logger?.log({ error, ui });
    const debounce = !disableDebounce;
    const { message, payload, fieldErrors } = ui;
    if (type === 'toast') {
        showToastEvent({ element, title: message, payload, debounce });
    } else {
        await showErrorModal({ title: message, payload, fieldErrors, debounce, actions });
    }
}

/**
 * @typedef {Object} CustomErrorHandlerOptions
 * @property {ErrorHandlerAction[] | undefined} [actions] - List of error handler footer action buttons.
 * @property {string | undefined} [somethingWentWrongMessage] - Generic message to show when unexpected error is handled. Default: "Something went wrong.".
 * @property {Logger | undefined} [logger] - Custom logger.
 */

/**
 * Create custom error handler.
 * Option to override actions.
 *
 * @param {CustomErrorHandlerOptions} customOptions
 */
export function createCustomErrorHandler(customOptions) {
    const customOptionsCopy = { ...customOptions };
    return {
        /**
         * @param {any} error
         * @param {LightningElement | ErrorHandlerOptions | undefined} options
         */
        handleError: (error, options) => {
            return handleError(error, mergeErrorHandlerOptions(customOptionsCopy, options));
        },
        /**
         * @param {any} error
         * @param {LightningElement | ErrorHandlerOptions | undefined} options
         */
        somethingWentWrong: (error, options) => {
            return somethingWentWrong(error, mergeErrorHandlerOptions(customOptionsCopy, options));
        }
    };
}

async function showErrorModal({ title, payload, fieldErrors, debounce, actions }) {
    if (debounce) {
        debouncedShowErrorModal({ title, payload, fieldErrors, debounce: false, actions });
    } else {
        await ErrorHandlerModal.open({
            label: title,
            message: payload,
            fieldErrors: fieldErrors,
            size: 'small',
            actions
        });
    }
}

function showToastEvent({ element, title, payload, debounce }) {
    if (debounce) {
        debouncedShowToastEvent({ element, title, payload, debounce: false });
    } else {
        dispatchEvent(
            new ShowToastEvent({
                title,
                message: payload,
                mode: 'sticky',
                variant: 'error'
            })
        );
    }
}

/**
 * @typedef {Object} UiError
 * @property {string} [message]
 * @property {string | undefined} [payload]
 * @property {string | undefined} [stack]
 * @property {string | undefined} [hostName]
 */

/**
 * @param {any} e
 * @param {LightningElement | undefined} element
 * @param {boolean} isSomethingWentWrong
 * @param {string} somethingWentWrongMessage
 * @return {UiError}
 */
function formatError(e, element, isSomethingWentWrong, somethingWentWrongMessage) {
    const ui = {
        message: somethingWentWrongMessage,
        payload: undefined,
        stack: undefined,
        hostName: element?.template?.host?.localName,
        fieldErrors: [],
        handlerMethod: isSomethingWentWrong ? 'somethingWentWrong' : 'handleError'
    };
    if (isSomethingWentWrong) {
        if (e?.body) {
            formatErrorWithBody(ui, e, somethingWentWrongMessage);
        }
    } else if (e instanceof String || typeof e === 'string') {
        ui.message = e;
    } else if (e instanceof Error) {
        ui.message = e.message;
        ui.stack = e.stack;
    } else if (e?.body) {
        formatErrorWithBody(ui, e, somethingWentWrongMessage);
    } else {
        // generic handling
        ui.message = somethingWentWrongMessage;
        ui.payload = JSON.stringify(e);
    }
    return ui;
}

function formatErrorWithBody(ui, e, somethingWentWrongMessage) {
    let body;
    try {
        body = JSON.parse(e.body?.message);
    } catch (ignored) {
        body = e.body;
    }
    if (body.message) {
        ui.message = body.message;
    }
    if (Array.isArray(body?.output?.errors)) {
        ui.payload = ui.payload ?? '';
        for (const { message, fieldLabel, errorCode } of body.output.errors) {
            let prettyMessage = message;
            if (errorCode === 'CANNOT_INSERT_UPDATE_ACTIVATE_ENTITY') {
                // hide implementation details
                prettyMessage = somethingWentWrongMessage;
            }
            ui.payload += prettyMessage;
            if (fieldLabel) {
                ui.payload += ` [${fieldLabel}]`;
            }
            ui.payload += '\n';
        }
    }
    if (body?.output?.fieldErrors) {
        ui.payload = ui.payload ?? '';
        for (const outputFieldErrors of Object.values(body.output.fieldErrors)) {
            if (outputFieldErrors && Array.isArray(outputFieldErrors)) {
                for (const fieldError of outputFieldErrors) {
                    const { message, errorCode } = fieldError;
                    let prettyMessage = message;
                    if (errorCode === 'REQUIRED_FIELD_MISSING' && message.includes(':')) {
                        prettyMessage = message.substring(0, message.indexOf(':'));
                    } else if (errorCode === 'CANNOT_INSERT_UPDATE_ACTIVATE_ENTITY') {
                        // hide implementation details
                        prettyMessage = somethingWentWrongMessage;
                    }
                    ui.fieldErrors.push({
                        ...fieldError,
                        message: prettyMessage
                    });
                }
            }
        }
    }
}

/**
 * @type {Logger}
 */
export const consoleLogger = {
    log: ({ error, ui }) => {
        console.error(ui.hostName ?? '', JSON.stringify({ error, ui }, null, 2));
    }
};

/**
 * Merge two error handler options. Returns a new error handler options as an object.
 *
 * @param {LightningElement | ErrorHandlerOptions | undefined} opts1
 * @param {LightningElement | ErrorHandlerOptions | undefined} opts2
 * @return ErrorHandlerOptions
 */
function mergeErrorHandlerOptions(opts1, opts2) {
    const options1 = opts1 && opts1 instanceof LightningElement ? { element: opts1 } : opts1;
    const options2 = opts2 && opts2 instanceof LightningElement ? { element: opts2 } : opts2;
    return Object.assign({}, options1 ?? {}, options2 ?? {});
}

function debounced(fn, delay = 1000) {
    let timer = null;
    return function () {
        // eslint-disable-next-line no-invalid-this
        let context = this,
            args = arguments;
        clearTimeout(timer);
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        timer = setTimeout(function () {
            fn.apply(context, args);
        }, delay);
    };
}
