import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { ChangeMaterial, Cms } from 'src/app/shared/models/change-material';
import { RouterService } from 'src/app/shared/service/router.service';
import { AppConfig } from 'src/app/shared/util/appConfig';
@Component({
  selector: 'quality-assurance-pwm-change-material',
  templateUrl: './pwm-change-material.component.html',
  styleUrls: ['./pwm-change-material.component.css']
})
export class PwmChangeMaterialComponent implements OnInit {
  @ViewChild('dtChangeMaterial', { static: false }) dt: Table
  constructor( public appConfig: AppConfig,
    private router: Router,
    private cms:ChangeMaterial,
    private routerService: RouterService) { }
    m: Cms;
  ngOnInit(): void {
    this.m = this.cms.getDefault();
  }
  @Input() get selectedColumns(): any[] {
    return this.m.details.table.columns.selected;
  }
  set selectedColumns(val: any[]) {
   this.m.details.table.columns.selected =this.m.details.table.columns.actual.filter(col => val.includes(col));
  }
  onLazyLoad(event){
    
  }
}
