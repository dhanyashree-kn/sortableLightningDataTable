import { LightningElement, track, wire } from 'lwc';
import getOpportunites from '@salesforce/apex/SortTableController.getOpportunities';

const columns = [
    {label: 'Opportunity Name', fieldName : 'Name', type : 'text', sortable: true},
    {label: 'Close Date', fieldName : 'CloseDate', type : 'date', sortable: true},
    {label: 'Amount', fieldName : 'Amount', type : 'currency', sortable: true},
    {label: 'Stage Name', fieldName : 'StageName', type : 'picklist', sortable: true},
    {label: 'Account Name', fieldName : 'AccountName', type : 'text', sortable: true}
];
export default class SortDataTable extends LightningElement {

    @track data = [];
    @track columns = columns;
    @track sortBy;
    @track sortDirection;

    @wire(getOpportunites)
    wiredResult({error, data}) {
        if(data) {
            let mydata = [];
            data.forEach((opp) => {
                let oppData = new Object();
                oppData.Name = opp.Name;
                oppData.CloseDate = opp.CloseDate;
                oppData.StageName = opp.StageName;
                oppData.Amount = opp.Amount;
                oppData.AccountName = opp.Account.Name;
                mydata.push(oppData);

            });
            
            this.data = mydata;
            this.error = undefined;
        } else if(error) {
            this.error = error;
            this.data = undefined;
        }
        
    }

    handleSort(event) {

        this.sortBy = event.detail.fieldName;
        this.sortDirection = event.detail.sortDirection;
        this.sortData(this.sortBy, this.sortDirection);
    }

    sortData(fieldName, sortDirection) { 

        var mydata = JSON.parse(JSON.stringify(this.data));

        //function to return the value stored in the field
        var key = (a) => { 
            return a[fieldName]; 
        } 
           
        var reverse = sortDirection === 'asc' ? 1: -1;
        // to handel number/currency/date fields 
        if(fieldName === 'Amount' || fieldName === 'CloseDate') { 
            mydata.sort((a,b) => {
                var a = key(a) ? key(a) : '';
                var b = key(b) ? key(b) : '';
                return reverse * ((a>b) - (b>a));
            }); 
        }
        else {// to handel text  fields 
            
            mydata.sort((a,b) => { 
                var a = key(a) ? key(a).toLowerCase() : '';//To handle null values , uppercase records during sorting
                var b = key(b) ? key(b).toLowerCase() : '';
                return reverse * ((a>b) - (b>a));
            });    
        } 
        //set sorted data to data attribute
        this.data = mydata; 
    }
}