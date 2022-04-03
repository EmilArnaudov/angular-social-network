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
          following: [user.username],
          posts: ['subsure'],
          likesOnOwnPosts: [],
          postsLiked: [],
          profilePicture: 'https://firebasestorage.googleapis.com/v0/b/socialnetwork-9b824.appspot.com/o/images%2Fprofile%2Fdefault-profile.jpg?alt=media&token=acf5080c-4843-4962-8c93-583d52659e88',
          profileDescription: '',
        })
          .then(result => {
            localStorage.setItem('<USERNAME>', user.username);
            localStorage.setItem('<PROFILEPIC>', 'https://firebasestorage.googleapis.com/v0/b/socialnetwork-9b824.appspot.com/o/images%2Fprofile%2Fdefault-profile.jpg?alt=media&token=acf5080c-4843-4962-8c93-583d52659e88');
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
      localStorage.setItem('<USERNAME>', userData.username)
      localStorage.setItem('<PROFILEPIC>', userData.profilePicture)
      return null;
    } catch (error) {
      return {isValid: false, message: 'Username or password incorrect.'};
    }


  }


}



