import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressTimeComponent } from './progress-time.component';

describe('ProgressTimeComponent', () => {
  let component: ProgressTimeComponent;
  let fixture: ComponentFixture<ProgressTimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProgressTimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgressTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
