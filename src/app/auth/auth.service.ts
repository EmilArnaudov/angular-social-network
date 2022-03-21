import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { User } from '../shared/interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userLoggedIn!: boolean
  firebaseErrorMessage?: string

  constructor(private router: Router, private afAuth: AngularFireAuth) {
    this.userLoggedIn = false;

    this.afAuth.onAuthStateChanged((user) => {
      if (user) {
        this.userLoggedIn = true;
      } else {
        this.userLoggedIn = false;
      }
    })
  }


  register(user: User) {
    this.afAuth.createUserWithEmailAndPassword(user.email, user.password)
      .then(result => {
        this.router.navigate(['/app']);
      })
      .catch(error => {
        return {isValid: false, message: 'Email is already in use.'};
      }) ;
    }


  logout() {
    this.afAuth.signOut()
      .then(() => this.router.navigate(['/login']))
  }

  login(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password)
      .then(() => {this.router.navigate(['/app'])})
      .catch(error => {
        return {isValid: false, message: 'Username or password incorrect.'};
      })
  }


}



