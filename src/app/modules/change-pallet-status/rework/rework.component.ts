import { AutoComplete } from './../../../shared/models/commonModel';
import { AppConfig } from 'src/app/shared/util/appConfig';
import { ChangePalletStatusService } from './../../../shared/service/change-pallet-status.service';
import { Cps, ChangePalletStatusModel } from './../../../shared/models/changePalletStatus';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { StringConstant } from 'src/app/shared/util/stringconstant';
import { Helper } from 'src/app/shared/util/helper';
import { Router } from '@angular/router';
import { UserAccess } from 'src/app/shared/util/user-access';
import { PwmDialogService } from 'src/app/shared/service/pwm-dialog.service';
import { PdfViewerComponent } from 'ng2-pdf-viewer';

@Component({
  selector: 'quality-assurance-rework',
  templateUrl: './rework.component.html',
  styleUrls: ['./rework.component.css']
})
export class ReworkComponent implements OnInit {
  actionListAttributeRework = {
    materialTransfer: false
  }
  actionListAttribute = {
    blockedOrHoldToReworkPrint: false,
    millClaimToReworkPrint: false
  }
  m: Cps;
  showPrintPreview = false;
  pdfByte: any;
  enableMfgDate = false;
  enableContainerType = false;

  @ViewChild(PdfViewerComponent, {static: false})
  private pdfComponent: PdfViewerComponent;

  showContainerType: boolean = false;

  constructor(private cps: ChangePalletStatusModel,
    private service: ChangePalletStatusService,
    public appConfig: AppConfig,
    private location: Location,
    private router: Router,
    private userAccess: UserAccess,
    private dialogService: PwmDialogService) { }
  ngOnInit(): void {
    if (!this.showPrintPreview) {
      this.userAccess.validateUserAcess(StringConstant.ChangePalletStatusReWork, this.actionListAttributeRework);
    }
    this.m = this.cps.getActual();
    this.m.details.message.show = false;
    this.m.rework = this.cps.getDefaultRework();
    this.m.rework.table.data.records.actual = this.m.details.table.data.records.selected.map(d => Object.assign({}, d, { "recoveredQty": 0 }));
    this.m.rework.table.data.totalRecords = this.m.rework.table.data.records.actual.length;
    this.m.rework.quantity.actual = this.m.rework.table.data.records.actual.reduce((total, data) => { total += data['quantity']; return total }, 0);
    this.m.rework.quantity.recover = 0;
    this.loadMaterial();
  }
  @Input() get selectedColumns(): any[] {
    return this.m.rework.table.columns.selected;
  }
  set selectedColumns(val: any[]) {
    this.m.rework.table.columns.selected = this.m.rework.table.columns.actual.filter(col => val.includes(col));
  }
  autoCompleteFilter(event, object: AutoComplete, key: string): void {
    object.filtered = object.actual.filter(m => m[key].toLowerCase().includes(event.query.toLowerCase()));
  }
  loadMaterial(): void {
    this.service.getMaterialsDefaultQuantity(this.m.details.table.data.records.selected[0]['materialId'], this.m.rework.siteId).subscribe(resp => {
      this.m.rework.material.maxQuantity = resp['defaultQuantity'];
      this.m.rework.quantity.maxRecover = resp['defaultQuantity'];
    });
    if (this.actionListAttributeRework.materialTransfer)
      this.service.getMaterials(this.m.details.table.data.records.selected[0]['materialId'], this.m.rework.siteId).subscribe(resp => {
        this.m.rework.data.material.actual = resp['records'];
        this.m.rework.material.data = resp;
      });
  }
  changeQuantity(): void {
    //this.m.details.message = { show: false, content: {} }
    this.m.rework.quantity.recover = this.m.rework.table.data.records.actual.reduce((total, data) => { total += data['recoveredQty']; return total }, 0);
  }
  save(): void {
    this.m.details.message = { show: false, content: {} }
    if (this.m.rework.quantity.maxRecover < this.m.rework.quantity.recover) {
      this.m.details.message.show = true;
      this.m.details.message.onTop = true;
      this.m.details.message.content.severity = 'error';
      this.m.details.message.content.detail = StringConstant.recoveredQtyIsGreater;
      return;
    }
    if (!this.m.rework.table.data.records.actual.every(col => col.recoveredQty > 0)) {
      this.m.details.message.show = true;
      this.m.details.message.onTop = true;
      this.m.details.message.content.severity = 'error';
      const pallets = this.m.rework.table.data.records.actual.filter(col => col.recoveredQty == 0 || col.recoveredQty == null).map(pallet => { return pallet.palletId });
      this.m.details.message.content.detail = Helper.StringFormat(StringConstant.recoverdQtyError, pallets.toString());
      return;
    }
    this.m.details.message.show = false;
    this.service.postPalletRework(this.m, true).subscribe(resp => {
      this.pdfByte = this._base64ToArrayBuffer(resp.pdfByte);
      this.m.rework.data.containerType.actual = Helper.hasValue(resp.containerTypes) ? resp.containerTypes.map(d => Object.assign({}, d, { "label": `${d['type']} - ${d['description']}` })) : [];
      this.showContainerType = Helper.hasValue(resp.containerTypes) ? true : false;
      this.m.rework.noOfCopies = resp.noOfCopies;
      this.showPrintPreview = true;
      this.userAccess.validateUserAcess(StringConstant.ChangePalletStatusReWorkPrint, this.actionListAttribute);// final print
    }, () => {
      this.showPrintPreview = false;
    });
  }
  _base64ToArrayBuffer(base64: string): ArrayBufferLike {
    const binary_string = window.atob(base64.replace(/\\n/g, ''));
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }
  cancel(): void {
    this.m.details.message = { show: false, content: {} }
    this.m.rework = this.cps.getDefaultRework();
    this.location.back();
  }
  printReWork(): void {
    this.m.details.message = { show: false, content: {} }
    this.showPrintPreview = false;
    this.service.postPalletRework(this.m, false).subscribe(resp => {
      this.m.actionCancelled = false;
      const pallets = this.m.details.table.data.records.selected.map(pallet => pallet['palletId']).join(', ');
      this.m.actionMessage = Helper.StringFormat(StringConstant.SuccessMsgForStatusUpdation, this.m.details.status.to['value'], pallets);
      this.router.navigate([StringConstant.ChangePalletStatus]);
    }, () => {
      // this.m.actionCancelled = true;
      // this.m.details.message.show = true;
      // this.m.details.message.onTop = true;
      // this.m.details.message.content.severity = 'error';
      // this.m.details.message.content.detail = StringConstant.CommomErrorMsg;
    });
  }
  handlePdfLoaded(event): void {
    this.pdfComponent.pdfViewerContainer.nativeElement.style.position='relative';
  }
}
