import { LightningElement, api, wire } from 'lwc';
import getSimilarCars from '@salesforce/apex/CarController.getSimilarCars';
import { getRecord } from 'lightning/uiRecordApi';
import MAKE_FIELD from '@salesforce/schema/Car__c.Make__c';

import {NavigationMixin} from 'lightning/navigation';
export default class SimilarCars extends NavigationMixin(LightningElement) {
    @api recordId; // Always have recordId when in record page
    @api objectApiName; // Always have objectApiName when in record page

    similarCars;

    @wire(getRecord, { // Get Car record from particular recordId
        recordId: '$recordId',
        fields: [MAKE_FIELD] // Only get Make__c field
    })
    carRecord;

    async handleSimilarCars() {
        try {
            this.similarCars = await getSimilarCars({
                carId: this.recordId,
                makeTypes: this.carRecord.data.fields.Make__c.value
            });
        } catch (error) {
            console.error(error.message);
        }
    }

    handleViewDetail(event) {
        this[NavigationMixin.Navigate]({
            type: "standard__recordPage",
            attributes: {
                recordId: event.target.dataset.id, // Take value of [data-id={car.Id}] in HTML
                objectApiName: this.objectApiName,
                actionName: "view"
            }
        })
    }
}