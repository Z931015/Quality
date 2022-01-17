import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PwmCombinePalletsComponent } from './pwm-combine-pallets.component';

describe('PwmCombinePalletsComponent', () => {
  let component: PwmCombinePalletsComponent;
  let fixture: ComponentFixture<PwmCombinePalletsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PwmCombinePalletsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PwmCombinePalletsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
