import { TestBed, inject } from '@angular/core/testing';

import { ElectronMenuService } from './electron-menu.service';

describe('ElectronMenuService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ElectronMenuService]
    });
  });

  it('should be created', inject([ElectronMenuService], (service: ElectronMenuService) => {
    expect(service).toBeTruthy();
  }));
});
