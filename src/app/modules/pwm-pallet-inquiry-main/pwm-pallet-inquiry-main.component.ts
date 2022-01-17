import { Component, OnInit } from '@angular/core';
import { PwmPalletInquiryService } from 'src/app/shared/service/pwm-pallet-inquiry.service';
import { RouterService } from 'src/app/shared/service/router.service';
import { StringConstant } from 'src/app/shared/util/stringconstant';
import { Location } from '@angular/common';

@Component({
  selector: 'quality-assurance-pwm-pallet-inquiry-main',
  templateUrl: './pwm-pallet-inquiry-main.component.html',
  styleUrls: ['./pwm-pallet-inquiry-main.component.css']
})
export class PwmPalletInquiryMainComponent implements OnInit {

  constructor(private routerService: RouterService, public extendedService: PwmPalletInquiryService,private location:Location) {
  }
  ngOnInit(): void {
    if (!this.routerService.getPreviousUrl().includes(StringConstant.PalletUrl)
    && !this.routerService.getPreviousUrl().includes(StringConstant.MaterialUrl)) {
      this.extendedService.isExtended=true;
    }
  }
}
