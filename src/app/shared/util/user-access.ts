import { Injectable } from '@angular/core';
import { RouterService } from '../service/router.service';
import { RouteConstants, StringConstant } from '../util/stringconstant';
interface ActionControl {
  ActionCode: string;
  ControlName: string;
}
@Injectable({
  providedIn: 'root'
})
export class UserAccess {

  constructor(private service: RouterService) { }
  private controlMap: Map<string, ActionControl[]> = new Map([[RouteConstants.ShippingParameterGrid,
  [{ ActionCode: '40004', ControlName: 'dspAdd' },
  { ActionCode: '40005', ControlName: 'dspEdit' },
  { ActionCode: '40006', ControlName: 'dspDelete' },]],
  [StringConstant.ConsumePartialPallet,
  [{ ActionCode: '40002', ControlName: 'consumeSave' },]],
  [RouteConstants.fromcombinePalletScreen,
  [{ ActionCode: '40001', ControlName: 'combineSave' },]],
  [StringConstant.ExtendedParentPage,
  [{ ActionCode: '40003', ControlName: 'extendedSaveOrClear' }]],
  [StringConstant.ChangePalletStatus,
  [{ ActionCode: '40007', ControlName: 'AvailableToBlock' },
  { ActionCode: '40008', ControlName: 'AvailableToHold' },
  { ActionCode: '40009', ControlName: 'AvailableToMill Claim' },
  { ActionCode: '40010', ControlName: 'BlockedToRelease' },
  { ActionCode: '40011', ControlName: 'BlockedToScrap' },
  { ActionCode: '40016', ControlName: 'BlockedToRe-Work' },// print preview except mill claim
  { ActionCode: '40013', ControlName: 'HoldToRelease' },
  { ActionCode: '40014', ControlName: 'HoldToBlock' },
  { ActionCode: '40015', ControlName: 'HoldToScrap' },
  { ActionCode: '40022', ControlName: 'HoldToRe-Work' },
  { ActionCode: '40017', ControlName: 'Mill ClaimToRelease' },
  { ActionCode: '40018', ControlName: 'Mill ClaimToScrap' },
  { ActionCode: '40020', ControlName: 'Mill ClaimToRe-Work' },
  ]],
  [StringConstant.ChangePalletStatusReWork,
  [{ ActionCode: '40021', ControlName: 'materialTransfer' }]],
  [StringConstant.ChangePalletStatusReWorkPrint,
  [{ ActionCode: '40012', ControlName: 'blockedOrHoldToReworkPrint' },
  { ActionCode: '40019', ControlName: 'millClaimToReworkPrint' },]]
  ]);
  private ctrlDisableState: Map<string, any>=new Map([]);

  validateUserAcess(urls: string, actionListAttribute: any): void {
    if (this.ctrlDisableState && this.ctrlDisableState.has(urls)) {
      const ctrlState=this.ctrlDisableState.get(urls);
      for (const i in actionListAttribute) {
          actionListAttribute[i]=ctrlState[i];
     }
      return;
    }
    const requestBody = this.controlMap.get(urls);
    const actions = requestBody.map(obj => { return obj.ActionCode })
    console.log(actions)
    this.service.getAuthorizedUrlList(actions.toString()).subscribe(
      res => {
        Object.keys(res).forEach((k) => {
          actionListAttribute[requestBody.find(a => a.ActionCode == k).ControlName] = res[k];
        });
        this.ctrlDisableState.set(urls, actionListAttribute);
      })
  }
}


