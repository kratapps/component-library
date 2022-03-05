import {LightningElement, track} from 'lwc';

export default class AlertExample extends LightningElement {
    @track isClosed = false;

    handleCloseClick() {
        this.isClosed = true;
    }
}