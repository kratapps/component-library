/*
 * BSD 3-Clause License
 *
 * Copyright (c) 2022, kratapps.com
 * See the LICENSE: https://github.com/kratapps/component-library/blob/main/LICENSE
 */

/**
 * @file Displays an animated spinner.
 * Spinners are a loading indicators that should be shown when retrieving data or
 * performing slow computations.
 * Showing and hiding spinner works immediately.
 *
 * @link https://docs.kratapps.com/component-library/spinner
 *
 * @author  kratapps.com
 */
import { LightningElement, api, track } from 'lwc';

const provideSpinnerToHide = 'To hide spinner you need to provide a c-spinner component';
const provideSpinnerToShow = 'To show spinner you need to provide a c-spinner component';
const spinnerComponentNotFound = 'c-spinner component not found';

export default class Spinner extends LightningElement {
    @track loading = false;

    @api
    async show() {
        return new Promise((resolve) => {
            this.loading = true;
            this.runAsync(resolve);
        });
    }

    @api
    async hide() {
        return new Promise((resolve) => {
            this.loading = false;
            this.runAsync(resolve);
        });
    }

    async runAsync(handler) {
        // eslint-disable-next-line @lwc/lwc/no-async-operation, no-magic-numbers
        setTimeout(handler, 0);
    }
}

export async function showSpinner(component) {
    if (!component) {
        // eslint-disable-next-line no-console
        console.error(provideSpinnerToShow);
    }
    const spinner = component.template.querySelector('c-spinner');
    if (spinner) {
        await spinner.show();
    } else {
        // eslint-disable-next-line no-console
        console.error(spinnerComponentNotFound);
    }
}

export async function hideSpinner(component) {
    if (!component) {
        // eslint-disable-next-line no-console
        console.error(provideSpinnerToHide);
    }
    const spinner = component.template.querySelector('c-spinner');
    if (spinner) {
        await spinner.hide();
    } else {
        // eslint-disable-next-line no-console
        console.error(spinnerComponentNotFound);
    }
}
