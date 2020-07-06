import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, catchError, switchMap, delay, tap } from 'rxjs/operators';
import { UserService } from '../user.service';

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
