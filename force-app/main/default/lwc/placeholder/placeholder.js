import { LightningElement, api } from 'lwc';
import CARHUB_LOGO from '@salesforce/resourceUrl/carhub_logo'

export default class Placeholder extends LightningElement {
    @api message;

    logoImage = CARHUB_LOGO;
}