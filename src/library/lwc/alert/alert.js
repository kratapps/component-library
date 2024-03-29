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
 * @file Wrapper for slds alert.
 *
 * @author  kratapps.com
 * @see     https://docs.kratapps.com/component-library/alert
 */
import { LightningElement, api } from 'lwc';

const variantToIconName = {
    error: 'utility:error',
    info: 'utility:user',
    offline: 'utility:offline',
    warning: 'utility:warning'
};

const variantToLabel = {
    error: 'Error',
    info: 'Info',
    offline: 'Offline',
    warning: 'Warning'
};

const variantToAlertClass = {
    error: 'slds-alert_error',
    info: '',
    offline: 'slds-alert_offline',
    warning: 'slds-alert_warning'
};

const variantToIconClass = {
    error: 'slds-icon-utility-error',
    info: 'slds-icon-utility-user',
    offline: 'slds-icon-utility-offline',
    warning: 'slds-icon-utility-warning'
};

export default class Alert extends LightningElement {
    @api variant = 'info'; // {[info | warning | error | offline]} default info
    @api closeable = false; // {closeable} default false
    @api hidden = false; // {boolean} default false
    @api iconDescription; // {boolean}

    get iconName() {
        const variant = this.variant;
        return variantToIconName[variant] || 'utility:user';
    }

    get variantLabel() {
        const variant = this.variant;
        return variantToLabel[variant] || 'Info';
    }

    get alertClasses() {
        const variant = this.variant;
        const cls = variantToAlertClass[variant] || '';
        return `slds-notify slds-notify_alert ${cls}`;
    }

    get containerClasses() {
        const variant = this.variant;
        const cls = variantToIconClass[variant] || 'slds-icon-utility-user';
        return `slds-icon_container ${cls} slds-m-right_x-small`;
    }

    handleCloseClick(event) {
        event.preventDefault();
        event.stopPropagation();
        this.dispatchEvent(new CustomEvent('close'));
    }
}
