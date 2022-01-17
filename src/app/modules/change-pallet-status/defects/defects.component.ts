import { AppConfig } from 'src/app/shared/util/appConfig';
import { ChangePalletStatusService } from './../../../shared/service/change-pallet-status.service';
import { ChangePalletStatusModel, Cps } from './../../../shared/models/changePalletStatus';
import { Component, Input, OnInit } from '@angular/core';
import { AutoComplete } from 'src/app/shared/models/commonModel';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';
import { Helper } from 'src/app/shared/util/helper';
import { StringConstant } from 'src/app/shared/util/stringconstant';
import { Router } from '@angular/router';
import { PwmDialogService } from 'src/app/shared/service/pwm-dialog.service';
@Component({
  selector: 'quality-assurance-defects',
  templateUrl: './defects.component.html',
  styleUrls: ['./defects.component.css']
})
export class DefectsComponent implements OnInit {
  m: Cps;
  commentDisabled = false;
  categoryDescriptionDisabled = false;
  defectCategories: any;
  selectedDefects: any[];
  private subscriptions: Array<Subscription> = [];
  constructor(private cps: ChangePalletStatusModel, private service: ChangePalletStatusService,
    public appConfig: AppConfig, private router: Router, private location: Location, private dialogService: PwmDialogService) { }

  ngOnInit(): void {
    this.m = this.cps.getActual();
    this.m.details.message.show = false;
    this.loadQCIncident();
    this.loadCategory();
    this.m.defects.table.data.records.actual = this.m.details.table.data.records.selected;
    this.m.defects.table.data.totalRecords = this.m.defects.table.data.records.actual.length;

  }
  autoCompleteFilter(event, object: AutoComplete, key: string): void {
    object.filtered = object.actual.filter(m => m[key].toLowerCase().includes(event.query.toLowerCase()));
  }
  loadQCIncident(): void {
    this.subscriptions.push(this.service.getIncident(this.m).subscribe((res: any) => {
      if (res && res['records']) {
        this.m.defects.data.incident.actual =
          res['records'].map(d => Object.assign({}, d, {
            "label": d['comment'] ? `${d['expandedQcId']} - ${d['comment']}` : d['expandedQcId']
          }))
      }
    }));
  }
  loadCategory(): void {
    this.subscriptions.push(this.service.getDefectCategory(this.m).subscribe((res: any) => {
      if (res && res['records']) {
        this.m.defects.data.category.actual = res['records'];
      }
    }));
  }

  onQCIncidentSelection(event): void {
    this.m.details.message = { show: false, content: {} }
    if (this.m.defects.data.description.selected.length > 0) {
      this.m.details.message.show = true;
      this.m.details.message.onTop = true;
      this.m.details.message.content.severity = 'error';
      this.m.details.message.content.detail = StringConstant.QCOrCategoryValidation;
      this.m.defects.incident = undefined;
      return;
    }
    if (event) {
      this.commentDisabled = true;
      this.m.defects.comments = event.comment;
      this.categoryDescriptionDisabled = true;
      this.m.defects.category = '';
      this.m.defects.data.description.selected = [];
    }
  }
  clearQCIncident(event) {
    this.categoryDescriptionDisabled = false;
    this.commentDisabled = false;
  }
  onSelectCategory(event): void {
    this.m.details.message = { show: false, content: {} }
    this.loadCategoryDefects(event);
    this.commentDisabled = false;
  }
  loadCategoryDefects(event): void {
    this.subscriptions.push(this.service.getDefects(this.m).subscribe((res: any) => {
      if (res && res['records']) {
        this.m.defects.data.description.actual = res['records'];
      }
    }));
  }
  deleteDefects(): void {
    this.m.details.message = { show: false, content: {} }
    if (!this.selectedDefects || this.selectedDefects.length <= 0) {
      return;
    }
    const defectToDelete: any[] = this.selectedDefects.map(s => { return s['defectId'] });
    this.m.defects.data.description.selected = this.m.defects.data.description.selected.
      filter(category => !defectToDelete.includes(category.defectId));
      this.selectedDefects=null;
  }
  cancel(): void {
    this.m.details.message = { show: false, content: {} }
    this.m.actionCancelled = true;
    this.m.details.message.show = false;
    this.location.back();
  }
  onReset(): void {
    this.m.details.message = { show: false, content: {} }
    const inc = this.m.defects.data.incident.actual;
    const category = this.m.defects.data.category.actual;
    this.m.defects = this.cps.getDefaultDefects();
    this.m.defects.data.incident.actual = inc;
    this.m.defects.data.category.actual = category;
    this.categoryDescriptionDisabled = false;
  }
  updatePalletStatus(): void {
    this.m.details.message = { show: false, content: {} }
    if (!this.m.defects.incident && this.m.defects.data.description.selected.length == 0) {
      this.m.details.message.show = true;
      this.m.details.message.onTop = true;
      this.m.details.message.content.severity = 'error';
      this.m.details.message.content.detail = StringConstant.QCOrCategoryAndDefectValidation;
      return;
    }
    this.subscriptions.push(
      this.service.postPalletDefects(this.m).subscribe(
        res => {
          console.log(res);
          this.m.actionCancelled = false;
          const pallets = this.m.details.table.data.records.selected.map(pallet => pallet['palletId']).join(', ');
          this.m.actionMessage = Helper.StringFormat(StringConstant.SuccessMsgForStatusUpdation, this.m.details.status.to['value'], pallets);
          this.location.back();
        }, () => {
          // this.m.details.message.show = true;
          // this.m.details.message.onTop = true;
          // this.m.details.message.content.severity = 'error';
          // this.m.details.message.content.detail = StringConstant.CommomErrorMsg;
        }));
  }
  @Input() get selectedColumns(): any[] {
    return this.m.defects.table.columns.selected;
  }
  set selectedColumns(val: any[]) {
    this.m.defects.table.columns.selected = this.m.defects.table.columns.actual.filter(col => val.includes(col));
  }
}
