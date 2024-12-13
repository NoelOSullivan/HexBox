import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BichromeTitleComponent } from './bichrome-title.component';

describe('BichromeTitleComponent', () => {
  let component: BichromeTitleComponent;
  let fixture: ComponentFixture<BichromeTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BichromeTitleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BichromeTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
