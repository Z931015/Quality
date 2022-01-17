import { Injectable, OnDestroy } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve,Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { RouterService } from '../shared/service/router.service';
import { Subscription, timer } from 'rxjs';
@Injectable()
export class LockResolver implements Resolve<any>,OnDestroy {
  timerSub$:Subscription;
  constructor(private router:Router, private routerService:RouterService,private confirmationService: ConfirmationService) {
  }
  resolve(routeSanp: ActivatedRouteSnapshot){
    if(!routeSanp.data.id){
        this.releaseLock();
        return;
    }
    this.manageLock(routeSanp.data.id,routeSanp.data.type);
  }

  manageLock(id,type):void{
    this.routerService.lock(id,type).subscribe(res => {
        if(res.status == 'Failed'){
          this.confirmationService.confirm({
            message: type=='menu'? res.message : `User ${res.userId} is already using this program, results you many not be able to perform some operation`,
            header: 'PWM Message',
            icon: 'pi pi-exclamation-triangle',
            rejectVisible:false,
            acceptLabel:'Ok',
            acceptIcon:'',
            accept: () => {
              if(type == 'menu')
              this.router.navigateByUrl('');
            }
        });
      }
      else{
        this.startTimer(res.lockDurationMin,id,type);
      }
      });
  }

  releaseLock():void{
    this.routerService.releaseAllMenuLock().subscribe(() => {console.log('menu lock released')});
    this.routerService.releaseAllActionLock().subscribe(() => {console.log('action lock released')});
  }
  startTimer(durationMin:number,id,type):void{
    if(this.timerSub$ && !this.timerSub$.closed)
    this.timerSub$.unsubscribe();
    this.timerSub$ = timer(0, 60000).subscribe(interval => {
      console.log(`interval =>${interval}`);
      if(interval == durationMin){
        this.showConfirmation(id,type);
      }
    });
  }

  showConfirmation(id,type):void{
        this.confirmationService.confirm({
          message: 'Do you still want to continue?',
          header: 'PWM Message',
          icon: 'pi pi-exclamation-triangle',
          acceptIcon:'',
          rejectIcon:'',
          accept: () => {
            this.stopTimer();
            this.manageLock(id,type);
          },
          reject: () => {
            this.stopTimer();
            this.router.navigateByUrl('');
          }
      });
  }
  stopTimer():void{
    if(this.timerSub$ && !this.timerSub$.closed)
    this.timerSub$.unsubscribe();
  }
  ngOnDestroy(): void {
    this.timerSub$.unsubscribe();
  }
}

