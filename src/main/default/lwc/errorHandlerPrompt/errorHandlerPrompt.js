/**
 * Prompt element for errorHandler.js service.
 *
 * Add this component to the top of your markup without any attributes.
 * All api attributes are set by the processError function (errorHandler.js) when using with the 'showPrompt' config.
 *
 * @author  kratapps.com
 * @date    2021-11-07
 */
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
