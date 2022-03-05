import {LightningElement} from 'lwc';
import {handleError} from "c/errorHandler";
import throwLightningError from '@salesforce/apex/ComponentLibraryExamplesController.throwLightningError';

export default class ErrorHandlerExample extends LightningElement {
    async handleErrorClick() {
        try {
            await throwLightningError();
        } catch (e) {
            handleError(e, {element: this});
        }
    }

    async handleErrorWithPromptClick() {
        try {
            await throwLightningError();
        } catch (e) {
            handleError(e, {element: this, showPrompt: true});
        }
    }
}