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
 * @file Generic Error Handler.
 *
 * @author  kratapps.com
 * @see     https://docs.kratapps.com/component-library/error-handler
 */
import { LightningElement } from 'lwc';

import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import ErrorHandlerModal, { standardActions } from 'c/errorHandlerModal';

const debouncedShowToastEvent = debouncedFn(showToastEvent);
const debouncedShowErrorModal = debouncedFn(showErrorModal);

/**
 * @typedef {Object} ErrorHandlerOptions
 * @property {LightningElement} element - Usually the 'this' component. Required to show toast/prompt.
 * @property {boolean | undefined} [showModal] - Default. Show error modal. Used to show more detail than toast.
 * @property {boolean | undefined} [showPrompt] - Alias for showModal.
 * @property {boolean | undefined} [showToast] - Show error toast.
 * @property {boolean | undefined} [disableDebounce] - By default, show only one error if multiple errors handled within a second. Set to true to disable debouncing.
 * @property {ErrorHandlerAction[] | undefined} [actions] - List of error handler footer action buttons.
 */

/**
 * @typedef {Object} ErrorHandlerAction
 * @property {string} name - The name for the button element.
 * @property {string} label - The text to be displayed inside the button.
 * @property {string} variant - The variant changes the appearance of the button.
 * @property {Function | undefined} onclick - The function to be executed when the action is clicked.
 */

/**
 * Handle errors in a generic way.
 *
 * @param {any} error
 * @param {LightningElement | ErrorHandlerOptions | undefined} options
 */
export async function handleError(error, options) {
    let element;
    let showToast;
    let showModal;
    let disableDebounce;
    let actions;
    if (options && options instanceof LightningElement) {
        element = options;
    } else if (options) {
        element = options.element;
        showToast = options.showToast;
        showModal = options.showPrompt ?? options.showModal;
        disableDebounce = options.disableDebounce;
        actions = options.actions;
    }
    const formatted = formatError(error, element);
    // eslint-disable-next-line no-console
    console.error(JSON.stringify({ error, formatted }, null, 2));
    const debounce = !disableDebounce;
    const { title, message } = formatted;
    if (showModal || !showToast) {
        await showErrorModal({ title, message, debounce, actions });
    } else {
        showToastEvent({ element, title, message, debounce });
    }
}

/**
 * @typedef {Object} CustomErrorHandlerOptions
 * @property {ErrorHandlerAction[]} [actions] - List of error handler footer action buttons.
 */

/**
 * Create custom error handler.
 * Option to override actions.
 *
 * @param {CustomErrorHandlerOptions} options
 */
export function createCustomErrorHandler({ actions = standardActions }) {
    return {
        /**
         * @param {any} error
         * @param {ErrorHandlerOptions} options
         */
        handleError: (error, options) => {
            const fullOptions =
                options && options instanceof LightningElement
                    ? Object.assign({ element: options }, { actions })
                    : Object.assign({}, options ?? {}, { actions });
            return handleError(error, fullOptions);
        }
    };
}

async function showErrorModal({ title, message, debounce, actions }) {
    if (debounce) {
        debouncedShowErrorModal({ title, message, debounce: false, actions });
    } else {
        await ErrorHandlerModal.open({
            label: title,
            message,
            size: 'small',
            actions
        });
    }
}

function showToastEvent({ element, title, message, debounce }) {
    if (debounce) {
        debouncedShowToastEvent({ element, title, message, debounce: false });
    } else {
        dispatchEvent(
            new ShowToastEvent({
                title: title,
                message: message,
                mode: 'sticky',
                variant: 'error'
            })
        );
    }
}

function formatError(e, element) {
    const formatted = {
        title: 'Something went wrong.',
        message: undefined,
        stack: undefined,
        source: {
            localName: element?.template?.host?.localName
        }
    };
    if (e instanceof String || typeof e === 'string') {
        formatted.title = e;
    } else if (e instanceof Error) {
        formatted.title = e.message;
        formatted.stack = e.stack;
    } else if (e?.body) {
        formatErrorWithBody(formatted, e);
    } else {
        // generic handling
        formatted.title = 'Something went wrong.';
        // formatted.message = JSON.stringify(e);
    }
    return formatted;
}

function formatErrorWithBody(formatted, e) {
    let body;
    try {
        body = JSON.parse(e.body?.message);
    } catch (ignored) {
        body = e.body;
    }
    formatted.title = body.message;
    if (body.output && typeof body.output === 'object') {
        const { errors, fieldErrors } = body.output;
        formatted.message = '';
        if (errors && Array.isArray(errors)) {
            for (const { message, fieldLabel } of errors) {
                formatted.message += message;
                if (fieldLabel) {
                    formatted.message += ` [${fieldLabel}]`;
                }
                formatted.message += '\n';
            }
        }
        if (fieldErrors && Array.isArray(fieldErrors)) {
            for (const outputFieldErrors of Object.values(fieldErrors)) {
                if (outputFieldErrors && Array.isArray(outputFieldErrors)) {
                    for (const { message, fieldLabel } of outputFieldErrors) {
                        formatted.message += message;
                        if (fieldLabel) {
                            formatted.message += ` [${fieldLabel}]`;
                        }
                        formatted.message += '\n';
                    }
                }
            }
        }
    }
}

function debouncedFn(fn, delay = 1000) {
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
