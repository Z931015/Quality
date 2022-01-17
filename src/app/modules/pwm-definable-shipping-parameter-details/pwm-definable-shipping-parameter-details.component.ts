import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PwmPalletInquiryService } from 'src/app/shared/service/pwm-pallet-inquiry.service';
import { RouteConstants, StringConstant } from 'src/app/shared/util/stringconstant';
import { DatePipe, Location } from '@angular/common';
import { ServiceConstants } from 'src/app/shared/util/service-constants';
import { ShippingParameterDetails } from 'src/app/shared/models/shippingParameterDetails';
import { Helper } from 'src/app/shared/util/helper';
import { Subscription } from 'rxjs';
import { Materials } from 'src/app/shared/models/getMaterials';
import { RouterService } from 'src/app/shared/service/router.service';
import { PwmDialogService } from 'src/app/shared/service/pwm-dialog.service';

@Component({
  selector: 'quality-assurance-pwm-definable-shipping-parameter-details',
  templateUrl: './pwm-definable-shipping-parameter-details.component.html',
  styleUrls: ['./pwm-definable-shipping-parameter-details.component.css']
})
export class PwmDefinableShippingParameterDetailsComponent implements OnInit {

  dspDetails: FormGroup;
  datePipe = new DatePipe('en-US');
  screenType: any;
  typeList: any = [];
  palletList: any = [];
  materialList: any = [];
  lineList: any = [];
  shiftList: any = [];
  crewList: any = [];
  siteList: any = [];
  status: string;
  materialSelected: boolean;
  palletDetailsList: any[];
  materialDetailsList: any[];
  lineDetailsList: any[];
  shipmentTypes: any[];
  details: any;
  private subscriptions: Array<Subscription> = [];
  dependentPages = RouteConstants.MaterialRoute;
  sessionDetails: any;
  errCount: number;
  palletToMessage: string;
  palletFromMessage: string;
  fromDateMessage: string;
  toDateMessage: string;
  childSubscriptions = 0;
  itemSize = StringConstant.itemSize;
  saveDisabled = false;
  constructor(private service: PwmPalletInquiryService, private formBuilder: FormBuilder, private router: Router, private location: Location,
    private detailsReq: ShippingParameterDetails, private materialReq: Materials, private routerService: RouterService, private dialogService: PwmDialogService) { }

  ngOnInit(): void {
    this.screenType = this.service.screenType;
    this.dspDetails = this.formBuilder.group({
      'type': ['', Validators.required],
      'dspNumber': [''],
      'lastModified': [''],
      'lastUser': [''],
      'producerId': [''],
      'palletIdFrom': [''],
      'palletIdTo': [''],
      'material': [''],
      'line': [''],
      'shift': [''],
      'crew': [''],
      'site': [''],
      'manufacturedDateFrom': [''],
      'manufacturedDateTo': [''],
      'status': [''],
      'comments': ['']
    });
    this.shipmentTypes = [
      { type: "T", description: "Do not allow shipment to Selected sites" },
      { type: "S", description: "Do not allow shipment to Any site" },
      { type: "R", description: "Allow shipment to Selected sites" }
    ];
    this.getPallets();
    this.getMaterials();
    this.getLines();
    this.getShift();
    this.getCrew();
    this.getSites();
  }

  getDSPDetails() {
    if (this.childSubscriptions < 5) {
      this.childSubscriptions++;
      return;
    }
    if (this.routerService.getPreviousUrl().includes(this.dependentPages)) {
      this.getSessionDetails();
      return;
    }
    sessionStorage.removeItem('dspDetails')
    if (this.screenType == StringConstant.Create) {
      this.status = "A"
      this.dspDetails.patchValue({
        type: { type: "T", description: "Do not allow shipment to Selected sites" }
      });
      return;
    }
    let dspNumber = this.service.dspNumber;
    let siteId = sessionStorage.getItem('siteId');
    this.subscriptions.push(this.service.getDetails(ServiceConstants.DSP, dspNumber, siteId).subscribe((res: any) => {
      this.details = res;
      this.materialSelected = Helper.hasValue(this.details.materialId) ? true : false;
      if (this.screenType == StringConstant.Edit && Number(res.producerId) != Number(siteId))
        this.saveDisabled = true;
      this.dspDetails.patchValue({
        dspNumber: res.dspNumber,
        producerId: res.producerId + '-' + res.producerName,
        lastModified: Helper.getMomentDate(res.lastUpdateDateTime, 'MM/DD/YYYY h:mm A'),
        lastUser: res.lastUser,
        type: Helper.hasValue(this.details.type) ? this.shipmentTypes.find(x => x.type == this.details.type) : '',
        palletIdFrom: Helper.hasValue(this.details.startPalletId) ? this.palletDetailsList.find(x => x.palletId == this.details.startPalletId) : '',
        palletIdTo: Helper.hasValue(this.details.endPalletId) ? this.palletDetailsList.find(x => x.palletId == this.details.endPalletId) : '',
        material: Helper.hasValue(this.details.materialId) ? this.materialDetailsList.find(x => x.materialID == this.details.materialId) : '',
        line: Helper.hasValue(this.details.lines) ? this.lineList.filter(x => this.details.lines.find(y => y.lineId === x.lineId)).map(x => x.lineId) : [],
        shift: Helper.hasValue(this.details.shifts) ? this.shiftList.filter(x => this.details.shifts.find(y => y.shiftValue === x.shiftValue)).map(x => x.shiftValue) : [],
        crew: Helper.hasValue(this.details.crews) ? this.crewList.filter(x => this.details.crews.find(y => y.crewValue === x.crewValue)).map(x => x.crewValue) : [],
        site: Helper.hasValue(this.details.sites) ? this.siteList.filter(x => this.details.sites.find(y => y.siteId === x.siteId)).map(x => x.siteId) : [],
        manufacturedDateFrom: Helper.hasValue(res['startMfgDateTime']) ? new Date(res['startMfgDateTime']) : null,
        manufacturedDateTo: Helper.hasValue(res['endMfgDateTime']) ? new Date(res['endMfgDateTime']) : null,
        status: res.status === 'Active' ? 'A' : 'I',
        comments: res.comments
      });
    }));
  }

  searchType(event) {
    this.typeList = [];
    let query = event != undefined ? event.query : "";
    this.typeList = this.shipmentTypes.filter(m => m.description.toLowerCase().includes(query.toLowerCase()));
  }

  getPallets() {
    this.palletDetailsList = [];
    let siteId = sessionStorage.getItem('siteId');
    this.subscriptions.push(this.service.getAllPalletsList(ServiceConstants.GetPallets, siteId).subscribe(res => {
      if (res && res['records']) {
        let data = res['records'];
        data.forEach(ele => {
          this.palletDetailsList.push({palletId:ele['palletId'],fakeId:ele['fakeId']})
        });
      }
      this.getDSPDetails();
    }))
  }

  searchPallet(event) {
    this.palletList = [];
    let query = event != undefined ? event.query : "";
    this.palletList = this.palletDetailsList.filter(m => m.palletId?.toLowerCase().includes(query.toLowerCase())|| m.fakeId?.toLowerCase().includes(query.toLowerCase()));
  }

  onSelectPallet(event, control) {
    if (control == 'fromPallet')
      this.palletFromMessage = ''
    else
      this.palletToMessage = ''
  }

  getMaterials() {
    this.materialDetailsList = [];
    let siteId = sessionStorage.getItem('siteId');
    let fields = 'materialID,materialDescription';
    this.subscriptions.push(this.service.getAllDetails(ServiceConstants.GetMaterials, fields, siteId).subscribe(res => {
      if (res && res['records']) {
        let data = res['records'];
        data.forEach(ele => {
          this.materialDetailsList.push(ele);
        });
        this.getDSPDetails();
      }
    }));
  }

  searchMaterial(event) {
    this.materialList = [];
    let query = event != undefined ? event.query : "";
    this.materialList = this.materialDetailsList.filter(m => m.displayText.toLowerCase().includes(query.toLowerCase()));
  }

  onSelectMaterial(event) {
    this.materialSelected = true;
  }

  onMaterialClick() {
    this.materialReq.SiteId = sessionStorage.getItem('siteId');
    this.materialReq.MaterialId = this.dspDetails.value.material.materialID;
    sessionStorage.setItem('dspDetails', JSON.stringify(this.dspDetails.value))
    this.router.navigate([RouteConstants.MaterialRoute], {
      queryParams: {
        siteId: this.materialReq.SiteId,
        materialId: this.materialReq.MaterialId,
      }
    });
  }

  keyUp(event) {
    this.materialSelected = false;
  }

  onClearMaterial(event) {
    this.materialSelected = false;
  }

  getLines() {
    let siteId = sessionStorage.getItem('siteId');
    let fields = 'lineKey,lineId,description';
    this.subscriptions.push(this.service.getAllDetails(ServiceConstants.Lines, fields, siteId).subscribe(res => {
      this.lineList = [];
      if (res && res['records']) {
        let data = res['records'];
        data.forEach(ele => {
          ele['lineDesc'] = `${ele['lineId']}${' - '}${ele['description']}`;
          this.lineList.push(ele);
        });
        this.getDSPDetails();
      }
    }));
  }

  getShift() {
    let siteId = sessionStorage.getItem('siteId');
    let fields = 'shiftValue,shiftDescription';
    this.subscriptions.push(this.service.getAllDetails(ServiceConstants.Shift, fields, siteId).subscribe(res => {
      this.shiftList = [];
      if (res && res['records']) {
        let data = res['records'];
        data.forEach(ele => {
          this.shiftList.push(ele);
        });
        this.getDSPDetails();
      }
    }));
  }

  getCrew() {
    let siteId = sessionStorage.getItem('siteId');
    let fields = 'crewValue,crewDescription';
    this.subscriptions.push(this.service.getAllDetails(ServiceConstants.Crew, fields, siteId).subscribe(res => {
      this.crewList = [];
      if (res && res['records']) {
        let data = res['records'];
        data.forEach(ele => {
          this.crewList.push(ele);
        });
        this.getDSPDetails();
      }
    }));
  }

  getSites() {
    let siteId = sessionStorage.getItem('siteId');
    let fields = 'siteId,siteDescription';
    this.subscriptions.push(this.service.getAllDetails(ServiceConstants.Sites, fields, siteId).subscribe(res => {
      this.siteList = [];
      if (res && res['records']) {
        let data = res['records'];
        data.forEach(ele => {
          ele['siteDesc'] = `${ele['siteId']}${' - '}${ele['siteDescription']}`;
          this.siteList.push(ele);
        });
        this.getDSPDetails();
      }
    }));
  }

  onSelectDate(event, control) {
    if (control == 'fromDate')
      this.fromDateMessage = '';
    else
      this.toDateMessage = '';
  }

  validate() {
    this.errCount = 0;
    if (Helper.hasValue(this.dspDetails.value.palletIdFrom) && !Helper.hasValue(this.dspDetails.value.palletIdTo)) {
      this.palletToMessage = 'Pallet Thru is required';
      this.errCount++;
    }
    else if (!Helper.hasValue(this.dspDetails.value.palletIdFrom) && Helper.hasValue(this.dspDetails.value.palletIdTo)) {
      this.palletFromMessage = 'Pallet Id is required';
      this.errCount++;
    }
    if (Helper.hasValue(this.dspDetails.value.manufacturedDateFrom) && !Helper.hasValue(this.dspDetails.value.manufacturedDateTo)) {
      this.toDateMessage = 'Manufactured Thru is required';
      this.errCount++;
    }
    else if (!Helper.hasValue(this.dspDetails.value.manufacturedDateFrom) && Helper.hasValue(this.dspDetails.value.manufacturedDateTo)) {
      this.fromDateMessage = 'Manufactured Date is required';
      this.errCount++;
    }
    if (Helper.hasValue(this.dspDetails.value.manufacturedDateFrom) && Helper.hasValue(this.dspDetails.value.manufacturedDateTo)) {
      if (this.dspDetails.value.manufacturedDateFrom > this.dspDetails.value.manufacturedDateTo) {
        this.fromDateMessage = 'Manufactured from date should be lessthan manufacture to date';
        this.errCount++;
      }
    }
  }

  saveDetails() {
    this.validate()
    if (this.errCount == 0) {
      this.detailsReq.SiteId = Number(sessionStorage.getItem('siteId'));
      this.detailsReq.Type = this.dspDetails.value.type.type;
      this.detailsReq.PalletIdFrom = Helper.hasValue(this.dspDetails.value.palletIdFrom) ? this.dspDetails.value.palletIdFrom.palletId : "";
      this.detailsReq.PalletIdThru = Helper.hasValue(this.dspDetails.value.palletIdTo) ? this.dspDetails.value.palletIdTo.palletId : "";
      this.detailsReq.MaterialId = Helper.hasValue(this.dspDetails.value.material) ? this.dspDetails.value.material.materialID : "";
      this.detailsReq.Lines = Helper.hasValue(this.dspDetails.value.line) ? this.dspDetails.value.line : [];
      this.detailsReq.Shifts = Helper.hasValue(this.dspDetails.value.shift) ? this.dspDetails.value.shift : [];
      this.detailsReq.Crews = Helper.hasValue(this.dspDetails.value.crew) ? this.dspDetails.value.crew : [];
      this.detailsReq.Sites = Helper.hasValue(this.dspDetails.value.site) ? this.dspDetails.value.site : [];
      this.detailsReq.ManufacturingDateTimeFrom = Helper.hasValue(this.dspDetails.value.manufacturedDateFrom) ? this.dspDetails.value.manufacturedDateFrom : null;
      this.detailsReq.ManufacturingDateTimeThru = Helper.hasValue(this.dspDetails.value.manufacturedDateTo) ? this.dspDetails.value.manufacturedDateTo : null;
      this.detailsReq.Status = this.dspDetails.value.status;
      this.detailsReq.Comments = this.dspDetails.value.comments;
      if (this.screenType == StringConstant.Create) {
        this.subscriptions.push(this.service.put(ServiceConstants.DefinableShippingParameter, this.detailsReq).subscribe(res => {
          if (res && res === "Success") {
            this.service.message = 'Record created successfully';
            this.service.isSuccess = true;
            this.service.screenToNavigate = StringConstant.DSPDetails;
            this.location.back();
          }
        }));
      }
      else {
        this.subscriptions.push(this.service.postWithQuery(ServiceConstants.DSP, this.dspDetails.value.dspNumber, this.detailsReq).subscribe(res => {
          if (res && res === "Success") {
            this.service.message = 'Record updated successfully';
            this.service.isSuccess = true;
            this.service.screenToNavigate = StringConstant.DSPDetails;
            this.location.back();
          }
        }));
      }
    }
  }

  cancel() {
    this.service.screenToNavigate = StringConstant.DSPDetails;
    sessionStorage.removeItem('dspDetails');
    this.service.message = '';
    this.service.isSuccess = false;
    this.location.back();
  }

  printDetails() {
    let siteId = Number(sessionStorage.getItem('siteId'));
    let dynamicParam: string[] = [];
    if (Helper.hasValue(this.dspDetails.value.material))
      dynamicParam.push(`materialId eq ${this.dspDetails.value.material.materialID}`)
    if (Helper.hasValue(this.dspDetails.value.line))
      dynamicParam.push(`lineid in ${this.dspDetails.value.line}`)
    if (Helper.hasValue(this.dspDetails.value.shift))
      dynamicParam.push(`shiftid in ${this.dspDetails.value.shift}`)
    if (Helper.hasValue(this.dspDetails.value.crew))
      dynamicParam.push(`crewid in ${this.dspDetails.value.crew}`)
    if (Helper.hasValue(this.dspDetails.value.manufacturedDateFrom) && Helper.hasValue(this.dspDetails.value.manufacturedDateTo))
      dynamicParam.push(`ManufacturingDateTime bt ${Helper.getMomentDate(this.dspDetails.value.manufacturedDateFrom)}|${Helper.getMomentDate(this.dspDetails.value.manufacturedDateTo)}`)
    else {
      if (Helper.hasValue(this.dspDetails.value.manufacturedDateFrom))
        dynamicParam.push(`ManufacturingDateTime ge ${Helper.getMomentDate(this.dspDetails.value.manufacturedDateFrom)}`)
      if (Helper.hasValue(this.dspDetails.value.manufacturedDateTo))
        dynamicParam.push(`ManufacturingDateTime le ${Helper.getMomentDate(this.dspDetails.value.manufacturedDateTo)}`)
    }
    if (Helper.hasValue(this.dspDetails.value.palletIdFrom) && Helper.hasValue(this.dspDetails.value.palletIdTo))
      dynamicParam.push(`palletId bt ${this.dspDetails.value.palletIdFrom}|${this.dspDetails.value.palletIdTo}`)
    else {
      if (Helper.hasValue(this.dspDetails.value.palletIdFrom))
        dynamicParam.push(`palletId eq ${this.dspDetails.value.palletIdFrom}`)
      if (Helper.hasValue(this.dspDetails.value.palletIdTo))
        dynamicParam.push(`palletId eq ${this.dspDetails.value.palletIdTo}`)
    }
    let q = `${dynamicParam.join(' and ')}`;
    q = this.screenType == StringConstant.Create ? q : `${q}&dspNumber=${this.dspDetails.value.dspNumber}`
    this.subscriptions.push(this.service.printDSP(ServiceConstants.PrintDSP, siteId, q).subscribe((res: any) => {
      const fileName = "DSPDetails.pdf";
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

  reset() {
    this.materialSelected = false;
    this.dspDetails.reset();
    this.dspDetails.patchValue({
      type: { type: "T", description: "Do not allow shipment to Selected sites" },
      status: 'A'
    });
  }

  getSessionDetails() {
    this.sessionDetails = JSON.parse(sessionStorage.getItem('dspDetails'));
    if (Helper.hasValue(this.sessionDetails)) {
      this.materialSelected = Helper.hasValue(this.sessionDetails.material) ? true : false;
      this.status = this.sessionDetails.status;
      this.dspDetails.patchValue({
        dspNumber: Helper.hasValue(this.sessionDetails.dspNumber) ? this.sessionDetails.dspNumber : '',
        producerId: Helper.hasValue(this.sessionDetails.producerId) ? this.sessionDetails.producerId : '',
        lastUser: Helper.hasValue(this.sessionDetails.lastUser) ? this.sessionDetails.lastUser : '',
        type: Helper.hasValue(this.sessionDetails.type) ? this.sessionDetails.type : '',
        palletIdFrom: Helper.hasValue(this.sessionDetails.palletIdFrom) ? this.sessionDetails.palletIdFrom : '',
        palletIdTo: Helper.hasValue(this.sessionDetails.palletIdTo) ? this.sessionDetails.palletIdTo : '',
        material: this.sessionDetails.material,
        line: Helper.hasValue(this.sessionDetails.line) ? this.sessionDetails.line : '',
        shift: Helper.hasValue(this.sessionDetails.shift) ? this.sessionDetails.shift : '',
        crew: Helper.hasValue(this.sessionDetails.crew) ? this.sessionDetails.crew : '',
        site: Helper.hasValue(this.sessionDetails.site) ? this.sessionDetails.site : '',
        manufacturedDateFrom: Helper.hasValue(this.sessionDetails['manufacturedDateFrom']) ? new Date(this.sessionDetails['manufacturedDateFrom']) : null,
        manufacturedDateTo: Helper.hasValue(this.sessionDetails['manufacturedDateTo']) ? new Date(this.sessionDetails['manufacturedDateTo']) : null,
        status: Helper.hasValue(this.sessionDetails.status) ? this.sessionDetails.status : '',
        comments: Helper.hasValue(this.sessionDetails.comments) ? this.sessionDetails.comments : ''
      })
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
  }

}
