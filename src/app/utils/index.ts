import {FormGroup} from "@angular/forms";

export const validateForm = (form: FormGroup) => {
  if (form.valid) return true

  Object.keys(form.controls).forEach((field) => {
    const control = form.get(field)
    control?.markAsTouched({ onlySelf: true })
    control?.markAsDirty({ onlySelf: true })
  })

  return false
}
