/*
BSD 3-Clause License

Copyright (c) 2022, kratapps.com
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this
   list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution.

3. Neither the name of the copyright holder nor the names of its
   contributors may be used to endorse or promote products derived from
   this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

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

