import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TrainingListPage } from './training-list.page';

describe('TrainingListPage', () => {
  let component: TrainingListPage;
  let fixture: ComponentFixture<TrainingListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrainingListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TrainingListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
