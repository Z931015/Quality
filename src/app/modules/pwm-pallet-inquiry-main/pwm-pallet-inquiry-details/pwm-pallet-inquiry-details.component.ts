import { Component, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Pallets } from 'src/app/shared/models/getPallets';
import { PwmPalletInquiryService } from 'src/app/shared/service/pwm-pallet-inquiry.service';
import { Helper } from 'src/app/shared/util/helper';
import { ServiceConstants } from 'src/app/shared/util/service-constants';
import { Materials } from 'src/app/shared/models/getMaterials';
import { Router } from '@angular/router';
import { RouteConstants, StringConstant } from 'src/app/shared/util/stringconstant';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { RouterService } from 'src/app/shared/service/router.service';
import { palletSearch } from 'src/app/shared/models/palletSearch';
import { PwmDialogService } from 'src/app/shared/service/pwm-dialog.service';
@Component({
  selector: 'quality-assurance-pwm-pallet-inquiry-details',
  templateUrl: './pwm-pallet-inquiry-details.component.html',
  styleUrls: ['./pwm-pallet-inquiry-details.component.css']
})
export class PwmPalletInquiryDetailsComponent implements OnInit, OnDestroy {
  searchPalletId: any;
  palletDetailsForm: FormGroup;
  enablePalletForm: boolean = false;
  palletErrorMessage: any;
  palletMessage: boolean = false;
  palletDetails: any
  disabled: boolean = true
  error_message: boolean = false;
  errorMessage: any;
  private subscriptions: Array<Subscription> = [];
  retainSearchVal;
  constructor(private formBuilder: FormBuilder, private palletService: PwmPalletInquiryService,
    private material: Materials, private router: Router, private routerService: RouterService,
    private dialogService: PwmDialogService) { }

  ngOnInit(): void {

    if (!this.routerService.getPreviousUrl().includes(StringConstant.PalletUrl)
      && !this.routerService.getPreviousUrl().includes(StringConstant.MaterialUrl)) {
      sessionStorage.removeItem('palletDetails')
    }
    else {
      this.retainSearchVal = sessionStorage.getItem('palletDetails') ? JSON.parse(sessionStorage.getItem('palletDetails')) : {};
    }
    this.formData();
    if (Helper.hasValue(this.retainSearchVal)) {
      this.retainPalletId();
    }

  }

  formData() {
    this.palletDetailsForm = this.formBuilder.group({
      palletTicketId: [''],
      pwmInventoryId: [''],
      materialId: [''],
      pwmBarcodeId: [''],
      description: [''],
      status: [''],
      pickedOrder: [''],
      location: [''],
      materialVersion: [''],
      batchNumber: [''],
      producer: [''],
      productionDate: [''],
      expireDate: [''],
      quantity: [''],
      uom: [''],
      line: [''],
      shift: [''],
      crew: [''],
      owner: ['']
    })
  }

  retainPalletId() {
    if (Helper.hasValue(this.retainSearchVal)) {
      this.searchPalletId = Helper.hasValue(this.retainSearchVal.palletTicketId) ? this.retainSearchVal.palletTicketId : "";
    }
    if (this.retainSearchVal != null && Object.keys(this.retainSearchVal).length !== 0) {
      this.enablePalletForm = true;
      this.palletDetailsForm.disable();
      this.palletDetailsForm.patchValue({
        palletTicketId: Helper.hasValue(this.retainSearchVal.palletTicketId) ? this.retainSearchVal.palletTicketId : "",
        pwmInventoryId: Helper.hasValue(this.retainSearchVal['pwmInventoryId']) ? this.retainSearchVal['pwmInventoryId'] : "",
        materialId: Helper.hasValue(this.retainSearchVal['materialId']) ? this.retainSearchVal['materialId'] : "",
        pwmBarcodeId: Helper.hasValue(this.retainSearchVal['pwmBarcodeId']) ? this.retainSearchVal['pwmBarcodeId'] : "", // Barcode field is no there in API Response
        description: Helper.hasValue(this.retainSearchVal['description']) ? this.retainSearchVal['description'] : "",
        status: Helper.hasValue(this.retainSearchVal['status']) ? this.retainSearchVal['status'] : "",
        pickedOrder: Helper.hasValue(this.retainSearchVal['pickedOrder']) ? this.retainSearchVal['pickedOrder'] : "", // As discussed, Need to get the value from API response
        location: Helper.hasValue(this.retainSearchVal['location']) ? this.retainSearchVal['location'] : "",
        materialVersion: Helper.hasValue(this.retainSearchVal['materialVersion']) ? this.retainSearchVal['materialVersion'] : "",
        batchNumber: Helper.hasValue(this.retainSearchVal['batchNumber']) ? this.retainSearchVal['batchNumber'] : "",
        producer: Helper.hasValue(this.retainSearchVal['producer']) ? this.retainSearchVal['producer'] : "",
        productionDate: Helper.hasValue(this.retainSearchVal['productionDate']) ? this.convertDateTime(this.retainSearchVal['productionDate']) : "",
        expireDate: Helper.hasValue(this.retainSearchVal['expireDate']) ? this.convertDateTime(this.retainSearchVal['expireDate']) : "",
        quantity: Helper.hasValue(this.retainSearchVal['quantity']) ? this.retainSearchVal['quantity'] : "",
        uom: Helper.hasValue(this.retainSearchVal['uom']) ? this.retainSearchVal['uom'] : "",
        line: Helper.hasValue(this.retainSearchVal['line']) ? this.retainSearchVal['line'] : "",
        shift: Helper.hasValue(this.retainSearchVal['shift']) ? this.retainSearchVal['shift'] : "",
        crew: Helper.hasValue(this.retainSearchVal['crew']) ? this.retainSearchVal['crew'] : "",
        owner: Helper.hasValue(this.retainSearchVal['owner']) ? this.retainSearchVal['owner'] : ""
      })

    }
  }

  getPalletDetails(palletId) {
    if (!Helper.hasValue(this.searchPalletId)) {
      this.palletMessage = true;
      this.palletErrorMessage = "Pallet Id is required."
      this.enablePalletForm = false;
      return;
    }
    this.palletMessage = false;
    this.palletErrorMessage = "";
    const req = { PalletId: palletId, SiteId: sessionStorage.getItem('siteId') }
    this.subscriptions.push(
      this.palletService.getPalletByFakeID(req).subscribe((res: any) => {
        if (res) {
          if (res.records.length > 1) {
            const fltr = res.records.filter(x => x.palletId != x.fakeId);
            if (fltr.length > 0)
              req.PalletId = fltr[0].palletId
          }
        }
      },
        error => {
          console.log(error);
        },
        () => {
          this.getPallet(req);
        }
      )
    );
  }
  getPallet(req): void {
    this.subscriptions.push(this.palletService.getMaterialbasedOnselectedPallet(ServiceConstants.GetPallets, req).subscribe(res => {
      if (res) {
        this.enablePalletForm = true
        this.palletDetailsForm.disable();
        this.error_message = false;
        this.errorMessage = "";
        this.palletDetails = res
        this.searchPalletId = "";
        if (this.palletDetails != null) {
          this.palletDetailsForm.patchValue({
            palletTicketId: Helper.hasValue(this.palletDetails.palletId) ? this.palletDetails.palletId : "",
            pwmInventoryId: Helper.hasValue(this.palletDetails.fakeId) ? this.palletDetails.fakeId : "",
            materialId: Helper.hasValue(this.palletDetails.materialId) ? this.palletDetails.materialId : "",
            pwmBarcodeId: "NA", // Barcode field is no there in API Response
            description: Helper.hasValue(this.palletDetails.materialDescription) ? this.palletDetails.materialDescription : "",
            status: Helper.hasValue(this.palletDetails.status) ? this.palletDetails.status : "",
            pickedOrder: Helper.hasValue(this.palletDetails.pickedForOrder) ? this.palletDetails.pickedForOrder : "", // As discussed, Need to get the value from API response
            location: Helper.hasValue(this.palletDetails.locationId) ? this.palletDetails.locationId : "",
            materialVersion: Helper.hasValue(this.palletDetails.versionId) ? this.palletDetails.versionId : "",
            batchNumber: Helper.hasValue(this.palletDetails.batchNumber) ? this.palletDetails.batchNumber : "",
            producer: Helper.hasValue(this.palletDetails.producerName) ? this.palletDetails.producerName : "",
            productionDate: Helper.hasValue(this.palletDetails.manufacturingDateTime) ? this.convertDateTime(this.palletDetails.manufacturingDateTime) : "",
            expireDate: Helper.hasValue(this.palletDetails.expirationDateTime) ? this.convertDateTime(this.palletDetails.expirationDateTime) : "",
            quantity: Helper.hasValue(this.palletDetails.quantity) ? this.palletDetails.quantity : "",
            uom: Helper.hasValue(this.palletDetails.uom) ? this.palletDetails.uom : "",
            line: Helper.hasValue(this.palletDetails.lineId) ? this.palletDetails.lineId : "",
            shift: Helper.hasValue(this.palletDetails.shiftId) ? this.palletDetails.shiftId : "",
            crew: Helper.hasValue(this.palletDetails.crewId) ? this.palletDetails.crewId : "",
            owner: Helper.hasValue(this.palletDetails.ownerName) ? this.palletDetails.ownerName : ""
          })
        }
      }
      else if (!res || res == null) {
        this.error_message = true;
        this.errorMessage = "No Record Found.";
        this.enablePalletForm = false;
        this.searchPalletId = "";
      }
      else {
        this.error_message = true;
        this.errorMessage = StringConstant.CommomErrorMsg;
        this.enablePalletForm = false;
        this.searchPalletId = "";
      }
    }));
  }
  reset() {
    this.searchPalletId = "";
    this.enablePalletForm = false;
    this.palletMessage = false;
    this.palletErrorMessage = "";
    this.error_message = false;
    this.errorMessage = "";

  }

  onMaterialClick() {
    this.material.SiteId = sessionStorage.getItem('siteId');
    this.material.MaterialId = this.palletDetailsForm.value.materialId;
    sessionStorage.setItem('palletDetails', JSON.stringify(this.palletDetailsForm.value))
    this.router.navigate([RouteConstants.MaterialRoute], {
      queryParams: {
        siteId: this.material.SiteId,
        materialId: this.material.MaterialId,
      }
    });
  }

  convertDateTime(val) {
    // var date = moment(new Date(val.substr(0, 16)));
    if (val !== null) {
      var date = moment(new Date(val));
      let dt;
      if (val = 'exd') {
        dt = date.format(StringConstant.DatewithTime);
      } else {
        dt = date.format(StringConstant.DatewithTime);
      }
      return dt;
    }

  }

  onEnter(palletId) {
    if (Helper.hasValue(palletId)) {
      palletId = palletId.indexOf('-') > -1 ? palletId : palletId.slice(0, 2) + "-" + palletId.slice(2);
      this.getPalletDetails(palletId);
      this.searchPalletId = "";
    }
    else {
      this.palletMessage = true;
      this.palletErrorMessage = "Pallet Id is required."
      this.enablePalletForm = false;
    }

  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
  }
}
