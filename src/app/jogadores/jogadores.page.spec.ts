import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { JogadoresPage } from './jogadores.page';

describe('JogadoresPage', () => {
  let component: JogadoresPage;
  let fixture: ComponentFixture<JogadoresPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JogadoresPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(JogadoresPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
