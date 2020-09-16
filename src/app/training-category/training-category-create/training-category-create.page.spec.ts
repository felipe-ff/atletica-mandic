import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TrainingCategoryCreatePage } from './training-category-create.page';

describe('TrainingCategoryCreatePage', () => {
  let component: TrainingCategoryCreatePage;
  let fixture: ComponentFixture<TrainingCategoryCreatePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrainingCategoryCreatePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TrainingCategoryCreatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
