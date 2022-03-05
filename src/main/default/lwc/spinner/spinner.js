/**
 * Spinner.
 *
 * Wrap your component in the spinner component.
 * In JS import showSpinner and hideSpinner functions.
 *
 * @author  kratapps.com
 * @date    2020-11-25
 */
import {LightningElement, api, track} from "lwc";

export default class Spinner extends LightningElement {
    @track loading = false;

    @api
    async show() {
        console.log("show spinner");
        return new Promise((resolve) => {
            this.loading = true;
            this.runAsync(resolve);
        });
    }

    @api
    async hide() {
        console.log("hide spinner");
        return new Promise((resolve) => {
            this.loading = false;
            this.runAsync(resolve);
        });
    }
    
    async runAsync(handler) {
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        setTimeout(handler, 0);
    }
}

export async function showSpinner(component) {
    if (!component) {
        console.error("To show spinner you need to provide a c-spinner component");
    }
    const spinner = component.template.querySelector("c-spinner");
    if (spinner) {
        spinner.show();
    } else {
        console.error("c-spinner component not found");
    }
}

export async function hideSpinner(component) {
    if (!component) {
        console.error("To hide spinner you need to provide a c-spinner component");
    }
    const spinner = component.template.querySelector("c-spinner");
    if (spinner) {
        spinner.hide();
    } else {
        console.error("c-spinner component not found");
    }
}

