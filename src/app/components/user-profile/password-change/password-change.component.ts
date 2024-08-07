import {Component} from '@angular/core'
import {FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators} from '@angular/forms'
import {InputGroupAddonModule} from 'primeng/inputgroupaddon'
import {InputGroupModule} from 'primeng/inputgroup'
import {PasswordModule} from 'primeng/password'
import {ButtonModule} from 'primeng/button'
import {InputLabelContainerComponent} from "../../../layouts/input-label-container/input-label-container.component";
import {MessageService} from "primeng/api";

const mustMatch = (
  controlName: string,
  matchingControlName: string,
): ValidatorFn => {
  return (control: any): { [key: string]: any } | null => {
    const formGroup = control.controls
    if (formGroup) {
      const controlToCompare = formGroup[controlName]
      const matchingControl = formGroup[matchingControlName]

      if (matchingControl?.errors && !matchingControl.errors['mustMatch']) {
        return null
      }

      if (controlToCompare?.value !== matchingControl?.value) {
        matchingControl?.setErrors({mustMatch: true})
      } else {
        matchingControl?.setErrors(null)
      }
    }
    return null
  }
}

@Component({
  selector: 'app-user-profile-password-change',
  standalone: true,
  templateUrl: './password-change.component.html',
  imports: [
    InputGroupAddonModule,
    InputGroupModule,
    PasswordModule,
    ReactiveFormsModule,
    ButtonModule,
    InputLabelContainerComponent,
  ],
})
export class PasswordChangeComponent {
  passwordForm = new FormGroup(
    {
      password: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(20),
        ]),
      ),
      newPassword: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(20),
        ]),
      ),
      repeatedPassword: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(20),
        ]),
      ),
    },
    {validators: mustMatch('newPassword', 'repeatedPassword')},
  )

  get password() {
    return this.passwordForm.get('password')
  }

  get newPassword() {
    return this.passwordForm.get('newPassword')
  }

  get repeatedPassword() {
    return this.passwordForm.get('repeatedPassword')
  }

  constructor(private messageService: MessageService) {
  }

  onSubmitNewPassword() {
    if (this.passwordForm.valid) {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Password should be change',
      })
    } else {
      this.passwordForm.markAsDirty()
      this.passwordForm.markAllAsTouched()
    }
  }
}
