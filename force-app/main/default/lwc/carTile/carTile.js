import { LightningElement, api } from 'lwc';

export default class CarTile extends LightningElement {
    @api car={};

    // Whenever click on each car
    handleClick() {
        this.dispatchEvent(new CustomEvent("selected", {
            detail: this.car.Id // pass the Id of the current car
        }))
    }
}