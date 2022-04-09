import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore, collection, getDocs, updateDoc, arrayUnion, docSnapshots, query, orderBy, limit } from '@angular/fire/firestore';
import { DocumentData, doc, DocumentSnapshot } from '@angular/fire/firestore';
import { UserProfile } from '../shared/interfaces/user.interface';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { where } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  userProfileData!: UserProfile | any

  constructor(private auth: Auth, private firestore: Firestore, private router: Router) { }


  async followUser(usernameFollower: string | null, usernameFollowing: string) {
    const followerRef = doc(this.firestore, 'users', usernameFollower ? usernameFollower : '');
    const followingRef = doc(this.firestore, 'users', usernameFollowing);

    return Promise.all([updateDoc(followerRef, {following: arrayUnion(usernameFollowing)}), updateDoc(followingRef, {followers: arrayUnion(usernameFollower)})])
    
  }

  setLogoutTime(username: string, time: string) {
    const userRef = doc(this.firestore, 'users', username)


    return Promise.all([updateDoc(userRef, {lastSeen: time}), updateDoc(userRef, {status: 'offline'})])

  }


  updateUserInfo(username: string, data: object) {
    const docRef = doc(this.firestore, 'users', username);

    return updateDoc(docRef, data)
      .then(() => {
        this.router.navigate(['/app/', username]);
      })
      .catch(error => console.log(error)
      )
  }

  loadUserInfo(username: string | null): Observable<DocumentSnapshot<DocumentData>> {
    const docRef = doc(this.firestore, 'users', username ? username : '');
  
    return docSnapshots(docRef);
  }

  async loadUserInfoOnLogin(): Promise<UserProfile> {
    const collectionRef = collection(this.firestore, 'users');
    let response = await getDocs(collectionRef)



    let users = response.docs.map((item) => {
      return {...item.data(), id: item.id}
    });

    this.userProfileData = users.filter((x: any) => x.email == this.auth.currentUser?.email)[0];
    
    const userRef = doc(this.firestore, 'users', this.userProfileData.username)
    await updateDoc(userRef, {status: 'online'})

    return this.userProfileData

  }


  async loadMostPopular() {
    const collectionRef = collection(this.firestore, 'users');
    const usersQuery = query(collectionRef, orderBy("postsCount", "desc"), limit(3));

    let response = await getDocs(usersQuery)

    let users = response.docs.map((item): UserProfile | DocumentData => item.data());

    return users;
    
  }
}
