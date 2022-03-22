import { Injectable } from '@angular/core';
import { onAuthStateChanged, Auth, createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword } from '@angular/fire/auth';
import { addDoc, collection, Firestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';

import { User } from '../shared/interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userLoggedIn!: boolean
  firebaseErrorMessage?: string

  constructor(private router: Router, private auth: Auth, public firestore: Firestore) {
    this.userLoggedIn = false;

    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.userLoggedIn = true;
      } else {
        this.userLoggedIn = false;
      }
    })
  }


  register(user: User) {
    createUserWithEmailAndPassword(this.auth, user.email, user.password)
      .then(result => {
        this.router.navigate(['/app']);

        const collectionRef = collection(this.firestore, 'users');
        addDoc(collectionRef, {
          email: user.email,
          username: user.username,
          followers: [],
          following: [],
          posts: [],
          likesOnOwnPosts: [],
          postsLiked: [],
          profilePicture: '',
          profileDescription: '',
        })
          .then((result) => {
            console.log(result);
          })
          .catch(error => console.error(error))

      })
      .catch(error => {
        return {isValid: false, message: 'Email is already in use.'};
      }) ;
    }


  logout() {
    signOut(this.auth)
      .then(() => this.router.navigate(['/login']))
  }

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password)
      .then(() => {this.router.navigate(['/app'])})
      .catch(error => {
        return {isValid: false, message: 'Username or password incorrect.'};
      })
  }


}



