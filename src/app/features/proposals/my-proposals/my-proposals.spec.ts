import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyProposals } from './my-proposals';

describe('MyProposals', () => {
  let component: MyProposals;
  let fixture: ComponentFixture<MyProposals>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyProposals],
    }).compileComponents();

    fixture = TestBed.createComponent(MyProposals);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
