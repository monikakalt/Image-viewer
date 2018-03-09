import { TestBed, inject } from '@angular/core/testing';

import { NativeService } from './native.service';

describe('NativeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NativeService]
    });
  });

  it('should be created', inject([NativeService], (service: NativeService) => {
    expect(service).toBeTruthy();
  }));
});
