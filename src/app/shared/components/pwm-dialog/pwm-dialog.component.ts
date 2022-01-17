import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PwmDialogService } from '../../service/pwm-dialog.service';

@Component({
  selector: 'quality-assurance-pwm-dialog',
  templateUrl: './pwm-dialog.component.html',
  styleUrls: ['./pwm-dialog.component.css']
})
export class PwmDialogComponent implements OnInit {
popupShow= false;
message: string;
  constructor(private dialogService: PwmDialogService, private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.openPopup();
  }
  openPopup():void {
    this.dialogService.getDialogObserver().subscribe((status) => {
      this.dialogService.errorMessage.subscribe(res=>{
        this.message = res
      })
      this.popupShow = status === 'show';
      this.cdRef.detectChanges();
    })
  }
  onHidePopup():void{
    this.dialogService.reset();
  }
}
