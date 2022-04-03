import { Injectable } from '@angular/core';
import { Firestore, getDoc, getDocs, query, where } from '@angular/fire/firestore';
import { collection } from 'firebase/firestore';
import { mergeMap, ObservableInput, of } from 'rxjs';

import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  username = localStorage.getItem('<USERNAME>');

  constructor(private firestore: Firestore, private userService: UserService) { }

  sendMessage(message: string) {

  }

  loadContacts() {
    return this.userService.loadUserInfo(this.username)
      .pipe(mergeMap((snapshot): ObservableInput<any> => {
        let user = snapshot.data();
        let usersFollowing = user?.['following']
        return usersFollowing;
      }),
      mergeMap((contactName) => {return this.userService.loadUserInfo(contactName)}),
      mergeMap((contactData) => of(contactData.data())))
  }

  async loadMessages(participantOne: string, participantTwo: string) {
    let collectionRef = collection(this.firestore, 'chats')
    let participantsArray = [participantOne+participantTwo, participantTwo+participantOne]
    let q1 = query(collectionRef, where('participants', 'array-contains-any', participantsArray))

    let res = await getDocs(q1);
    console.log(res.docs.map(x => x.data()));
    
  }

}

