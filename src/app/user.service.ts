import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UserService {

  registrationExists(user: string): Observable<boolean> {
    console.log(`registrationExists: ${user}`);
    return of(user !== 'not@taken').pipe(delay(1500));
  }

}
