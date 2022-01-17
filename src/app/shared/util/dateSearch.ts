import { Helper } from "./helper";

export class DateSearch {
    fromDate: string;
    toDate: string;
    plant_date:string;
    defaultDateSearch
    constructor() {
        this.plant_date = sessionStorage.getItem('PlantDate');
        if(Helper.hasValue(this.plant_date )){
        var from = new Date(this.plant_date);
        var to = new Date(this.plant_date)
        from.setDate(from.getDate()-6);
        from.setHours(0,0,0,0);
        this.fromDate = Helper.formatDate(from);
        to.setHours(23,59,59,999);
        this.toDate=Helper.formatDate(to);
    }
    }
    
}