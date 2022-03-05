import {LightningElement, api, track} from 'lwc';

export default class ErrorHandlerPrompt extends LightningElement {
    @api title;
    @api message;
    @track _show = false;

    @api
    show() {
        this._show = true;
    }

    handleCloseClick() {
        this._show = false;
    }
}
