import {LightningElement, api} from 'lwc';

export default class ExampleItem extends LightningElement {
    @api title;
    @api size = 4;
}