import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ReadmorePage } from './readmore.page';

describe('ReadmorePage', () => {
  let component: ReadmorePage;
  let fixture: ComponentFixture<ReadmorePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReadmorePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ReadmorePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
