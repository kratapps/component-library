/**
 * Wrapper for slds prompt - https://www.lightningdesignsystem.com/components/prompt/
 *
 * Wrap your component/text in the prompt component.
 *
 * @author  kratapps.com
 * @date    2021-11-07
 */
import {LightningElement, api} from 'lwc';

const variantToTheme = {
    info: "slds-theme_info",
    warning: "slds-theme_warning",
    error: "slds-theme_error",
    offline: "slds-theme_offline",
};

export default class Prompt extends LightningElement {
    @api title = '';
    @api variant = "info"; // {[info | warning | error | offline]} default info
    @api show = false;

    get headerClasses() {
        const theme = variantToTheme[this.variant];
        return `slds-modal__header ${theme} slds-theme_alert-texture`;
    }

    handleCloseClick() {
        this.dispatchEvent(new CustomEvent('close'));
    }
}
