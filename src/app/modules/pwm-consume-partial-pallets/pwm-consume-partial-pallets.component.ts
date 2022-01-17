import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConsumePartialPallet } from 'src/app/shared/models/consume-partial-pallet.model';
import { Materials } from 'src/app/shared/models/getMaterials';
import { Pallets } from 'src/app/shared/models/getPallets';
import { PwmPalletInquiryService } from 'src/app/shared/service/pwm-pallet-inquiry.service';
import { RouterService } from 'src/app/shared/service/router.service';
import { Helper } from 'src/app/shared/util/helper';
import { ServiceConstants } from 'src/app/shared/util/service-constants';
import { RouteConstants, StringConstant } from 'src/app/shared/util/stringconstant';
import { Subscription } from 'rxjs';
import { UserAccess } from 'src/app/shared/util/user-access';
import { PwmDialogService } from 'src/app/shared/service/pwm-dialog.service';
@Component({
  selector: 'quality-assurance-pwm-consume-partial-pallets',
  templateUrl: './pwm-consume-partial-pallets.component.html',
  styleUrls: ['./pwm-consume-partial-pallets.component.css']
})
export class PwmConsumePartialPalletsComponent implements OnInit, OnDestroy {
  actionListAttribute = {
    consumeSave: false
  }
  palletDetails: FormGroup;
  allLines: any = [];
  lineList: any = [];
  allPallets: any = [];
  palletList: any = [];
  saveEnabled: boolean;
  disabled: boolean;
  datePipe = new DatePipe('en-US');
  showDefects: boolean;
  error: boolean;
  success: boolean;
  message: string = '';
  materialEnabled: boolean;
  palletMaterialId: any;
  dependentPages = RouteConstants.MaterialRoute;
  palletSessionDetails: any;
  private subscriptions: Array<Subscription> = [];
  itemSize = StringConstant.itemSize;

  constructor(private formBuilder: FormBuilder, private service: PwmPalletInquiryService,
    private palletReq: Pallets, private userAccess: UserAccess, private dialogService: PwmDialogService,
    private consumePalletReq: ConsumePartialPallet, private materialReq: Materials,
    private router: Router, private routerService: RouterService) { }

  ngOnInit(): void {
    this.userAccess.validateUserAcess(StringConstant.ConsumePartialPallet, this.actionListAttribute);
    this.palletDetails = this.formBuilder.group({
      selectedLine: ['', Validators.required],
      lineMaterial: [''],
      lineMaterialId: [''],
      producerId: [''],
      palletId: ['', Validators.required],
      palletTicket: [''],
      palletMaterial: [''],
      manufacturedDate: [''],
      status: [''],
      line: [''],
      shift: [''],
      crew: [''],
      qcIncident: [''],
      quantity: [''],
      defectsCategory: [''],
      defects: [''],
      comments: [''],
      palletMaterialId: [''],
      statusDescription: ['']
    });

    if (!(this.routerService.getPreviousUrl().includes(this.dependentPages))) {
      sessionStorage.removeItem('consumePartialPalletDetails')
    }
    else {
      this.palletSessionDetails = JSON.parse(sessionStorage.getItem('consumePartialPalletDetails'));
    }

    if (Helper.hasValue(this.palletSessionDetails)) {
      this.materialEnabled = true;
      this.palletDetails.patchValue({
        selectedLine: this.palletSessionDetails.selectedLine,
        lineMaterial: this.palletSessionDetails.lineMaterial,
        lineMaterialId: this.palletSessionDetails.lineMaterialId,
        producerId: this.palletSessionDetails.producerId,
        palletId: this.palletSessionDetails.palletId,
        palletTicket: this.palletSessionDetails.palletTicket,
        palletMaterial: this.palletSessionDetails.palletMaterial,
        manufacturedDate: this.palletSessionDetails.manufacturedDate,
        status: this.palletSessionDetails.status,
        line: this.palletSessionDetails.line,
        shift: this.palletSessionDetails.shift,
        crew: this.palletSessionDetails.crew,
        qcIncident: this.palletSessionDetails.qcIncident,
        quantity: this.palletSessionDetails.quantity,
        palletMaterialId: this.palletSessionDetails.palletMaterialId,
        statusDescription: this.palletSessionDetails.statusDescription
      });
      if (Helper.hasValue(this.palletDetails.value.lineMaterialId) &&
        Helper.hasValue(this.palletDetails.value.palletMaterialId) &&
        this.palletDetails.value.lineMaterialId != this.palletDetails.value.palletMaterialId) {
        this.error = true;
        this.success = false;
        this.message = StringConstant.MaterialMismatchOnSelectPallet;
      }
      this.showDefects = (this.palletDetails.value.status == StringConstant.Blocked || this.palletDetails.value.status == StringConstant.MillClaim || this.palletDetails.value.status == StringConstant.Hold) ? true : false;
    }

    let siteId = sessionStorage.getItem('siteId');
    let fields = `${StringConstant.LineKey},${StringConstant.LineId},${StringConstant.Description}`;
    this.subscriptions.push(this.service.getAllDetails(ServiceConstants.LinesConsume, fields, siteId).subscribe((res: any) => {
      if (res && res['records']) {
        this.allLines = res['records'].map((obj) => ({ lineId: obj['lineId'], description: obj['description'], displayText: `${obj['lineId']} - ${obj['description']}` }));
      }
    }))
    this.getPallets()
  }

  getPallets() {
    let siteId = sessionStorage.getItem('siteId');
    let fields = `${StringConstant.FeildPallet},${StringConstant.FieldStatus},fakeId`;
    let query = `status ni ${StringConstant.Dead},${StringConstant.Scrap}`;
    this.allPallets = []
    this.subscriptions.push(this.service.getDetailsBasedOnCriteria(ServiceConstants.GetPallets, fields, siteId, query).subscribe(res => {
      if (res && res['records']) {
        let data = res['records'];
        data.forEach((ele) => {
          this.allPallets.push(ele);
        })
      }
    }))
  }

  searchLine(event) {
    this.lineList = [];
    let query = event != undefined ? event.query : "";
    this.lineList = Helper.hasValue(this.allLines) ? this.allLines.filter(x => x['displayText'].toLowerCase().includes(query.toLowerCase())) : [];
  }

  onSelectLine(event) {
    this.clearMessage();
    if (Helper.hasValue(event)) {
      this.palletDetails.patchValue({ lineMaterial: '' });
      let siteId = sessionStorage.getItem('siteId');
      let lineId = event.lineId;
      this.subscriptions.push(this.service.getDetails(ServiceConstants.Lines, lineId, siteId).subscribe((res: any) => {
        if (res) {
          this.palletDetails.patchValue({
            lineMaterial: res['materialDisplayText'],
            lineMaterialId: res['materialId']
          })
          if (Helper.hasValue(this.palletDetails.value.palletId) &&
            this.palletDetails.value.lineMaterialId != this.palletDetails.value.palletMaterialId) {
            this.error = true;
            this.success = false;
            this.message = StringConstant.MaterialMismatchOnSelectLine;
          }
        }
        else {
          this.error = true;
          this.message = `${StringConstant.NoActiveMaterial}${event.lineId}`;
        }
      }));
    }
  }

  searchPallet(event) {
    this.palletList = []
    let query = event != undefined ? event.query : "";
    this.palletList = this.allPallets.filter(m => m.palletId?.toLowerCase().includes(query.toLowerCase()) || m.fakeId?.toLowerCase().includes(query.toLowerCase()));
  }

  onSelectPallet(event) {
    this.clearMessage();
    if (Helper.hasValue(event)) {
      this.palletReq.PalletId = event.palletId;
      this.palletReq.SiteId = sessionStorage.getItem('siteId');
      this.subscriptions.push(this.service.onPalletHyperlinkClick(ServiceConstants.GetPallets, this.palletReq.SiteId, this.palletReq.PalletId).subscribe((res: any) => {
        this.clearPalletDetails()
        this.palletDetails.patchValue({
          palletTicket: res.palletId,
          producerId: res.producerId + '-' + res.producerName,
          palletMaterial: res.materialDisplayText,
          manufacturedDate: this.datePipe.transform(res.manufacturingDateTime, StringConstant.DateTime),
          status: res.status,
          line: res.lineId,
          shift: res.shiftId,
          crew: res.crewId,
          qcIncident: res.expandedQcId,
          quantity: res.quantity,
          palletMaterialId: res.materialId,
          statusDescription: res.statusDescription
        });
        this.showDefects = (res.status == StringConstant.Blocked || res.status == StringConstant.MillClaim || res.status == StringConstant.Hold) ? true : false;
        this.materialEnabled = Helper.hasValue(res.materialDisplayText) ? true : false;
        if (Helper.hasValue(this.palletDetails.value.selectedLine) && res.materialId != this.palletDetails.value.lineMaterialId) {
          this.error = true;
          this.success = false;
          this.message = StringConstant.MaterialMismatchOnSelectPallet;
        }
      }));
    }
  }

  clearPalletDetails() {
    this.palletDetails.patchValue({
      palletTicket: '',
      palletMaterial: '',
      manufacturedDate: '',
      producerId: '',
      status: '',
      line: '',
      shift: '',
      crew: '',
      qcIncident: '',
      quantity: '',
      palletMaterialId: '',
      statusDescription: ''
    });
  }

  onMaterialClick() {
    this.materialReq.SiteId = sessionStorage.getItem('siteId');
    this.materialReq.MaterialId = this.palletDetails.value.palletMaterialId;
    sessionStorage.setItem('consumePartialPalletDetails', JSON.stringify(this.palletDetails.value))
    this.router.navigate([RouteConstants.MaterialRoute], {
      queryParams: {
        siteId: this.materialReq.SiteId,
        materialId: this.materialReq.MaterialId,
      }
    });
  }

  onClear(event) {
    this.clearMessage()
  }

  save() {
    this.clearMessage();
    this.consumePalletReq.SiteId = sessionStorage.getItem('siteId');
    this.consumePalletReq.LineId = this.palletDetails.value.selectedLine['lineId'];
    this.consumePalletReq.PalletId = this.palletDetails.value.palletId.palletId;
    this.subscriptions.push(this.service.post(ServiceConstants.ConsumePartialPallet, this.consumePalletReq).subscribe((res: any) => {
      if (res) {
        this.materialEnabled = false;
        this.showDefects = false;
        this.success = true;
        this.message = `${StringConstant.ConsumePartialPalletMessage}${this.consumePalletReq.LineId}`
        this.palletDetails.reset();
        sessionStorage.removeItem('consumePartialPalletDetails')
        this.getPallets()
      }
      else {
        this.error = true;
        this.message = res['logMessage'];
      }
    }));
  }

  reset() {
    sessionStorage.removeItem('consumePartialPalletDetails')
    this.materialEnabled = false;
    this.showDefects = false;
    this.clearMessage();
    this.palletDetails.reset();
  }

  clearMessage() {
    this.error = false;
    this.success = false;
    this.message = '';
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
  }
}
