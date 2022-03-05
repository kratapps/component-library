import {LightningElement, api} from 'lwc';

const variantToTheme = {
    info: "slds-theme_info",
    warning: "slds-theme_warning",
    error: "slds-theme_error",
    offline: "slds-theme_offline",
};

export default class Prompt extends LightningElement {
    @api title = '';
    @api variant = "info"; // ["info" | "warning" | "error" | "offline"] default "info"
    @api show = false;
    @api disableClose = false;
    @api buttons = [
        {
            value: 'gotIt',
            title: 'Got It',
            variant: 'neutral',
            eventName: 'close'
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
        const {value} = event.currentTarget;
        const item = this.buttonItems.find(it => it.value === value);
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
