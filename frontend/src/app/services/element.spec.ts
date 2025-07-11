import { TestBed } from '@angular/core/testing';

import { Element } from './element';

describe('Element', () => {
  let service: Element;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Element);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
