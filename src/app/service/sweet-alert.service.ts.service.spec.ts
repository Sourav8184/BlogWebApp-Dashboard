import { TestBed } from '@angular/core/testing';

import { SweetAlertServiceTsService } from './sweet-alert.service.ts.service';

describe('SweetAlertServiceTsService', () => {
  let service: SweetAlertServiceTsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SweetAlertServiceTsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
