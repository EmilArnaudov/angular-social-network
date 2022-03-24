import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';
import { UserProfile } from '../shared/interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  userProfileData!: UserProfile | any

  constructor(private auth: Auth, private firestore: Firestore) { }

  show() {
    console.log(this.auth.currentUser);
  }

  loadUserInfo(username: string): Promise<UserProfile> {
    const collectionRef = collection(this.firestore, 'users');

    return getDocs(collectionRef)
      .then((response): UserProfile => {
        let users = response.docs.map((item) => {
          return {...item.data(), id: item.id}
        });
        
        this.userProfileData = users.filter((x: any) => x.username == username)[0];

        return this.userProfileData
        

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
