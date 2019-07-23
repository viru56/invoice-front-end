import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxDialogComponent } from './tax-dialog.component';

describe('TaxDialogComponent', () => {
  let component: TaxDialogComponent;
  let fixture: ComponentFixture<TaxDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaxDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
