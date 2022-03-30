import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore, collection, getDocs, getDoc, updateDoc, arrayUnion, onSnapshot, docSnapshots } from '@angular/fire/firestore';
import { doc, DocumentSnapshot } from 'firebase/firestore';
import { DocumentData } from '@angular/fire/firestore';
import { UserProfile } from '../shared/interfaces/user.interface';
import { Router } from '@angular/router';
import { ImageUploadService } from '../image-upload.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  userProfileData!: UserProfile | any

  constructor(private auth: Auth, private firestore: Firestore, private router: Router) { }

  // this null is added because currentUserUsername is always first parameter and is taken from localStorage which according to typescript
  // can be null

  async followUser(usernameFollower: string | null, usernameFollowing: string) {
    const followerRef = doc(this.firestore, 'users', usernameFollower ? usernameFollower : '');
    const followingRef = doc(this.firestore, 'users', usernameFollowing);

    await updateDoc(followerRef, {following: arrayUnion(usernameFollowing)});
    await updateDoc(followingRef, {followers: arrayUnion(usernameFollower)});

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
