import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CircularCarouselComponent } from './circular-carousel.component';

describe('CircularCarouselComponent', () => {
  let component: CircularCarouselComponent;
  let fixture: ComponentFixture<CircularCarouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CircularCarouselComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CircularCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
