import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { Table } from 'primeng/table';
import { PwmPalletInquiryService } from 'src/app/shared/service/pwm-pallet-inquiry.service';
import { Helper } from 'src/app/shared/util/helper';
import { ServiceConstants } from 'src/app/shared/util/service-constants';
import { RouteConstants, StringConstant } from 'src/app/shared/util/stringconstant';
import { Subscription } from 'rxjs';
import { RouterService } from 'src/app/shared/service/router.service';
import { UserAccess } from 'src/app/shared/util/user-access';
import { PwmDialogService } from 'src/app/shared/service/pwm-dialog.service';

@Component({
  selector: 'quality-assurance-pwm-definable-shipping-parameters-grid',
  templateUrl: './pwm-definable-shipping-parameters-grid.component.html',
  styleUrls: ['./pwm-definable-shipping-parameters-grid.component.css']
})
export class PwmDefinableShippingParametersGridComponent implements OnInit, OnDestroy {
  actionListAttribute = {
    dspAdd: false,
    dspEdit: false,
    dspDelete: false
  }
  @ViewChild('dt', { static: false }) dt: Table;
  cols = [
    { field: 'dspNumber', header: 'DSP Number', sort: true, placeholder: 'Enter DSP Number', searchWidth: '100px', width: '9%', search: true },
    { field: 'status', header: 'Status', sort: true, placeholder: 'Enter Status', searchWidth: '77px', width: '5%', search: true },
    { field: 'producerId', header: 'Producer', sort: true, placeholder: 'Enter Producer ID', searchWidth: '90px', width: '6%', search: true },
    { field: 'comments', header: 'Comments', sort: true, placeholder: 'Enter Comments', searchWidth: '110px', width: '50%', search: true },
    { field: 'lastUser', header: 'Last User', sort: true, width: '7%', search: false },
    { field: 'lastUpdateDateTime', header: 'Last Updated', sort: true, searchWidth: '84px', width: '12%', search: false }
  ];
  shippingParametersList: any = [];
  isPagination: boolean;
  totalRecords: number;
  _selectedColumns: any = [];
  success: boolean;
  error: boolean;
  message: string;
  loading: boolean;
  private subscriptions: Array<Subscription> = [];
  dependentPage = [StringConstant.DSPDetails];
  showGrid: boolean;
  printDisabled: boolean;
  toolTip = StringConstant.ToolTip

  constructor(private service: PwmPalletInquiryService, private router: Router,
    private confirmationService: ConfirmationService, private routerService: RouterService,
    private userAccess: UserAccess, private dialogService: PwmDialogService) { }

  ngOnInit(): void {
    this.userAccess.validateUserAcess(RouteConstants.ShippingParameterGrid, this.actionListAttribute);
    let savedDisplay = JSON.parse(sessionStorage.getItem("dsp-customise-display"));
    this._selectedColumns = !Helper.hasValue(savedDisplay) ? this.cols : this.cols.filter(col => savedDisplay.some(sd => sd.field === col.field));

    if ([RouteConstants.ShippingParameterDetails, RouteConstants.ShippingParameterGrid].includes(this.routerService.getPreviousUrl())) {
      this.message = this.service.message;
      this.success = this.service.isSuccess == true ? true : false;
      this.error = Helper.hasValue(this.message) && this.service.isSuccess == false ? true : false;
      this.getShippingParameters();
    }
    else {
      this.message = ''
      this.success = false;
      this.error = false;
      this.getShippingParameters();
    }

  }

  @Input() get selectedColumns(): any[] {
    this.showGrid = this._selectedColumns.length > 0 ? true : false;
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    this._selectedColumns = this.cols.filter(col => val.includes(col));
    sessionStorage.setItem("dsp-customise-display", JSON.stringify(this._selectedColumns));
  }

  getShippingParameters() {

    let finalQueryStr = `q=${StringConstant.StatusFilterForDSP}`;
    if (!Helper.hasValue(this.service.screenToNavigate) || !this.dependentPage.includes(this.service.screenToNavigate)) {
      sessionStorage.removeItem('dspGridFilter')
      sessionStorage.removeItem('dsp-customise-display')
      sessionStorage.removeItem('dspGrid-session');
      sessionStorage.setItem('dspGridFilter', finalQueryStr);
    }
    else {
      finalQueryStr = sessionStorage.getItem('dspGridFilter');
    }

    this.shippingParametersList = [];
    let siteId = sessionStorage.getItem('siteId');
    let query: string[] = [];
    query.push(`limit=${StringConstant.Limit}`);//lastUpdateDateTime
    query.push(`offset=${StringConstant.Offset}`);
    query.push(`order=lastUpdateDateTime`);
    query.push(`sort=desc`);
    let finalQuery = query.join('&');
    this.loading = true;
    this.subscriptions.push(this.service.getDetailsBasedOnQuery(ServiceConstants.DefinableShippingParameter, siteId, finalQuery, finalQueryStr).subscribe(res => {
      if (res && res['records']) {
        this.shippingParametersList = res['records'];
        this.totalRecords = res['totalRecords'];
        this.isPagination = this.totalRecords > 15 ? true : false;
        this.printDisabled = false;
      } else {
        this.totalRecords = 0;
        this.isPagination = false;
        this.printDisabled = true;
      }
      this.loading = false;
    }))
  }

  printGridDetails() {
    let siteId = sessionStorage.getItem('siteId');
    let query = StringConstant.StatusFilterForDSP;
    const selectedCols = this._selectedColumns.map(col => col.field)
    this.loading = true;
    this.service.printGridDetails(ServiceConstants.DefinableShippingParameter, siteId, query, selectedCols).subscribe(data => {
      const downloadFile = (data, fileName) => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(data);
        link.download = fileName;
        document.body.append(link);
        link.click();
        link.remove();
        setTimeout(() => URL.revokeObjectURL(link.href), 7000);
      };
      downloadFile(new Blob([data]), "DSPGridDetails.pdf");
      this.loading = false;
    })

  }

  onDelete(rowData) {
    let siteId = sessionStorage.getItem('siteId');
    this.confirmationService.confirm({
      message: `${'Are you sure that you want to delete DSP Number '}${rowData.dspNumber}${'?'}`,
      header: 'Confirmation',
      accept: () => {
        this.service.delete(ServiceConstants.DSP, rowData.dspNumber, siteId).subscribe(res => {
            this.success = true;
            this.message = StringConstant.SuccessMessageForDelete;
            this.getShippingParameters();
        });
      }
    });
  }

  createShippingParameter() {
    this.service.screenType = StringConstant.Create;
    this.router.navigate([`${RouteConstants.ShippingParameterDetails}`]);
  }

  showDetails(rowData) {
    this.service.screenType = StringConstant.Edit;
    this.service.dspNumber = rowData.dspNumber;
    this.router.navigate([`${RouteConstants.ShippingParameterDetails}`]);
  }

  clearMessage() {
    this.success = false;
    this.error = false;
    this.message = '';
  }
  disableDeleteDSP(rowData: any): boolean {
    return Number(rowData.producerId) != Number(sessionStorage.getItem('siteId'));
  }
  onLazyLoad(event) {
    sessionStorage.removeItem('dspGridFilter')
    sessionStorage.removeItem('dspGrid-session')
    sessionStorage.setItem('dspGrid-session', JSON.stringify(event.filters));
    let siteId = sessionStorage.getItem('siteId');
    let statusFilter = StringConstant.StatusFilterForDSP;
    let query: string[] = [];
    query.push(`limit=${StringConstant.Limit}`);
    query.push(`offset=${event.first}`);
    if (event.sortField) {
      query.push(`order=${event.sortField}`);
      let sortOrder = event.sortOrder > 0 ? "asc" : "desc";
      query.push(`sort=${sortOrder}`);
    }
    else {
      query.push(`order=lastUpdateDateTime`);
      query.push(`sort=desc`);
    }
    let finalQuery = query.join('&');

    let finalStr: string[] = [];
    finalStr.push(statusFilter);
    let gridFilter = Object.keys(event.filters).map(function (obj) {
      const operator = StringConstant.pTableFilterMatchMode.get(event.filters[obj].matchMode);
      return `${obj} ${operator} ${event.filters[obj].value}`
    });
    finalStr = finalStr.concat(gridFilter);
    let filterQuery = 'q=' + finalStr.join(' and ');
    sessionStorage.setItem('dspGridFilter', filterQuery);

    this.loading = true;
    this.subscriptions.push(this.service.getDetailsBasedOnQuery(ServiceConstants.DefinableShippingParameter, siteId, finalQuery, filterQuery).subscribe(res => {
      if (res && res['records']) {
        this.shippingParametersList = res['records'];
        this.totalRecords = res['totalRecords'];
        this.isPagination = this.totalRecords > 15 ? true : false;
        this.printDisabled = false;
      } else {
        this.shippingParametersList = [];
        this.totalRecords = 0;
        this.isPagination = false;
        this.printDisabled = true;
      }
      this.loading = false;
    }))
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
  }
}
