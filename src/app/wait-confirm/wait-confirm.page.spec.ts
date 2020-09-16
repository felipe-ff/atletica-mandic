import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WaitConfirmPage } from './wait-confirm.page';

describe('WaitConfirmPage', () => {
  let component: WaitConfirmPage;
  let fixture: ComponentFixture<WaitConfirmPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaitConfirmPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WaitConfirmPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
