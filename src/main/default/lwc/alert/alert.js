/**
 * Wrapper for slds alert - https://www.lightningdesignsystem.com/components/alert/
 *
 * @author  kratapps.com
 * @date    2021-10-31
 */
import {LightningElement, api} from 'lwc';

const variantToIconName = {
    info: "utility:user",
    warning: "utility:warning",
    error: "utility:error",
    offline: "utility:offline"
};

const variantToLabel = {
    info: "Info",
    warning: "Warning",
    error: "Error",
    offline: "Offline"
};

const variantToAlertClass = {
    info: "",
    warning: "slds-alert_warning",
    error: "slds-alert_error",
    offline: "slds-alert_offline"
};

const variantToIconClass = {
    info: "slds-icon-utility-user",
    warning: "slds-icon-utility-warning",
    error: "slds-icon-utility-error",
    offline: "slds-icon-utility-offline"
};

export default class Alert extends LightningElement {
    @api variant = "info"; // {[info | warning | error | offline]} default info
    @api closeable = false; // {closeable} default false
    @api hidden = false; // {boolean} default false
    @api iconDescription; // {boolean}

    get iconName() {
        const variant = this.variant;
        return variantToIconName[variant] || "utility:user";
    }

    get variantLabel() {
        const variant = this.variant;
        return variantToLabel[variant] || "Info";
    }

    get alertClasses() {
        const variant = this.variant;
        const cls = variantToAlertClass[variant] || "";
        return `slds-notify slds-notify_alert ${cls}`;
    }

    get containerClasses() {
        const variant = this.variant;
        const cls = variantToIconClass[variant] || "slds-icon-utility-user";
        return `slds-icon_container ${cls} slds-m-right_x-small`;
    }

    handleCloseClick(event) {
        event.preventDefault();
        event.stopPropagation();
        this.dispatchEvent(new CustomEvent('close'));
    }
}
