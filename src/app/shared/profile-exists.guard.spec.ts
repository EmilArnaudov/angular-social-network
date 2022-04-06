import { TestBed } from '@angular/core/testing';

import { ProfileExistsGuard } from './profile-exists.guard';

describe('ProfileExistsGuard', () => {
  let guard: ProfileExistsGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ProfileExistsGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
