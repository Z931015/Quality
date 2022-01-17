import { Component, OnDestroy, OnInit, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { CombinePalletReq } from 'src/app/shared/models/combinePallet';
import { Materials } from 'src/app/shared/models/getMaterials';
import { Pallets } from 'src/app/shared/models/getPallets';
import { PwmPalletInquiryService } from 'src/app/shared/service/pwm-pallet-inquiry.service';
import { Helper } from 'src/app/shared/util/helper';
import { ServiceConstants } from 'src/app/shared/util/service-constants';
import { RouteConstants, StringConstant } from 'src/app/shared/util/stringconstant';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RouterService } from 'src/app/shared/service/router.service';
import { Subscription } from 'rxjs';
import { DateSearch } from 'src/app/shared/util/dateSearch';
import { UserAccess } from 'src/app/shared/util/user-access';
import { PwmDialogService } from 'src/app/shared/service/pwm-dialog.service';
import { PdfViewerComponent } from 'ng2-pdf-viewer';

@Component({
  selector: 'quality-assurance-pwm-combine-pallets',
  templateUrl: './pwm-combine-pallets.component.html',
  styleUrls: ['./pwm-combine-pallets.component.css']
})
export class PwmCombinePalletsComponent implements OnInit, OnDestroy {
  actionListAttribute = {
    combineSave: false
  }
  palletId: any;
  material: string;
  palletList: any = [];
  scanEnabled: boolean = false;
  printEnabled: boolean = false;
  cols: any = [];
  palletDetailsList: any = [];
  tableData: any = [];
  success: boolean;
  error: boolean;
  message: string = '';
  showPrintPreview = false;
  pdfByte: any;
  dateSelected: boolean;
  quantity: number;
  showScannedPallets: boolean;
  palletLst = [];
  filteredPalletId: any[];
  showMaterialLabel: boolean = true;
  tableDataList: any[] = [];
  showCombineMsgPopUp: boolean = false;
  displayWarningMsg: string;
  materialId: number;
  palletIdList: any[] = [];
  selectedDate = new Date();
  savedCombinePallet: any;
  showtbl: any;
  isPagination: boolean = false;
  totalRecords: number;
  recordLoaded: number;
  errQuantity: string;
  errCount: number = 0;
  maxDate: any;
  minDate: any;
  defaultDateSearch: DateSearch;
  private dependantDetailPages = RouteConstants.MaterialRoute;
  private subscriptions: Array<Subscription> = [];
  @ViewChild(PdfViewerComponent, { static: false })
  private pdfComponent: PdfViewerComponent;

  constructor(private palletInquriyService: PwmPalletInquiryService, private userAccess: UserAccess,
    private pallets: Pallets,
    private materialReq: Materials,
    private router: Router,
    private combinePalletReq: CombinePalletReq,
    public fb: FormBuilder, private dialogService: PwmDialogService,
    private routerService: RouterService) {
    this.defaultDateSearch = new DateSearch();
    this.minDate = new Date(1990, 0, 1);
    this.maxDate = new Date(2100, 11, 31);
  }

  ngOnInit(): void {
    this.userAccess.validateUserAcess(RouteConstants.fromcombinePalletScreen, this.actionListAttribute);
    this.recordLoaded = 20;
    this.cols = [
      { header: 'Pallet', field: 'palletId', sort: true },
      { header: 'Manufactured Date', field: 'manufacturingDateTime', sort: true },
      { header: 'Version', field: 'versionId', sort: true },
      { header: 'Batch Number', field: 'batchNumber', sort: true },
      { header: 'Line', field: 'lineId', sort: true },
      { header: 'Shift', field: 'shiftId', sort: true },
      { header: 'Crew', field: 'crewId', sort: true },
      { header: 'Quantity', field: 'quantity', sort: true },
      { header: 'Pallet Ticket', field: 'palletId', sort: true }
    ];
    if (!(this.routerService.getPreviousUrl().includes(this.dependantDetailPages))) {
      sessionStorage.removeItem('CombinePalletMaterial-Session')
      sessionStorage.removeItem('CombinePalletMaterialId-Session')
      sessionStorage.removeItem('CombinePalletList-Session')
      sessionStorage.removeItem('CombinePallet-PalletId-Session')
    }
    this.palletId = JSON.parse(sessionStorage.getItem('CombinePallet-PalletId-Session'));
    if (this.palletId) {
      this.scanEnabled = true;
    }
    this.material = JSON.parse(sessionStorage.getItem('CombinePalletMaterial-Session'));
    this.materialId = JSON.parse(sessionStorage.getItem('CombinePalletMaterialId-Session'));
    this.showMaterialLabel = !Helper.hasValue(this.material);
    this.showtbl = JSON.parse(sessionStorage.getItem("CombinePalletList-Session"));
    if (Helper.hasValue(this.showtbl)) {
      this.showScannedPallets = true;
      this.showtbl.forEach(element => {
        this.palletDetailsList.push(element);
        this.printEnabled = this.palletDetailsList.length > 1;
        this.totalRecords = this.palletDetailsList.length;
        this.isPagination = this.palletDetailsList.length > 20;
      })
    }
    this.getPalletList();
  }

  getPalletList() {
    this.subscriptions.push(this.palletInquriyService.getAllActivePalletsList(ServiceConstants.GetPallets, sessionStorage.getItem('siteId')).subscribe((res: any) => {
      if (res && res['records']) {
        this.palletLst = res['records'];

      }
    }));

  }
  searchPallet(event) {
    this.filteredPalletId = this.palletLst.filter(m => m.palletId?.toLowerCase().includes(event.query.toLowerCase()) || m?.fakeId?.toLowerCase().includes(event.query.toLowerCase()));
  }

  onSelectPallet(event) {
    this.message = '';
    this.success = false;
    this.error = false;
    this.scanEnabled = true;
    this.getMaterialField(event);
  }

  getMaterialField(event) {
    this.pallets.SiteId = sessionStorage.getItem('siteId');
    this.pallets.PalletId = event.palletId;
    this.subscriptions.push(this.palletInquriyService.getMaterialbasedOnselectedPallet(ServiceConstants.GetPallets, this.pallets).subscribe((res: any) => {
      if (!Helper.hasValue(res)) {
        this.scanEnabled = false;
        return false;
      } else {
        this.tableData = res;
        if (!Helper.hasValue(this.material) || this.palletDetailsList.length == 0) {
          this.material = res.materialDisplayText;
          this.materialId = res.materialId;
          this.message = '';
          this.showMaterialLabel = false;
        } else {
          if (this.material !== res.materialDisplayText) {
            this.error = true;
            this.success = false;
            this.message = StringConstant.combineErrorMsg;
            this.showMaterialLabel = false;
            this.scanEnabled = false;
          }
        }
      }

    }));

  }

  isValid(data) {
    let isPalletChanged;
    if (this.palletDetailsList.length == 0) {
      return true
    } else {
      this.palletDetailsList.forEach(element => {
        if (element.palletId == data.palletId) {
          isPalletChanged = element;
        }
      });

    }
    if (Helper.hasValue(isPalletChanged)) {
      return false
    } else { return true; }
  }

  scanPallet() {

    this.showScannedPallets = true;
    this.message = ''
    this.success = false;
    this.error = false;
    this.pallets.SiteId = sessionStorage.getItem('siteId');
    this.pallets.PalletId = this.palletId.palletId;
    this.subscriptions.push(this.palletInquriyService.getPalletPreferFakeId(ServiceConstants.GetPallets, this.pallets).subscribe((tableData: any) => {
      if (Helper.hasValue(tableData)) {
        if (this.isValid(tableData)) {
          //this.tableDataList.push(tableData)
          this.isPagination = this.palletDetailsList.length > 20;
          this.palletDetailsList.push(tableData);
          this.totalRecords = this.palletDetailsList.length;
          this.palletId = '';
          this.tableData = [];

        } else {
          this.success = false;
          this.error = true;
          this.message = StringConstant.palletAlreadyScannedMsg;

        }
      }
      if (this.palletDetailsList.length == 0) {
        this.showCombineMsgPopUp = true;
        this.displayWarningMsg = StringConstant.wariningMsgForCombinePallet;
        this.printEnabled = false;
      } else if (this.palletDetailsList.length > 1) {
        this.printEnabled = true;
      }
    }));


  }

  printPalletTicket() {
    this.quantity = 1;
    this.selectedDate = new Date();
    this.dateSelected = false;
    this.combinePalletReq.siteId = sessionStorage.getItem('siteId');
    this.palletIdList = [];
    this.palletDetailsList.forEach(element => {
      this.palletIdList.push(element.palletId)
    });
    this.combinePalletReq.palletIds = this.palletIdList ? this.palletIdList : [];
    this.combinePalletReq.userSuppliedMfgDateTime = this.selectedDate ? this.selectedDate : null;
    this.combinePalletReq.printCopies = this.quantity;
    this.onValidate();
    if (this.errCount == 0) {
      this.subscriptions.push(
        this.palletInquriyService.post(ServiceConstants.printCombinePalletPreview, this.combinePalletReq).
          subscribe((res: any) => {
            this.showPrintPreview = true;
            this.pdfByte = this._base64ToArrayBuffer(res.pdfByte);
            this.quantity = res.noOfCopies;
          }));
    }
  }


  onPrint() {
    this.combinePalletReq.siteId = sessionStorage.getItem('siteId');
    this.palletIdList = [];
    this.palletDetailsList.forEach(element => {
      this.palletIdList.push(element.palletId)
    });
    this.combinePalletReq.palletIds = this.palletIdList ? this.palletIdList : [];
    this.combinePalletReq.userSuppliedMfgDateTime = this.selectedDate ? this.selectedDate : null;
    this.combinePalletReq.printCopies = this.quantity;
    this.onValidate();
    if (this.errCount == 0) {
      this.subscriptions.push(this.palletInquriyService.post(ServiceConstants.printCombinePallet, this.combinePalletReq).subscribe((res) => {
        this.showPrintPreview = false;
        this.success = true;
        this.error = false;
        this.message = "The Pallet Ids : " + this.palletIdList + " Successfully Combined.";
        this.showScannedPallets = false;
        this.palletDetailsList = [];
        this.tableDataList = [];
        this.material = '';
        this.scanEnabled = false;
        this.printEnabled = false;
        this.showMaterialLabel = true;
        this.quantity = null;
        this.getPalletList();
      }));
    }
  }

  keydown(event: any, item) {
    if (item === 'quantity') {
      this.errQuantity = '';
    }
  }
  onDeleteClick(index) {
    this.palletDetailsList.splice(index, 1);
    this.totalRecords = this.totalRecords - 1;
    if (this.palletDetailsList.length == 0) {
      this.showCombineMsgPopUp = true;
      this.displayWarningMsg = StringConstant.wariningMsgForCombinePallet;
      this.printEnabled = false;
      this.material = '';
      this.scanEnabled = false;
      this.showScannedPallets = false;
      this.palletDetailsList = [];
      this.message = '';
      this.success = false;
      this.error = false;
      this.showMaterialLabel = true;
    } else if (this.palletDetailsList.length <= 1) {
      this.printEnabled = false;
      this.showMaterialLabel = false;
    } else if (this.palletDetailsList.length < 20) {
      this.isPagination = false;
    }
  }

  onMaterialClick() {
    this.materialReq.SiteId = sessionStorage.getItem('siteId');
    this.materialReq.MaterialId = this.materialId;
    sessionStorage.setItem("CombinePalletMaterial-Session", JSON.stringify(this.material));
    sessionStorage.setItem("CombinePalletList-Session", JSON.stringify(this.palletDetailsList));
    sessionStorage.setItem("CombinePalletMaterialId-Session", JSON.stringify(this.materialId));
    sessionStorage.setItem("CombinePallet-PalletId-Session", JSON.stringify(this.palletId));
    this.router.navigate([RouteConstants.MaterialRoute], {
      queryParams: {
        siteId: this.materialReq.SiteId,
        materialId: this.materialReq.MaterialId,
      }
    });
  }

  keyPressNumbers(event) {
    var charCode = (event.which) ? event.which : event.keyCode;
    // Only Numbers 0-9
    if ((charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }
  onValidate() {
    this.errCount = 0;
    if (!Helper.hasValue(this.quantity)) {
      this.errQuantity = 'Print Quantity is required';
      this.errCount++;
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
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
  handlePdfLoaded(event): void {
    this.pdfComponent.pdfViewerContainer.nativeElement.style.position = 'relative';
  }
}
