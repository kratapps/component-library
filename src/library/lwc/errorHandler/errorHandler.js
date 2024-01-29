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

import LightningAlert from "lightning/alert";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

function formatErrorWithBody(formatted, e) {
  let body;
  try {
    body = JSON.parse(e.body?.message);
  } catch (ignored) {
    body = e.body;
  }
  formatted.title = body.message;
  if (body.output) {
    const { errors, fieldErrors } = body.output;
    formatted.message = "";
    if (errors) {
      for (const outputError of errors) {
        formatted.message += outputError.message;
        if (outputError.fieldLabel) {
          formatted.message += ` [${outputError.fieldLabel}]`;
        }
        formatted.message += "\n";
      }
    }
    if (fieldErrors) {
      for (const outputFieldErrors of Object.values(fieldErrors)) {
        for (const outputFieldError of outputFieldErrors) {
          formatted.message += outputFieldError.message;
          if (outputFieldError.fieldLabel) {
            formatted.message += ` [${outputFieldError.fieldLabel}]`;
          }
          formatted.message += "\n";
        }
      }
    }
  }
}

function formatError(e) {
  const formatted = {
    message: undefined,
    stack: undefined,
    title: undefined
  };
  if (e instanceof String || typeof e === "string") {
    formatted.title = e;
  } else if (e instanceof Error) {
    formatted.title = e.message;
    formatted.stack = e.stack;
  } else if (e.body) {
    formatErrorWithBody(formatted, e);
  } else {
    // generic handling
    formatted.title = "Something Went Wrong";
    formatted.message = JSON.stringify(e);
  }
  return formatted;
}

function debounceFun(fn, delay = 1000) {
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

const debouncedShowToastEvent = debounceFun(showToastEvent);
const debouncedShowErrorPrompt = debounceFun(showErrorPrompt);

function showToastEvent(element, title, message, debounce) {
  if (debounce) {
    debouncedShowToastEvent(element, title, message, false);
  } else {
    element.dispatchEvent(
      new ShowToastEvent({
        message,
        mode: "sticky",
        title,
        variant: "error"
      })
    );
  }
}

async function showErrorPrompt(title, message, debounce) {
  if (debounce) {
    debouncedShowErrorPrompt(title, message, false);
  } else {
    await LightningAlert.open({
      label: title,
      message: message,
      theme: "error"
    });
  }
}

/**
 * @typedef {Object} ProcessErrorConfig
 * @property {LightningElement} element - Usually the 'this' component. Required to show toast/prompt.
 * @property {boolean} [showToast] - Show error toast.
 * @property {boolean} [showPrompt] - Show error prompt. Used to show more detail than toast.
 * @property {boolean} [disableDebounce] - By default, show only one error if multiple errors handled within a second.
 * Set to true to disable debouncing.
 */

/**
 * Handle errors in a generic way.
 *
 * @param {any} error
 * @param {ProcessErrorConfig} config
 */
export async function handleError(error, config = {}) {
  const formatted = formatError(error);
  // eslint-disable-next-line no-console
  console.error({ config, error, formatted });
  let { element, showToast, showPrompt, disableDebounce = false } = config;
  const debounce = !disableDebounce;
  const { title, message } = formatted;

  if (element && (showToast || !showPrompt)) {
    showToastEvent(element, title, message, debounce);
  } else if (element && showPrompt) {
    await showErrorPrompt(title, message, debounce);
  }
}