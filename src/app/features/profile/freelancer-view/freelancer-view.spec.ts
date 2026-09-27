import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FreelancerView } from './freelancer-view';

describe('FreelancerView', () => {
  let component: FreelancerView;
  let fixture: ComponentFixture<FreelancerView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FreelancerView],
    }).compileComponents();

    fixture = TestBed.createComponent(FreelancerView);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
