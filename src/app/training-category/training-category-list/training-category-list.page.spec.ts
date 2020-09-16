import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TrainingCategoryListPage } from './training-category-list.page';

describe('TrainingCategoryListPage', () => {
  let component: TrainingCategoryListPage;
  let fixture: ComponentFixture<TrainingCategoryListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrainingCategoryListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TrainingCategoryListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
