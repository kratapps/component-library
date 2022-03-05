import {LightningElement, track} from 'lwc';

export default class PromptExample extends LightningElement {
    @track title = 'Custom Prompt';
    @track show = false;
    
    showPrompt() {
        this.show = true;
    }
    
    handleClose() {
        this.show = false;
    }
}