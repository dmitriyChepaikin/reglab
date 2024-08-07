import {TestBed} from '@angular/core/testing';
import {Router} from '@angular/router';
import {MessageService} from 'primeng/api';
import {AuthService} from './auth.service';
import {LocalStorageService} from './localStorage.service';

describe('AuthService', () => {
  let service: AuthService;
  let routerSpy = {navigate: jasmine.createSpy('navigate')};
  let messageServiceSpy = {add: jasmine.createSpy('add')};
  let localStorageServiceSpy = {
    getUser: jasmine.createSpy('getUser'),
    setUser: jasmine.createSpy('setUser'),
    storageClear: jasmine.createSpy('storageClear')
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        {provide: Router, useValue: routerSpy},
        {provide: MessageService, useValue: messageServiceSpy},
        {provide: LocalStorageService, useValue: localStorageServiceSpy}
      ]
    });
    service = TestBed.inject(AuthService);
  });

  afterEach(() => {
    routerSpy.navigate.calls.reset();
    messageServiceSpy.add.calls.reset();
    localStorageServiceSpy.getUser.calls.reset();
    localStorageServiceSpy.setUser.calls.reset();
    localStorageServiceSpy.storageClear.calls.reset();
  });

  describe('#login', () => {
    it('should set loggedIn to true and navigate to home on successful login', () => {
      service.login('test', 'test123');
      expect(service.isAuthenticated()).toBeTrue();
      expect(localStorageServiceSpy.setUser).toHaveBeenCalledWith({
        id: 1,
        username: 'test',
        is_online: true
      } as any);
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/'] as any);
    });

    it('should show error message on failed login', () => {
      service.login('wrong', 'credentials');
      expect(service.isAuthenticated()).toBeFalse();
      expect(messageServiceSpy.add).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Authorization error',
        detail: 'Invalid username or password',
      } as any);
    });
  });

  describe('#isAuthenticated', () => {
    it('should return false if user is not logged in', () => {
      localStorageServiceSpy.getUser.and.returnValue(null);
      service = TestBed.inject(AuthService); // Recreate service to re-check loggedIn status
      expect(service.isAuthenticated()).toBeFalse();
    });
  });

  describe('#logout', () => {
    it('should clear storage, set loggedIn to false, and navigate to login', () => {
      service.logout();
      expect(localStorageServiceSpy.storageClear).toHaveBeenCalled();
      expect(service.isAuthenticated()).toBeFalse();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/login'] as any);
    });
  });
});
