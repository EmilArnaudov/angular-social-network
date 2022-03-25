import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore, collection, getDocs, where, getDoc, updateDoc } from '@angular/fire/firestore';
import { doc } from 'firebase/firestore';
import { DocumentData } from '@angular/fire/firestore';
import { UserProfile } from '../shared/interfaces/user.interface';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  userProfileData!: UserProfile | any

  constructor(private auth: Auth, private firestore: Firestore, private router: Router) { }

  updateUserInfo(username: string, data: object) {
    const docRef = doc(this.firestore, 'users', username);

    return updateDoc(docRef, data)
      .then(() => {
        this.router.navigate(['/app/', username]);
      })
      .catch(error => console.log(error)
      )
  }

  loadUserInfo(username: string | null): Promise<DocumentData | undefined | UserProfile> {
    const docRef = doc(this.firestore, 'users', username ? username : '');
    
    console.log(docRef);
    

    return getDoc(docRef)
      .then((response): DocumentData | undefined | UserProfile => {
        let object = response.data();
        return object;
      });
  }

  loadUserInfoOnLogin(): Promise<UserProfile> {
    const collectionRef = collection(this.firestore, 'users');

    return getDocs(collectionRef)
      .then((response): UserProfile => {
        let users = response.docs.map((item) => {
          return {...item.data(), id: item.id}
        });
        
        this.userProfileData = users.filter((x: any) => x.email == this.auth.currentUser?.email)[0];

        return this.userProfileData
        

      });


  }
}
