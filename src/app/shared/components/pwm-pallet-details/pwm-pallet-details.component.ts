import { keyframes } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { PwmPalletInquiryService } from '../../service/pwm-pallet-inquiry.service';
import { StringConstant } from '../../../shared/util/stringconstant';
import { RouterService } from 'src/app/shared/service/router.service';
import { ActivatedRoute, ChildActivationEnd } from '@angular/router';
import { ServiceConstants } from '../../util/service-constants';
import * as moment from 'moment';
import { OnDestroy } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';
@Component({
  selector: 'quality-assurance-pwm-pallet-details',
  templateUrl: './pwm-pallet-details.component.html',
  styleUrls: ['./pwm-pallet-details.component.css']
})

export class PwmPalletDetailsComponent implements OnInit, OnDestroy {
  cols: any[];
  browserRefresh:boolean = false;
  isCommentReadOnly: boolean = true;
  totalRecords: number = 0;
  subscription: Subscription;
  rowDataPart = [];
  materail: string;
  status: string;
  rowData = [];
  siteId;
  palletId;
  msg;
  error_message: boolean;
  public palletConstants: Map<string, String>;
  constructor(
    private router: Router,
    private routerService: RouterService,
    private activatedRoute: ActivatedRoute,
    private palletInquriyService: PwmPalletInquiryService,
    private location :Location
  ) { 
  //   this.subscription = router.events.subscribe((event) => {
  //     if (event instanceof ChildActivationEnd) {
  //       this.browserRefresh = !router.navigated;
  //       this.selectedRadio = this.palletInquriyService.getSelectedRadio();
  //       if(this.browserRefresh == true){
  //         this.getWhichTabletoDisplay();
  //         this.location.back();
  //         console.log('----event---',event)
  //       }
  //     }
  // });
  }

  updateDisplayText() {
    this.palletConstants = new Map([
      ['palletId', 'Pallet Id'],
      ['materialId', 'Material Id'],
      ['palletBarcode', 'Pallet Barcode'],
      ['manufacturingDateTime', 'Manufacturing Date Time'],
      ['locationId', 'Location Id'],
      ['ownerId', 'Owner Id'],
      ['versionId', 'Version Id'],
      ['batchNumber', 'Batch Number'],
      ['crewId', 'Crew Id'],
      ['shiftId', 'Shift Id'],
      ['lineId', 'Line Id'],
      ['reserved', 'Reserved'],
      ['producerId', 'Producer Id'],
      ['quantity', 'Quantity'],
      ['uom', 'UOM'],
      ['qcIncident', 'QC Incident'],
      ['expirationDateTime', 'Expiration Date Time'],
      ['fakeId', 'Fake Id'],
      ['status', 'Status'],
      ['materialDescription', 'Material Description'],
      ['productType', 'Product Type'],
      ['overridableExpirationDateTime', 'Overridable Expiration Date Time'],
      ['nonOverridableExpirationDateTime', 'Non Overridable Expiration Date Time'],
      ['siteId', 'Site Id'],
      ['type', 'Type'],
      ['subType', 'Sub Type'],
      ['expandedQcId', 'Expanded QC Id'],
      ['materialDisplayText', 'Material Display Text'],
      ['statusDescription', 'Status Description']
    ]);
  }
  ngOnInit(): void {
    this.updateDisplayText();
    this.cols = [
      { field: 'attribute', header: 'Attribute' },
      { field: 'value', header: 'Value' }
    ];
    this.getDetailsFromParent();
  }

  getDetailsFromParent() {
    this.palletId = []
    this.activatedRoute.queryParams.subscribe(params => {
      this.siteId = params.siteId
      this.palletId = params.palletId
    });
    this.palletInquriyService.getPalletCharacteristics(ServiceConstants.GetPallets,
       this.palletId, this.siteId).subscribe((res: any) => {
        if (res) {
          console.log(res)
          this.rowDataPart = res['characteristics']
          this.totalRecords = this.rowDataPart.length
          this.materail = res['materialDisplayText']
          this.status = res['status']
          // this.getPalletList(res);
          this.msg = [];
          this.error_message = false;
        } else if (res == null) {
          this.msg = 'No Pallet Details Data Found For Selected PalletId -' + this.palletId;
          this.error_message = true;
          this.rowDataPart = [];
        }
      });
  }

  back(event) {
    if(event.type === 'click'){
      this.location.back();
    }
  }
  
  // getPalletList(obj) {
  //   if (obj) {
  //     this.rowDataPart = Object.entries(obj).map(
  //       o => this.getAttrValue(o[0], o[1]))
  //   }
  //   this.totalRecords = this.rowDataPart ? this.rowDataPart.length : 0;
  // }

  // getAttrValue(palletDetails: string, description: any) {
  //   let attr = this.palletConstants.has(palletDetails) ? this.palletConstants.get(palletDetails) : palletDetails;
  //   let val = description;
  //   if (palletDetails.toLocaleLowerCase().endsWith('datetime')) {
  //     val = moment(new Date(description)).format('MM/DD/YYYY HH:MM')
  //   }
  //   return { palletDetails: attr, description: val };
  // }

  ngOnDestroy() {
    // this.subscription.unsubscribe();
  }
}
