import {ShowToastEvent} from "lightning/platformShowToastEvent";

function formatErrorWithBody(formatted, e) {
    let body;
    try {
        body = JSON.parse(e.body?.message);
    } catch (ignored) {
        body = e.body;
    }
    formatted.title = body.message;
    if (body.output) {
        const {errors, fieldErrors} = body.output;
        formatted.message = '';
        if (errors) {
            for (const outputError of errors) {
                formatted.message += outputError.message;
                if (outputError.fieldLabel) {
                    formatted.message += ` [${outputError.fieldLabel}]`;
                }
                formatted.message += '\n';
            }
        }
        if (fieldErrors) {
            for (const outputFieldErrors of Object.values(fieldErrors)) {
                for (const outputFieldError of outputFieldErrors) {
                    formatted.message += outputFieldError.message;
                    if (outputFieldError.fieldLabel) {
                        formatted.message += ` [${outputFieldError.fieldLabel}]`;
                    }
                    formatted.message += '\n';
                }
            }
        }
    }
}

function formatError(e) {
    const formatted = {
        title: undefined,
        message: undefined,
        stack: undefined
    };
    if (e instanceof String || typeof e === 'string') {
        formatted.title = e;
    } else if (e instanceof Error) {
        formatted.title = e.message;
        formatted.stack = e.stack;
    } else if (e.body) {
        formatErrorWithBody(formatted, e);
    } else {
        // generic handling
        formatted.title = 'Something Went Wrong';
        formatted.message = JSON.stringify(e);
    }
    return formatted;
}

/**
 * @typedef {Object} ProcessErrorConfig
 * @property {LightningElement} element - The 'this' component. Required to show toast/show prompt.
 * @property {boolean} [showToast] - To show toast. Property 'element' is required. Shown by default.
 * @property {boolean} [showPrompt] - To show prompt. Property 'element' is required. Shown only if toast not shown.
 */

/**
 * Handle errors in a generic way.
 *
 * @param {any} error
 * @param {ProcessErrorConfig} config
 */
export function handleError(error, config = {}) {
    const formatted = formatError(error);
    console.error({error, formatted, config});
    const {element, showToast, showPrompt} = config;
    const {title, message} = formatted;

    function showToastEvent() {
        element.dispatchEvent(new ShowToastEvent({
            title,
            message,
            mode: 'sticky',
            variant: 'error'
        }));
    }

    function showErrorHandlerPrompt(promptElement) {
        promptElement.title = title;
        promptElement.message = message;
        promptElement.show();
    }

    if (element && (showToast || !showPrompt)) {
        showToastEvent();
    } else if (element && showPrompt) {
        const promptElement = element.template.querySelector('c-error-handler-prompt');
        if (promptElement) {
            showErrorHandlerPrompt(promptElement);
        } else {
            console.error('c-error-handler-prompt not found');
            showToastEvent();
        }
    }
}
