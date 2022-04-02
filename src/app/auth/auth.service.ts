import { Injectable } from '@angular/core';
import { onAuthStateChanged, Auth, createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword, UserCredential } from '@angular/fire/auth';
import { Firestore, setDoc, doc } from '@angular/fire/firestore';
import { Router } from '@angular/router';

import { User } from '../shared/interfaces/user.interface';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userLoggedIn!: boolean
  firebaseErrorMessage?: string

  constructor(private router: Router, private auth: Auth, public firestore: Firestore, private userService: UserService) {
    this.userLoggedIn = false;

    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.userLoggedIn = true;
      } else {
        this.userLoggedIn = false;
      }
    })
  }


  register(user: User): Promise<{isValid: boolean, message: string}> | Promise<any> {
    return createUserWithEmailAndPassword(this.auth, user.email, user.password)
      .then(result => {
        const docRef = doc(this.firestore, 'users', user.username);

        setDoc(docRef, {
          email: user.email,
          username: user.username,
          fullName: '',
          firstName: '',
          lastName: '',
          followers: [],
          following: [],
          posts: [],
          likesOnOwnPosts: [],
          postsLiked: [],
          profilePicture: '',
          profileDescription: '',
        })
          .then(result => {
            localStorage.setItem('<USERNAME>', user.username);
            this.router.navigate(['/app']);
          })
          .catch(error => {
            return {isValid: false, message: 'Username is already taken.'}
          })
      })
        .catch(error => {
          return {isValid: false, message: 'Email is already taken.'}
        })
  }



  logout() {
    signOut(this.auth)
      .then(() => {
      localStorage.clear();
      this.router.navigate(['/login'])})
  }

  async login(email: string, password: string) {
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
      const userData = await this.userService.loadUserInfoOnLogin();
      console.log(userData.username);
      
      await localStorage.setItem('<USERNAME>', userData.username)
      return null;
    } catch (error) {
      return {isValid: false, message: 'Username or password incorrect.'};
    }


  }


}



