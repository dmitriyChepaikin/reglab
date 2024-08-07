import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { LoginComponent } from './login.component';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonDirective } from 'primeng/button';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('AuthService', ['login']);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        InputTextModule,
        PasswordModule,
        ButtonDirective,
        LoginComponent
      ],
      providers: [
        { provide: AuthService, useValue: spy }
      ]
    }).compileComponents();

    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty values', () => {
    expect(component.signInForm.value).toEqual({ username: '', password: '' });
  });

  it('should require username and password', () => {
    component.signInForm.setValue({ username: '', password: '' });
    expect(component.signInForm.valid).toBeFalsy();

    component.signInForm.setValue({ username: 'user', password: '' });
    expect(component.signInForm.valid).toBeFalsy();

    component.signInForm.setValue({ username: '', password: 'pass' });
    expect(component.signInForm.valid).toBeFalsy();

    component.signInForm.setValue({ username: 'user', password: 'pass' });
    expect(component.signInForm.valid).toBeTruthy();
  });

  it('should call authService.login with correct credentials', () => {
    component.signInForm.setValue({ username: 'user', password: 'pass' });
    component.onSubmit();

    expect(authServiceSpy.login).toHaveBeenCalledWith('user', 'pass');
  });

  it('should not call authService.login with invalid form', () => {
    component.signInForm.setValue({ username: '', password: '' });
    component.onSubmit();

    expect(authServiceSpy.login).not.toHaveBeenCalled();
  });
});
