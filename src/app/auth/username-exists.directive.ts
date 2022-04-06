import { Directive } from '@angular/core';
import { doc, Firestore, getDoc } from '@angular/fire/firestore';
import { AbstractControl, AsyncValidator, NG_ASYNC_VALIDATORS, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';

@Directive({
  selector: '[appUsernameExists]',
  providers: [
    {provide: NG_ASYNC_VALIDATORS,
    useExisting: UsernameExistsDirective,
    multi: true}
  ]
})
export class UsernameExistsDirective implements AsyncValidator{

  constructor(private firestore: Firestore) { }

  async validate(control: AbstractControl): Promise<ValidationErrors | null> {
    const username = control.value;

    let userDocRef = doc(this.firestore, 'users', username);
    let userDoc = await getDoc(userDocRef);

    let data = userDoc.data();

    console.log('I AM CHECKING USERNAME: ', data);
    

    return data ? {usernameTaken: 'Username is already taken.'} : null
  }
}
