import { LightningElement, wire } from 'lwc';
import getAllCars from '@salesforce/apex/CarController.getAllCars';

// Lightning Message Service
import { publish, subscribe, MessageContext } from 'lightning/messageService';
import MESSAGE_CHANNEL from '@salesforce/messageChannel/CarsFilter__c'
import SELECTED_CAR_MESSAGE_CHANNEL from '@salesforce/messageChannel/CarSelected__c'

export default class CarTileList extends LightningElement {
    allCars = [];
    searchCriterias = {};

    @wire(getAllCars, {searchCriterias: '$searchCriterias'})
    carsHandler({data, error}) {
        if (data) {
            this.allCars = data;
        }
        if (error) {
            console.error(error);
        }
    }

    // Load context for LMS
    @wire(MessageContext)
    theMessageContext;

    // Subcribe LMS when component loads
    connectedCallback() {
        subscribe(this.theMessageContext, MESSAGE_CHANNEL, (message) => this.handleFilterChanges(message))
    }

    handleFilterChanges(message) {
        this.searchCriterias = {...message.filters};
    }

    handleCarSelected(event) {
        publish(this.theMessageContext, SELECTED_CAR_MESSAGE_CHANNEL, {
            carId: event.detail
        })
    }
}