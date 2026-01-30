import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTask } from './create-task';

describe('CreateTask', () => {
  let component: CreateTask;
  let fixture: ComponentFixture<CreateTask>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateTask]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateTask);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
