import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleEntitiesComponent } from './sample-entities.component';

describe('SampleEntitiesComponent', () => {
  let component: SampleEntitiesComponent;
  let fixture: ComponentFixture<SampleEntitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SampleEntitiesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SampleEntitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
