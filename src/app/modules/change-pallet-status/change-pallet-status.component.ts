import { Subscription } from 'rxjs';
import { ChangePalletStatusService } from './../../shared/service/change-pallet-status.service';
import { MenuItem } from 'primeng/api';
import { Table } from 'primeng/table';
import { Component, OnInit, ViewChild, Input, OnDestroy } from '@angular/core';
import { ChangePalletStatusModel, Cps } from './../../shared/models/changePalletStatus';
import { AppConfig } from 'src/app/shared/util/appConfig';
import { StringConstant } from 'src/app/shared/util/stringconstant';
import { Router } from '@angular/router';
import { Helper } from 'src/app/shared/util/helper';
import { RouterService } from 'src/app/shared/service/router.service';
import { UserAccess } from 'src/app/shared/util/user-access';
import { PwmDialogService } from 'src/app/shared/service/pwm-dialog.service';
import { ServiceConstants } from 'src/app/shared/util/service-constants';

@Component({
  selector: 'quality-assurance-change-pallet-status',
  templateUrl: './change-pallet-status.component.html',
  styleUrls: ['./change-pallet-status.component.css']
})
export class ChangePalletStatusComponent implements OnInit, OnDestroy {
  actionListAttribute = {
    'AvailableToBlock': false,
    'AvailableToHold': false,
    'AvailableToMill Claim': false,
    'BlockedToRelease': false,
    'BlockedToScrap': false,
    'HoldToRelease': false,
    'HoldToBlock': false,
    'HoldToScrap': false,
    'Mill ClaimToRelease': false,
    'Mill ClaimToScrap': false,
    'Mill ClaimToRe-Work': false,
    'BlockedToRe-Work': false,
    'HoldToRe-Work': false,
  }
  m: Cps;
  disableNodata = false;
  popup = { show: false, message: '' }
  tooltipText: string = StringConstant.ToolTip;
  @ViewChild('dtChangePallet', { static: false }) dt: Table
  private subscriptions: Array<Subscription> = [];
  constructor(private cps: ChangePalletStatusModel, private service: ChangePalletStatusService,
    public appConfig: AppConfig, private router: Router, private routerService: RouterService,
    private userAccess: UserAccess, private dialogService: PwmDialogService) { }
  ngOnInit(): void {
    this.userAccess.validateUserAcess(StringConstant.ChangePalletStatus, this.actionListAttribute);
    this.initForm();
  }
  @Input() get selectedColumns(): any[] {
    return this.m.details.table.columns.selected;
  }
  set selectedColumns(val: any[]) {
    this.m.details.table.columns.selected = this.m.details.table.columns.actual.filter(col => val.includes(col));
  }
  onSearch(): void {
    this.m.details.message = { show: false, content: {} }
    if (!this.validateForm())
      return;
    this.m.details.table.clear()
    if (this.dt && this.dt.filters) this.dt.filters = {};
    sessionStorage.removeItem(this.m.details.table.key);
    this.m.details.message = { show: false, content: {} }
    this.loadPallets();
    this.loadActionButton();
  }
  onLazyLoad(event: any): void {
    if (!this.dt) {
      return;
    }
    this.m.details.table.filter.limit = event.rows;
    this.m.details.table.filter.offset = event.first;
    if (event.sortField) {
      this.m.details.table.filter.order = event.sortField;
      this.m.details.table.filter.sort = event.sortOrder > 0 ? "asc" : "desc";
    }
    const gridFilter = Object.keys(event.filters).map(function (obj) {
      const operator = StringConstant.pTableFilterMatchMode.get(event.filters[obj].matchMode);
      return `${obj} ${operator} ${event.filters[obj].value}`
    });
    this.m.details.table.filter.query = gridFilter;
    this.loadPallets(true);
    return;
  }
  loadActionButton() {
    this.m.details.message = { show: false, content: {} }
    this.m.details.actionMenu = this.m.details.status.from.toStatus ? this.m.details.status.from.toStatus.map(status => {
      return {
        label: status,
        disabled: !this.actionListAttribute[`${this.m.details.status.from.description}To${status}`],
        command: () => {
          this.performAction(status);
        }
      }
    }) : [];
  }
  initForm(complete = false): void {
    const childPages = [
      StringConstant.PalletUrl,
      StringConstant.MaterialUrl,
      StringConstant.ChangePalletStatusDefects,
      StringConstant.ChangePalletStatusReWork
    ];
    if (!childPages.includes(this.routerService.getPreviousUrl().split('?')[0]) || complete) {
      this.m = this.cps.getDefault();
      this.loadStatus();
      return;
    }
    this.preserveState();
    this.m.defects = this.cps.getDefaultDefects();
    this.m.rework = this.cps.getDefaultRework();
  }
  preserveState(): void {
    this.m = this.cps.getActual();
    if (this.m)
      if (this.m.actionCancelled) {
        this.loadActionButton();
        return;
      }
      else {
        this.loadPallets(true);
        this.loadActionButton();
        this.m.details.message.show = true;
        this.m.details.message.onTop = true;
        this.m.details.message.content.severity = 'success';
        this.m.details.message.content.detail = this.m.actionMessage;
        this.removeGridSelection(this.m.details.table.key);
        this.m.details.table.data.records.selected = [];
        this.m.actionCancelled = true;
        return;
      }
    this.m = this.cps.getDefault();
    this.loadStatus();
  }
  loadStatus(): void {
    this.subscriptions.push(this.service.getStatus(this.m).subscribe(resp => {
      if (resp) {
        this.m.details.data.status.actual = resp;
        this.m.details.status.from = resp[0];
      }
    }));
    if (this.m.details.siteType != 3)
      return;
    this.subscriptions.push(this.service.getProducer(this.m).subscribe(resp => {
      if (resp) {
        this.m.details.data.producer.actual = resp;
        this.m.details.producer = resp[0];
      }
    }));
  }
  loadPallets(lazy = false): void {
    this.m.details.table.show = true;
    this.m.details.table.loading = true;
    this.subscriptions.push(this.service.getpallets(this.m).subscribe(res => {
      this.m.details.table.loading = false;
      if (res && res['records']) {
        this.m.details.table.data.records.actual = res['records'];
        this.m.details.table.data.totalRecords = res.totalRecords;
        this.disableNodata = false;
        return;
      }
      this.m.details.table.clear();
      this.disableNodata = !lazy;
    }, () => {//Error
      this.m.details.table.clear();
      this.disableNodata = !lazy;
    }));
  }
  routeDetailsPage(key: string, rowData: any): void {
    this.m.details.message.show = false;
    const routeUrl = key == 'palletId' ? StringConstant.PalletRout : StringConstant.MaterialUrl;
    const param = { siteId: this.m.details.siteId, palletId: rowData.palletId, materialId: rowData.materialId };
    this.router.navigate([routeUrl], { queryParams: param })
  }

  performAction(ref: string): void {
    this.m.details.message = { show: false, content: {} }
    this.m.details.message.show = false;
    this.m.details.status.to = this.m.details.data.status.actual.find(x => x['actionLabel'] == ref)
    if (['Release', 'Scrap'].includes(ref)) {
      this.popup.message = `${StringConstant.AreYouSureMsg} ${this.m.details.status.from['actionLabel']} to ${this.m.details.status.to['actionLabel']}?`;
      this.popup.show = true;
      return;
    }
    if (ref == 'Re-Work') {
      if (!this.m.details.table.data.records.selected.every(m => m['materialId'] == this.m.details.table.data.records.selected[0]['materialId'])) {
        this.m.details.message.show = true;
        this.m.details.message.onTop = true;
        this.m.details.message.content.severity = 'error';
        this.m.details.message.content.detail = StringConstant.materialIdDifferentMsg;
        return;
      }
      this.router.navigate([StringConstant.ChangePalletStatusReWork]);
      return;
    }
    this.router.navigate([StringConstant.ChangePalletStatusDefects]);
    return;
  }
  updatePalletStatus(): void {
    this.m.details.message = { show: false, content: {} }
    this.popup.show = false;
    this.popup.message = '';
    this.subscriptions.push(
      this.service.postPallet(this.m).subscribe(
        () => {
          this.m.details.message.show = true;
          this.m.details.message.onTop = true;
          this.m.details.message.content.severity = 'success';
          const pallets = this.m.details.table.data.records.selected.map(pallet => pallet['palletId']).join(', ');
          this.m.details.message.content.detail = Helper.StringFormat(StringConstant.SuccessMsgForStatusUpdation,
            this.m.details.status.to.description, pallets);
          this.removeGridSelection(this.m.details.table.key);
          this.m.details.table.data.records.selected = [];
          this.loadPallets(true);
        }, () => {
          // this.m.details.message.show = true;
          // this.m.details.message.onTop = true;
          // this.m.details.message.content.severity = 'error';
          // this.m.details.message.content.detail = Helper.StringFormat(StringConstant.CommomErrorMsg);
        }));
  }
  validateForm(): boolean {
    if (this.m.details.mfgDate.from && this.m.details.mfgDate.to && this.m.details.mfgDate.from > this.m.details.mfgDate.to) {
      this.m.details.message.show = true;
      this.m.details.message.onTop = true;
      this.m.details.message.content.severity = 'error';
      this.m.details.message.content.detail = StringConstant.DateErrMsg;
      return false;
    }
    return true;
  }
  removeGridSelection(key: string): void {
    let session = JSON.parse(sessionStorage.getItem(key));
    if (!session)
      return;
    session.selection = [];
    sessionStorage.setItem(key, JSON.stringify(session));
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
  }
  downloadFiles(fileType: string): void {
    this.subscriptions.push(this.service.downloadfile(this.m, fileType).subscribe((res: any) => {
      const fileName = fileType == 'pdf' ? "changePalletStatus.pdf" : "changePalletStatus.xlsx";
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
  formatPalletId(palletId: string): void {
    if (Helper.hasValue(palletId)) {
      palletId = palletId.indexOf('-') > -1 ? palletId : palletId.slice(0, 2) + "-" + palletId.slice(2);
      this.m.details.palletId = palletId;
    }
  }
}
