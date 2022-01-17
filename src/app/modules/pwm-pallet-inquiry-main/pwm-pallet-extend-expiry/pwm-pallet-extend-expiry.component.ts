import { AutoComplete } from './../../../shared/models/commonModel';
import { Helper } from './../../../shared/util/helper';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { RouterService } from 'src/app/shared/service/router.service';
import { PwmPalletInquiryService } from '../../../shared/service/pwm-pallet-inquiry.service';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import * as moment from 'moment';
import { ServiceConstants } from '../../../shared/util/service-constants';
import { RouteConstants, StringConstant } from '../../../shared/util/stringconstant';
import { SaveClear } from '../../../shared/models/saveClear';
import { ExtendedExpirySearch, IExtendExpiryModel } from '../../../shared/models/extendedExpirySearch';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { AppConfig } from 'src/app/shared/util/appConfig';
import { UserAccess } from 'src/app/shared/util/user-access';
import { PwmDialogService } from 'src/app/shared/service/pwm-dialog.service';
@Component({
  selector: 'quality-assurance-pwm-pallet-extend-expiry',
  templateUrl: './pwm-pallet-extend-expiry.component.html',
  styleUrls: ['./pwm-pallet-extend-expiry.component.css']
})
export class PwmPalletExtendExpiryComponent implements OnInit, OnDestroy {
  actionListAttribute = {
    extendedSaveOrClear: false
  }
  m: IExtendExpiryModel;
  datePipe = new DatePipe('en-US');
  itemSize = StringConstant.itemSize;
  diableNoData = false;
  initialExtLoad = true;
  toolTip = StringConstant.ToolTip;
  @ViewChild('dt', { static: false }) dt: Table;
  private subscriptions: Array<Subscription> = [];
  constructor(public appConfig: AppConfig, private palletInquriyService: PwmPalletInquiryService, private extService: ExtendedExpirySearch,
    private router: Router, private routerService: RouterService, private userAccess: UserAccess,
    private confirmationService: ConfirmationService, private saveClearReq: SaveClear,
    private dialogService: PwmDialogService) { }
  ngOnInit(): void {
    this.resetModel();
    this.userAccess.validateUserAcess(StringConstant.ExtendedParentPage, this.actionListAttribute);
  }
  autoCompleteFilter(event, object: AutoComplete, key: string): void {
    if(key=="palletId")
    {
      object.filtered = object.actual.filter(m => m.palletId?.toLowerCase().includes(event.query.toLowerCase())||m.fakeId?.toLowerCase().includes(event.query.toLowerCase()));
      return;
    }
    object.filtered = object.actual.filter(m => m[key].toLowerCase().includes(event.query.toLowerCase()));
  }
  loadAutoComplete(): void {
    this.subscriptions.push(this.palletInquriyService.getAllPalletsList(ServiceConstants.GetPallets, sessionStorage.getItem('siteId')).subscribe((res: any) => {
      if (res && res['records']) {
        this.m.data.palletFrom.actual = res['records'];//.map(obj => obj['palletId']);
        this.m.data.palletTo.actual = this.m.data.palletFrom.actual;
      }
    }));

    this.subscriptions.push(this.palletInquriyService.getAllMaterialsList(ServiceConstants.GetMaterials, sessionStorage.getItem('siteId')).subscribe((res: any) => {
      if (res && res['records']) {
        this.m.data.material.actual = res['records'];
      }
    }));
  }

  @Input() get selectedColumns(): any[] {
    return this.m.table.columns.selected;
  }

  set selectedColumns(val: any[]) {
    this.m.table.columns.selected = this.m.table.columns.actual.filter(col => val.includes(col));
  }

  onSearch(): void {
    if (!this.validateForm())
      return;
    this.m.table.clear();
    if (this.dt && this.dt.filters) this.dt.filters = {};
    sessionStorage.removeItem(this.m.table.key);
    this.initialExtLoad = true;
    this.m.message = { show: false, content: {} }
    this.loadPalletDetails();
  }
  validateForm(): boolean {
    if (!this.m.material || !this.m.extendExpiryDate)
      if (!this.m.material) {
        this.m.message = {
          show: true, onTop: true, content: {
            severity: StringConstant.Err, detail: (this.m.extendExpiryDate ? StringConstant.MatErrMsg : StringConstant.MatExtErrMsg)
          }
        };
        return false;
      }
    if (!this.m.extendExpiryDate || this.m.extendExpiryDate < (new Date())) {
      this.m.message = {
        show: true, onTop: true, content: {
          severity: StringConstant.Err, detail: (this.m.extendExpiryDate == null ? StringConstant.ExtErrMsg : StringConstant.maualDateErr)
        }
      };
      return false;
    }
    this.m.message.show = false;
    return true;
  }
  confirm(expiryDate?: Date): void {
    if (!this.validateForm())
      return;
    this.confirmationService.confirm({
      message: expiryDate == null ? StringConstant.Clear : Helper.StringFormat(StringConstant.Save, moment(expiryDate).format(StringConstant.DateOnly)),
      key: 'cdb',
      acceptLabel: "Ok",
      rejectLabel: "Cancel",
      rejectIcon: "",
      header: "PWM Message",
      acceptIcon: "",
      acceptButtonStyleClass: "p-button-outlined p-button-warning p-button-sm",
      rejectButtonStyleClass: "p-button-outlined p-button-warning p-button-sm",
      accept: () => {
        const requestPayload = {
          siteId: this.m.siteId,
          materialId: this.m.material['materialID'],
          manualExpirationDate: expiryDate == null ? null : moment(expiryDate).format(StringConstant.DateSZ),
          palletIds: this.m.table.data.records.selected.map(pallet => pallet['palletId']),
          userId: sessionStorage.getItem('userId')
        };
        this.subscriptions.push(this.palletInquriyService.saveOrClearExtendExpiryDate(ServiceConstants.GetPallets, requestPayload).subscribe((res: any) => {
          if (res) {
            this.loadPalletDetails();
            this.m.table.data.records.selected = [];
            this.m.message = { show: true, onTop: false, content: { severity: StringConstant.Success, detail: (expiryDate == null ? StringConstant.ClearMsg : StringConstant.SaveMsg) + requestPayload.palletIds } }
          }
        }));
      }
    });
  }
  downloadFiles(filtType: string): void {
    const selectCol = this.m.table.columns.selected.map(col => col.field);
    this.subscriptions.push(this.palletInquriyService.downloadFiles(ServiceConstants.GetPallets, filtType, selectCol, this.m).subscribe((res: any) => {
      const fileName = filtType == 'pdf' ? "extendExpiry.pdf" : "extendExpiry.xlsx";
      const downloadFile = (res, fileName) => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(res);
        link.download = fileName;
        document.body.append(link);
        link.click();
        link.remove();
        setTimeout(() => URL.revokeObjectURL(link.href), 7000);
      };
      downloadFile(new Blob([res]), fileName);
    }));
  }
  hyperlinkAction(field, rowData): void {
    if (field === StringConstant.FeildPallet) {
      this.router.navigate([StringConstant.PalletRout], { queryParams: { siteId: this.m.siteId, palletId: rowData.palletId, } });
    }
    else if (field === StringConstant.FeildMaterial) {
      this.router.navigate([RouteConstants.MaterialRoute], { queryParams: { siteId: this.m.siteId, materialId: rowData.materialId, } });
    }
  }

  onReset(): void {
    this.resetModel(true);
  }
  extendedlazyLoad(event): void {
    if (this.initialExtLoad) {
      this.initialExtLoad = false;
      return;
    }
    this.m.table.data.records.selected = [];
    this.m.table.filter.limit = event.rows;
    this.m.table.filter.offset = event.first;
    if (event.sortField) {
      this.m.table.filter.order = event.sortField;
      this.m.table.filter.sort = event.sortOrder > 0 ? "asc" : "desc";
    }
    const gridFilter = Object.keys(event.filters).map(function (obj) {
      const operator = StringConstant.pTableFilterMatchMode.get(event.filters[obj].matchMode);
      return `${obj} ${operator} ${event.filters[obj].value}`
    });
    this.m.table.filter.query = gridFilter;
    this.loadPalletDetails(true);
  }
  loadPalletDetails(isLazyLoad = false): void {
    this.m.table.show = true;
    this.m.table.loading = true;
    this.subscriptions.push(this.palletInquriyService.getPalletsExtendedSearch(ServiceConstants.GetPallets, this.m).subscribe((res: any) => {
      this.m.table.loading = false;
      if (res && res['records']) {
        this.m.table.data.records.actual = res['records'];
        this.m.table.data.totalRecords = res.totalRecords;
        this.diableNoData = false;
        return;
      }
      this.m.table.clear();
      this.diableNoData = !isLazyLoad;
    }, () => {//Error
      this.m.table.clear();
      this.diableNoData = !isLazyLoad;
    }));
  }
  resetModel(complete = false): void {
    if (![StringConstant.PalletUrl, StringConstant.MaterialUrl, StringConstant.ExtendedParentPage].includes(this.routerService.getPreviousUrl().split('?')[0]) || complete) {
      this.m = this.extService.getDefault();
      this.loadAutoComplete();
      return;
    }
    this.m = this.extService.getActual();
    if (this.m)
      return;
    this.m = this.extService.getDefault();
    this.loadAutoComplete();
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
  }
}


