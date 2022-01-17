import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { TableModule } from 'primeng/table';

import { PwmConsumePartialPalletsComponent } from './pwm-consume-partial-pallets.component';

describe('PwmConsumePartialPalletsComponent', () => {
  let component: PwmConsumePartialPalletsComponent;
  let fixture: ComponentFixture<PwmConsumePartialPalletsComponent>;
  let formBuilder: FormBuilder = new FormBuilder();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        RouterTestingModule,
        ReactiveFormsModule,
        TableModule,
        AutoCompleteModule,
      ],
      declarations: [ PwmConsumePartialPalletsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PwmConsumePartialPalletsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
