import { Component, OnDestroy, OnInit } from '@angular/core';
import { DocumentData } from '@angular/fire/firestore';
import { Observable, Subscription } from 'rxjs';
import { UserProfile } from '../shared/interfaces/user.interface';
import { ChatService } from './chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {
  private participant!: string
  contactSubscription!: Subscription

  participantOne = localStorage.getItem('<USERNAME>')

  get participantTwo(): string {
    return this.participant
  }

  set participantTwo(value) {
    this.participant = value;
    this.chatService.loadMessages(this.participantOne as string, this.participantTwo)
      .subscribe(async (messagesObservable) => {
        if (messagesObservable == null) {
          await this.chatService.createNewChat(this.participantOne as string, this.participantTwo)
        }

        messagesObservable?.subscribe(messages => {this.messages = messages.data()?.['messages']; console.log(this.messages)}
        );
      })
  }

  participantData!: UserProfile;

  message: string = ''
  contacts = [] as any;
  messages: DocumentData | undefined = [];

  constructor(private chatService: ChatService) { }

  ngOnInit(): void {
    this.contactSubscription = this.chatService.loadContacts()
      .subscribe(contact => {
        if (contact) {
          let isUnique = this.checkUnique(contact['username'])
          
          if(isUnique && contact['username'] !== localStorage.getItem('<USERNAME>')) {
            this.contacts.push(contact);

            if (!this.participantTwo) {
              this.participantData = contact as any;
              this.participantTwo = contact['username'];
            }
          }
        }
      })
    

  }

  handleSubmit(event: any) {
    if (event.keyCode === 13) {
      this.sendMessage();   
    }
  }

  sendMessage() {
    this.chatService.loadContacts();
  }

  selectParticipant(participantUsername: string) {
    this.participantTwo = participantUsername;
    this.participantData = this.contacts.find((user: UserProfile) => user.username == participantUsername)
  }

  private checkUnique(username: string) {
    return !this.contacts.find((contact: UserProfile) => contact.username  == username);
  }

  ngOnDestroy(): void {
    this.contactSubscription.unsubscribe();
    console.log('unsubscribing');
    this.contacts.splice(0, this.contacts.length-1);
    
  }

}
