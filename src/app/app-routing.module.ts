import { LockResolver } from './http-interceptors/lock-resolver.service';
import { ReworkComponent } from './modules/change-pallet-status/rework/rework.component';
import { DefectsComponent } from './modules/change-pallet-status/defects/defects.component';
import { APP_BASE_HREF } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// Components
import { PwmPalletDetailsComponent } from './shared/components/pwm-pallet-details/pwm-pallet-details.component';
import { PwmMaterialDetailsComponent } from './shared/components/pwm-material-details/pwm-material-details.component';
import { PwmCombinePalletsComponent } from './modules/pwm-combine-pallets/pwm-combine-pallets.component';
import { PwmConsumePartialPalletsComponent } from './modules/pwm-consume-partial-pallets/pwm-consume-partial-pallets.component';
import { PwmDefinableShippingParametersGridComponent } from './modules/pwm-definable-shipping-parameters-grid/pwm-definable-shipping-parameters-grid.component';
import { PwmDefinableShippingParameterDetailsComponent } from './modules/pwm-definable-shipping-parameter-details/pwm-definable-shipping-parameter-details.component';
import { PwmPalletInquiryDetailsComponent } from './modules/pwm-pallet-inquiry-main/pwm-pallet-inquiry-details/pwm-pallet-inquiry-details.component';
import { PwmPalletInquiryMainComponent } from './modules/pwm-pallet-inquiry-main/pwm-pallet-inquiry-main.component';
import { ChangePalletStatusComponent } from './modules/change-pallet-status/change-pallet-status.component';
import { PwmLotApprovalComponent } from './modules/pwm-lot-approval/pwm-lot-approval.component';
import { PwmChangeMaterialComponent } from './modules/pwm-change-material/pwm-change-material.component';

const routes: Routes = [
  { path: 'quality-assurance/palletDetails', component: PwmPalletDetailsComponent },
  { path: 'quality-assurance/materialDetails', component: PwmMaterialDetailsComponent },
  { path: 'quality-assurance/pallet-inquiry', component: PwmPalletInquiryDetailsComponent,resolve:[LockResolver] ,data:{id:17,type:'menu'} },
  { path: 'quality-assurance/extend-expiration-date', component: PwmPalletInquiryMainComponent,resolve:[LockResolver] ,data:{id:16,type:'menu'} },
  { path: 'quality-assurance/combine-pallets', component: PwmCombinePalletsComponent ,resolve:[LockResolver] ,data:{id:11,type:'menu'}},
  { path: 'quality-assurance/consume-partial-pallets', component: PwmConsumePartialPalletsComponent,resolve:[LockResolver] ,data:{id:12,type:'menu'} },
  { path: 'quality-assurance/definable-shipping-parameters', component: PwmDefinableShippingParametersGridComponent,resolve:[LockResolver] ,data:{id:15,type:'menu'} },
  { path: 'quality-assurance/definable-shipping-parameters/details', component: PwmDefinableShippingParameterDetailsComponent },
  { path: 'quality-assurance/change-pallet-status', component: ChangePalletStatusComponent, resolve:[LockResolver] ,data:{id:14,type:'menu'}},
  { path: 'quality-assurance/change-pallet-status/defects', component: DefectsComponent },
  { path: 'quality-assurance/change-pallet-status/rework', component: ReworkComponent },
   {path: 'quality-assurance/lot-approval', component:PwmLotApprovalComponent},
   {path: 'quality-assurance/change-material',component:PwmChangeMaterialComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    { provide: APP_BASE_HREF, useValue: '/' },
  ],
})
export class AppRoutingModule { }
