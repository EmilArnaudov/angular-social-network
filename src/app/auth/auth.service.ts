import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';


import { User } from '../shared/interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userLoggedIn!: boolean;           // other components can check logged status of user

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore
    ) {
      this.userLoggedIn = false;

      this.afAuth.onAuthStateChanged((user) => {
        if (user) {
          this.userLoggedIn = true;
        } else {
          this.userLoggedIn = false;
        }
      })
    }
  

    loginUser(email: string, password: string): Promise<any> {
      return this.afAuth.signInWithEmailAndPassword(email, password)
        .then(() => {
          console.log('User logged in successfully.');
          this.router.navigate(['/app']);
          
        })
        .catch((error) => {
          console.log(error);
        
          if (error) {
            return {isValid: false, message: error.message}
          } else {
            return;
          }

        })
      
    }

    registerUser(user: User): Promise<any> {
      return this.afAuth.createUserWithEmailAndPassword(user.email, user.password)
        .then((result) => {
          let emailLower = user.email.toLowerCase();

          this.afs.doc('/users/' + emailLower)
            .set({
              accountType: 'endUser',
              username: user.username,
              usernameLower: user.username.toLowerCase(),
              email: user.email,
              emailLower: emailLower,
            });

            this.router.navigate(['/app']);
        })
      .catch(error => {
        console.log(error);
        if (error) {
          return {isValid: false, message: error.message}
        } else {
          return;
        }
      })
    }

    logoutUser(): Promise<void> {
      return this.afAuth.signOut()
        .then(() => {
          this.router.navigate(['/']);
        })
        .catch(error => {
          console.log(error);
          if(error.code) {
            return error;
          }
        })
    }

    setUserInfo(payload: object): void {
      console.log('Saving user info..');
      this.afs.collection('users')
        .add(payload)
        .then(res => {
          console.log('Info response');
          console.log(res);
        })
    }

}
