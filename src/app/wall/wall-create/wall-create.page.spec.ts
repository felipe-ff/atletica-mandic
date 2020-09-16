import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WallCreatePage } from './wall-create.page';

describe('WallCreatePage', () => {
  let component: WallCreatePage;
  let fixture: ComponentFixture<WallCreatePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WallCreatePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WallCreatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
