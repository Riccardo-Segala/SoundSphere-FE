import { TestBed } from '@angular/core/testing';

import { SampleEntityService } from './sample-entity.service';

describe('SampleEntityService', () => {
  let service: SampleEntityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SampleEntityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
