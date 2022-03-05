import {LightningElement} from 'lwc';
import {showSpinner, hideSpinner} from "c/spinner";

export default class SpinnerExample extends LightningElement {
    async showSpinner() {
        await showSpinner(this);
    }

    async hideSpinner() {
        await hideSpinner(this);
    }
}
