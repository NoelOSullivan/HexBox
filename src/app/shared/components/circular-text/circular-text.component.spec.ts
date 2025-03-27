import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CircularTextComponent } from './circular-text.component';

describe('CircularTextComponent', () => {
  let component: CircularTextComponent;
  let fixture: ComponentFixture<CircularTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CircularTextComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CircularTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
