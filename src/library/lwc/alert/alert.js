/*
 * BSD 3-Clause License
 *
 * Copyright (c) 2022, kratapps.com
 * See the LICENSE: https://github.com/kratapps/component-library/blob/main/LICENSE
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
