import { LightningElement, wire } from 'lwc';
// Car object
import CAR_OBJECT from '@salesforce/schema/Car__c'
import CAR_CATEGORY from '@salesforce/schema/Car__c.Category__c'
import CAR_MAKE from '@salesforce/schema/Car__c.Make__c'
import { getObjectInfo, getPicklistValues } from 'lightning/uiObjectInfoApi';

// lightning Message Service
import MESSAGE_CHANNEL from '@salesforce/messageChannel/CarsFilter__c'
import { publish, MessageContext } from 'lightning/messageService';

export default class CarFilter extends LightningElement {
    timer; // Use to delay Apex call to improve performance
    isFirstLoad = true; // Use to check if the page is first load or not
    searchCriterias = {
        name: "",
        maxPrice: 999999
    }

    // Load context for LMS
    @wire(MessageContext)
    theMessageContext;

    // Publish the Message
    sendDataToCarList() {
        window.clearTimeout(this.timer); // Reset the previous delay
        this.timer = window.setTimeout(() => { // Set the delay to 500ms
            publish(this.theMessageContext, MESSAGE_CHANNEL, {
                filters: this.searchCriterias
            })
        }, 500)
    }

    // Fetch CAR_OBJECT information
    @wire(getObjectInfo, {objectApiName: CAR_OBJECT})
    carObjectInfos;

    // Fetch Category picklist value
    @wire(getPicklistValues, {
        recordTypeId: "$carObjectInfos.data.defaultRecordTypeId",
        fieldApiName: CAR_CATEGORY
    })
    carCategories;

    // Fetch Make picklist value
    @wire(getPicklistValues, {
        recordTypeId: "$carObjectInfos.data.defaultRecordTypeId",
        fieldApiName: CAR_MAKE
    })
    carMakes;

    handleSearchNameChange(event) { // When user change the name to search
        this.searchCriterias = {...this.searchCriterias, "name": event.target.value}
        this.sendDataToCarList(); // Send new criteria to fetch new car list
    }

    handleMaxPriceChange(event) { // When user change the price to search
        this.searchCriterias = {...this.searchCriterias, "maxPrice": event.target.value}
        this.sendDataToCarList(); // Send new criteria to fetch new car list
    }

    handleCheckboxChange(event) { // When user change the checkbox to search
        if (this.isFirstLoad) { // if the page is first loaded
            const carCategories = this.carCategories.data.values.map(item => item.value); // fetch all Category
            const carMakes = this.carMakes.data.values.map(item => item.value); // fetch all MakeType
            this.searchCriterias = {...this.searchCriterias, carCategories, carMakes}; // Add them to the searchCriterias
            this.isFirstLoad = false;
            console.log(JSON.stringify(this.searchCriterias));
        }
        const {name, value} = event.target;

        if (event.target.checked) { // If that checkbox is checked
            if (!this.searchCriterias[name].includes(value)) { // If checkbox value is not in the carCategories or carMakes yet
                this.searchCriterias[name] = [...this.searchCriterias[name], value]; // Add that checkbox value to array
            }
        } else { // If checkbox in unchecked
            this.searchCriterias[name] = this.searchCriterias[name].filter(item => item !== value) // Remove that checkbox value from array
        }
        
        this.sendDataToCarList(); // Send new criteria to fetch new car list
    }
}