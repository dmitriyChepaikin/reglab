import {Component} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgIf} from "@angular/common";
import {Button, ButtonDirective} from "primeng/button";
import {PasswordModule} from "primeng/password";
import {validateForm} from "../../utils";
import {InputTextModule} from "primeng/inputtext";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    Button,
    PasswordModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonDirective
  ],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  signInForm = new FormGroup({
    username: new FormControl(
      '',
      Validators.compose([Validators.required, Validators.minLength(3)])
    ),
    password: new FormControl(
      '',
      Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20),
      ])
    ),
  })

  constructor(private authService: AuthService) {
  }

  get username() {
    return this.signInForm.get('username')
  }

  get password() {
    return this.signInForm.get('password')
  }

  onSubmit(): void {
    if (validateForm(this.signInForm)) {
      this.authService.login(this.username?.value!, this.password?.value!)
    }
  }
}
