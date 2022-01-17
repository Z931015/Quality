import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { PwmPalletInquiryService } from 'src/app/shared/service/pwm-pallet-inquiry.service';
import { ServiceConfig } from 'src/app/shared/util/serviceconfig';

import { PwmDefinableShippingParametersGridComponent } from './pwm-definable-shipping-parameters-grid.component';

describe('PwmDefinableShippingParametersGridComponent', () => {
  let component: PwmDefinableShippingParametersGridComponent;
  let fixture: ComponentFixture<PwmDefinableShippingParametersGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PwmDefinableShippingParametersGridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PwmDefinableShippingParametersGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
