import {TestBed} from '@angular/core/testing';

import {WindowService} from './window_service';

describe('WindowService', () => {
  let service: WindowService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WindowService, {provide: 'Window', useValue: {}}],
    });

    service = TestBed.inject(WindowService);
  });

  it('exists', () => {
    expect(service).toBeTruthy();
  });
});
