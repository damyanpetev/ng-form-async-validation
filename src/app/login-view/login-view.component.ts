import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup, AbstractControl } from '@angular/forms';
import { UserExistsValidator } from './user-exists-validator';

@Component({
  selector: 'app-login-view',
  templateUrl: './login-view.component.html',
  styleUrls: ['./login-view.component.scss']
})
export class LoginViewComponent {
  public user: FormGroup;

  public get fullName(): AbstractControl { return this.user.get('fullName'); }
  public get email(): AbstractControl { return this.user.get('email'); }
  public get password(): AbstractControl { return this.user.get('password'); }

  constructor(fb: FormBuilder, public userExistsValidator: UserExistsValidator) {
    this.user = fb.group( {
        email: ['', [Validators.required, Validators.email], this.userExistsValidator.validate],
        password: ['', [Validators.required, Validators.minLength(8)]],
        fullName: ['', Validators.required]
    });
  }

  public tryRegister(): void {
    console.log('register');
  }
}
