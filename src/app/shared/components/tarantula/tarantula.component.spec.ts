import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TarantulaComponent } from './tarantula.component';

describe('TarantulaComponent', () => {
  let component: TarantulaComponent;
  let fixture: ComponentFixture<TarantulaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TarantulaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TarantulaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
