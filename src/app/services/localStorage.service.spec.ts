import {TestBed} from '@angular/core/testing';
import {LocalStorageService} from './localStorage.service';
import {User} from '../store/model/user.model';

describe('LocalStorageService', () => {
  let service: LocalStorageService;

  const mockUser: User = {
    id: 1,
    username: 'testUser',
    is_online: true
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LocalStorageService]
    });
    service = TestBed.inject(LocalStorageService);
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('#setUser', () => {
    it('should save the user to localStorage and update the userSubject', () => {
      spyOn(localStorage, 'setItem' as any).and.callThrough();
      service.setUser(mockUser);

      expect(localStorage.setItem).toHaveBeenCalledWith(service.storageKey, JSON.stringify(mockUser));
      service.getUserObservable().subscribe(user => {
        expect(user).toEqual(mockUser);
      });
    });
  });

  describe('#getUser', () => {
    it('should return the user from localStorage', () => {
      localStorage.setItem(service.storageKey, JSON.stringify(mockUser));
      const user = service.getUser();
      expect(user).toEqual(mockUser);
    });

    it('should return null if there is no user in localStorage', () => {
      const user = service.getUser();
      expect(user).toBeNull();
    });

    it('should return null and log an error if parsing fails', () => {
      spyOn(console, 'error' as any);
      localStorage.setItem(service.storageKey, 'invalid JSON');
      const user = service.getUser();
      expect(user).toBeNull();
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('#getUserObservable', () => {
    it('should return an observable of the user', () => {
      service.setUser(mockUser);
      service.getUserObservable().subscribe(user => {
        expect(user).toEqual(mockUser);
      });
    });
  });

  describe('#storageClear', () => {
    it('should clear the localStorage and set userSubject to null', () => {
      spyOn(localStorage, 'clear' as any).and.callThrough();
      service.setUser(mockUser);
      service.storageClear();

      expect(localStorage.clear).toHaveBeenCalled();
      service.getUserObservable().subscribe(user => {
        expect(user).toBeNull();
      });
    });
  });
});
