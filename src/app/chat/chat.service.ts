import { Injectable } from '@angular/core';
import { addDoc, docSnapshots, Firestore, getDoc, getDocs, query, setDoc, where } from '@angular/fire/firestore';
import { collection, doc } from 'firebase/firestore';
import { from, mergeMap, ObservableInput, of } from 'rxjs';

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

  async findChatId(participantOne: string, participantTwo: string) {
    let collectionRef = collection(this.firestore, 'chats')
    let participantsArray = [participantOne+participantTwo, participantTwo+participantOne]
    let q1 = query(collectionRef, where('participants', 'array-contains-any', participantsArray))

    let res = await getDocs(q1);
    let resDocs = res.docs.map(x => {return {...x.data(), id: x.id}});
    if (resDocs.length > 0) {
      return resDocs[0]['id'];
    }

    return null;
  }

  loadMessages(participantOne: string, participantTwo: string) {
    return from(this.findChatId(participantOne, participantTwo)
      .then(id => {
        if (!id) {
          return null;
        }
        let docRef = doc(this.firestore, 'chats', id);
        return docSnapshots(docRef);
      }))
  }

  async createNewChat(participantOne: string, participantTwo: string) {
    let participants = participantOne + participantTwo;
    let chat = {
      messages: [],
      participants: [participants]
    }

    let chatCollection = collection(this.firestore, 'chats');
    let docRef = await addDoc(chatCollection, chat)

    console.log(docRef.id);
    
  }

}

