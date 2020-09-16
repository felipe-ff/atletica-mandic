import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TrainingsPage } from './trainings.page';

describe('TrainingsPage', () => {
  let component: TrainingsPage;
  let fixture: ComponentFixture<TrainingsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrainingsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TrainingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
