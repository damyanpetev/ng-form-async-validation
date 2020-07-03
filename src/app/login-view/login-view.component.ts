import { Component, Injectable } from '@angular/core';
import { FormBuilder, Validators, FormGroup, AbstractControl, AsyncValidator, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, catchError, switchMap, delay, tap } from 'rxjs/operators';
import { UserService } from '../user.service';

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


@Injectable({ providedIn: 'root' })
export class UserExistsValidator implements AsyncValidator {

  public checking = false;

  constructor(private userService: UserService) {}

  validate = (control: AbstractControl): Observable<ValidationErrors | null> => {
    console.log(`validate ${control.value}`);
    // delay check by 400ms, consecutive input should unsubscribe and start new check
    return of(control.value as string).pipe(
      delay(400),
      tap(() => this.checking = true),
      switchMap((email) => {
        console.log(`really, really validate ${control.value}`);
        return this.userService.registrationExists(email).pipe(
          map(exists => (exists ? { emailExists: true } : null)),
          tap(() => this.checking = false),
          catchError(() => of(null))
        );
      })
    );
  }
}