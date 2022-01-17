import { Component, OnInit } from '@angular/core';


@Component({
    selector: 'quality-assurance-pwm-lot-approval',
    templateUrl: './pwm-lot-approval.component.html',
    styleUrls: ['./pwm-lot-approval.component.css']
})
export class PwmLotApprovalComponent implements OnInit {
  products: any[];
  cols: any[];
  custormer: any[];
  custCols: any[];
  constructor() { }
  binId:string;
  ngOnInit(): void {
    this.cols = [
      { field: 'date1', header: 'Date' },
      { field: 'by1', header: 'By' },
      { field: 'comments1', header: 'Comments' },
      { field: 'status', header: 'Status' },
      { field: 'date2', header: 'Date' },
      { field: 'by2', header: 'By' },
      { field: 'comments2', header: 'Comments' },
  ];

  this.products = [{ 'date1': 1,'by1':'sasasadsd','comments1':'ABC','status':600,'date2': 1,'by2':'sasasadsd','comments2':'ABC'},
  { 'date1': 1,'by1':'sasasadsd','comments1':'ABC','status':600,'date2': 1,'by2':'sasasadsd','comments2':'ABC'},
  { 'date1': 1,'by1':'sasasadsd','comments1':'ABC','status':600,'date2': 1,'by2':'sasasadsd','comments2':'ABC'},
  { 'date1': 1,'by1':'sasasadsd','comments1':'ABC','status':600,'date2': 1,'by2':'sasasadsd','comments2':'ABC'},]

  this.custCols = [
    { field: 'customer', header: 'Customer' },
    { field: 'senddate', header: 'Sent Date' },
    { field: 'status', header: 'Status' },
    { field: 'statusDate', header: 'Status Date' },
    { field: 'comments', header: 'Comments' },
    { field: 'customer1', header: 'Customer' },
    { field: 'senddate1', header: 'Sent Date' },
    { field: 'status1', header: 'Status' },
    { field: 'statusDate1', header: 'Status Date' },
    { field: 'comments1', header: 'Comments' },
];
  }
  searchByCriteria(){

  }
  resetCriteria(){

  }
  onRowEditInit(){

  }
  onRowEditSave(){

  }
  onRowEditCancel(){

  }
  onDelete(){
    
  }
}

