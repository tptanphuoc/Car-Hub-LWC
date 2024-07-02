import { LightningElement, api, wire } from 'lwc';
// Car object
import CAR_OBJECT from '@salesforce/schema/Car__c'
import CAR_NAME from '@salesforce/schema/Car__c.Name'
import CAR_PICTURE_URL from '@salesforce/schema/Car__c.Picture_URL__c'
import CAR_CATEGORY from '@salesforce/schema/Car__c.Category__c'
import CAR_MAKE from '@salesforce/schema/Car__c.Make__c'
import CAR_PRICE from '@salesforce/schema/Car__c.MSRP__c'
import CAR_FUEL from '@salesforce/schema/Car__c.Fuel_Type__c'
import CAR_SEAT from '@salesforce/schema/Car__c.Number_of_Seats__c'
import CAR_CONTROL from '@salesforce/schema/Car__c.Control__c'
// getFieldValue used for extracting field values
import { getFieldValue } from 'lightning/uiRecordApi';

// Lightning Message Service
import { subscribe, MessageContext } from 'lightning/messageService';
import SELECTED_CAR_MESSAGE_CHANNEL from '@salesforce/messageChannel/CarSelected__c'

// Navigation service
import { NavigationMixin } from 'lightning/navigation'

export default class CarCard extends NavigationMixin(LightningElement) {
    // Load context for LMS
    @wire(MessageContext)
    messageContext;

    // Map these imported field to properties
    carCategory = CAR_CATEGORY;
    carMake = CAR_MAKE;
    carPrice = CAR_PRICE;
    carFuel = CAR_FUEL;
    carSeat = CAR_SEAT;
    carControl = CAR_CONTROL;

    // Id of Car__c to display data
    recordId;

    // Load the car's Image and Name
    carName;
    carPictureURL;
    handleCarLoading(event) {
        const {records} = event.detail; // Get all the records
        const recordData = records[this.recordId]; // Get only one specific record
        this.carName = getFieldValue(recordData, CAR_NAME); // From that specific record, get the Name
        this.carPictureURL = getFieldValue(recordData, CAR_PICTURE_URL); // From that specific record, get the Image
    }
    
    // Subcribe LMS when component loads
    connectedCallback() {
        subscribe(this.messageContext, SELECTED_CAR_MESSAGE_CHANNEL, (message) => this.handleCarSelected(message));
    }

    handleCarSelected(message) {
        this.recordId = message.carId;
    }

    // Navigate to the Car record page
    handleNavigateToRecord() {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.recordId, // Pass recordId of Car to navigate
                objectApiName: CAR_OBJECT.objectApiName, // Object to be navigated
                actionName: 'view' // User can only view Car record
            }
        })
    }
}