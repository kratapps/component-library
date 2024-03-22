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

/*
 * @author kratapps.com
 *
 * DEPRECATED.
 * Use the standard lightning-alert component:
 * https://developer.salesforce.com/docs/component-library/bundle/lightning-alert/documentation
 */
import { LightningElement, api } from 'lwc';

const variantToTheme = {
    error: 'slds-theme_error',
    info: 'slds-theme_info',
    offline: 'slds-theme_offline',
    warning: 'slds-theme_warning'
};

export default class Prompt extends LightningElement {
    @api title = '';
    @api variant = 'info'; // ["info" | "warning" | "error" | "offline"] default "info"
    @api show = false;
    @api disableClose = false;
    @api buttons = [
        {
            eventName: 'close',
            label: 'Got It',
            value: 'gotIt',
            variant: 'neutral'
        }
    ];

    get buttonItems() {
        return this.buttons.map((it, idx) => ({
            ...it,
            classNames: `slds-button slds-button_${it.variant} ${idx === 0 ? '' : 'slds-p-left_x-small'}`
        }));
    }

    handleButtonClick(event) {
        event.stopPropagation();
        event.preventDefault();
        const { value } = event.currentTarget;
        const item = this.buttonItems.find((it) => it.value === value);
        if (item.eventName) {
            this.dispatchEvent(new CustomEvent(item.eventName));
        }
    }

    handleCloseClick() {
        this.dispatchEvent(new CustomEvent('close'));
    }

    get headerClasses() {
        const theme = variantToTheme[this.variant];
        return `slds-modal__header ${theme} slds-theme_alert-texture`;
    }
}
