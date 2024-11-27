import { TestBed } from '@angular/core/testing';

import { OrderPageService } from './service.service';

describe('OrderPageService', () => {
  let service: OrderPageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrderPageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
