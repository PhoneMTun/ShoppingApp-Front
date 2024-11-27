import { TestBed } from '@angular/core/testing';

import { ProductPageService } from './service.service';

describe('ServiceService', () => {
  let service: ProductPageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductPageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
