import { ChangePalletStatusModel } from './shared/models/changePalletStatus';
//Core
import { BrowserModule } from '@angular/platform-browser';
import { Input, NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { PipesModule } from 'pipes-module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MsalModule, MsalInterceptor } from '@azure/msal-angular';
import { LoggerModule } from 'ngx-logger';
import { PdfViewerModule } from 'ng2-pdf-viewer';
//Prime Ng
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TooltipModule } from 'primeng/tooltip';
import { InputNumberModule } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { SplitButtonModule } from 'primeng/splitbutton';
import { SharedModule } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FullCalendarModule } from '@fullcalendar/angular';
import { TreeTableModule } from "primeng/treetable";
import {ProgressSpinnerModule} from 'primeng/progressspinner';
//Components
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';
import { ServiceConfig } from './shared/util/serviceconfig';
import { PwmPalletDetailsComponent } from './shared/components/pwm-pallet-details/pwm-pallet-details.component';
import { PwmMaterialDetailsComponent } from './shared/components/pwm-material-details/pwm-material-details.component';
import { SaveClear } from './shared/models/saveClear';
import { ServiceConstants } from './shared/util/service-constants';
import { PwmCombinePalletsComponent } from './modules/pwm-combine-pallets/pwm-combine-pallets.component';
import { ExtendedExpirySearch } from './shared/models/extendedExpirySearch';
import { Pallets } from './shared/models/getPallets';
import { Materials } from './shared/models/getMaterials';
import { PalletInquriySearch } from './shared/models/palletInquirySearch';
import { PwmConsumePartialPalletsComponent } from './modules/pwm-consume-partial-pallets/pwm-consume-partial-pallets.component';
import { ConsumePartialPallet } from './shared/models/consume-partial-pallet.model';
import { CombinePalletReq } from './shared/models/combinePallet';
import { PwmDefinableShippingParametersGridComponent } from './modules/pwm-definable-shipping-parameters-grid/pwm-definable-shipping-parameters-grid.component';
import { PwmDefinableShippingParameterDetailsComponent } from './modules/pwm-definable-shipping-parameter-details/pwm-definable-shipping-parameter-details.component';
import { ShippingParameterDetails } from './shared/models/shippingParameterDetails';
import { PwmPalletInquiryDetailsComponent } from './modules/pwm-pallet-inquiry-main/pwm-pallet-inquiry-details/pwm-pallet-inquiry-details.component';
import { PwmPalletInquiryMainComponent } from './modules/pwm-pallet-inquiry-main/pwm-pallet-inquiry-main.component';
import { PwmPalletExtendExpiryComponent } from './modules/pwm-pallet-inquiry-main/pwm-pallet-extend-expiry/pwm-pallet-extend-expiry.component';
import { AppConfig } from './shared/util/appConfig';import { httpInterceptorProviders } from './http-interceptors';
import { PwmSpinnerComponent } from './shared/components/pwm-spinner/pwm-spinner.component';
import { ChangePalletStatusComponent } from './modules/change-pallet-status/change-pallet-status.component';
import { DefectsComponent } from './modules/change-pallet-status/defects/defects.component';
import { ReworkComponent } from './modules/change-pallet-status/rework/rework.component';
import { UserAccess } from './shared/util/user-access';
import { PwmDialogComponent } from './shared/components/pwm-dialog/pwm-dialog.component';
import { LockResolver } from './http-interceptors/lock-resolver.service';
import { PwmLotApprovalComponent } from './modules/pwm-lot-approval/pwm-lot-approval.component';
import { PwmChangeMaterialComponent } from './modules/pwm-change-material/pwm-change-material.component';
import { ChangeMaterial } from './shared/models/change-material';
const isIE = window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;

@NgModule({
  declarations: [
    AppComponent,
    PwmPalletDetailsComponent,
    PwmMaterialDetailsComponent,
    PwmCombinePalletsComponent,
    PwmConsumePartialPalletsComponent,
    PwmDefinableShippingParametersGridComponent,
    PwmDefinableShippingParameterDetailsComponent,
    PwmPalletInquiryDetailsComponent,
    PwmPalletInquiryMainComponent,
    PwmPalletExtendExpiryComponent,
    ChangePalletStatusComponent,
    DefectsComponent,
    ReworkComponent,
    PwmSpinnerComponent,
    PwmDialogComponent,
    PwmLotApprovalComponent,
    PwmChangeMaterialComponent
  ],
  imports: [
    FormsModule,
    CheckboxModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    TableModule,
    PipesModule,
    AutoCompleteModule,
    ReactiveFormsModule,
    ConfirmDialogModule,
    ButtonModule,
    DialogModule,
    CalendarModule,
    InputNumberModule,
    InputTextModule,
    DropdownModule,
    MultiSelectModule,
    SelectButtonModule,
    TooltipModule,
    TabViewModule,
    SplitButtonModule,
    SharedModule,
    MessagesModule,
    MessageModule,
    RadioButtonModule,
    FullCalendarModule,
    PdfViewerModule,
    TreeTableModule,
    ProgressSpinnerModule,
    MsalModule.forRoot({
      auth: {
        clientId: environment.uiClientId,
        authority: 'https://login.microsoftonline.com/' + environment.tenantId,
        redirectUri: environment.redirectUrl,
        navigateToLoginRequestUrl: true
      },
      cache: {
        cacheLocation: 'localStorage',
        storeAuthStateInCookie: isIE, // set to true for IE 11
      },
    },
      {
        popUp: !isIE,
        consentScopes: environment.scopeUri,
        unprotectedResources: [],
        protectedResourceMap:
          [
            [environment.baseUrl, environment.scopeUri],
            [environment.authUrl, environment.scopeUri]
          ],
        extraQueryParameters: {}
      }),
    LoggerModule.forRoot({
      serverLoggingUrl: `${environment.baseUrl}${environment.LoggingEndpointPath}`,
      level: environment.logLevel,
      serverLogLevel: environment.serverLogLevel,
      disableConsoleLogging: !environment.isConsolLogEnabled
    })
  ],
  providers: [
    ConfirmationService, ServiceConfig, SaveClear, ExtendedExpirySearch,
    ServiceConstants, PalletInquriySearch, ExtendedExpirySearch, Pallets, Materials,
    ConsumePartialPallet,CombinePalletReq, ShippingParameterDetails,AppConfig,ChangePalletStatusModel,
    httpInterceptorProviders,UserAccess,LockResolver,ChangeMaterial
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
