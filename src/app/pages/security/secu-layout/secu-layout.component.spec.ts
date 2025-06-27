import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecuLayoutComponent } from './secu-layout.component';

describe('SecuLayoutComponent', () => {
  let component: SecuLayoutComponent;
  let fixture: ComponentFixture<SecuLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecuLayoutComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SecuLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
