import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotifyToastComponent } from './notify-toast.component';

describe('NotifyToastComponent', () => {
  let component: NotifyToastComponent;
  let fixture: ComponentFixture<NotifyToastComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotifyToastComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotifyToastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
