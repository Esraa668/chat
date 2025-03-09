import { TestBed } from '@angular/core/testing';

import { UserDATAService } from './user-data.service';

describe('UserDATAService', () => {
  let service: UserDATAService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserDATAService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
