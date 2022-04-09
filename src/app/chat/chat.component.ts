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
  private participant!: string;
  contactSubscription!: Subscription;
  messagesObservableOne!: Subscription;
  messagesObservableTwo!: Subscription | undefined;

  participantOne = localStorage.getItem('<USERNAME>') as string;

  get userProfilePicture() {
    return localStorage.getItem('<PROFILEPIC>') as string;
  }

  get participantTwo(): string {
    return this.participant
  }

  set participantTwo(value) {
    this.participant = value;
    this.messagesObservableOne = this.chatService.loadMessages(this.participantOne as string, this.participantTwo)
      .subscribe(async (messagesObservable) => {
        if (messagesObservable == null) {
          await this.chatService.createNewChat(this.participantOne as string, this.participantTwo)
          this.messages.splice(0, this.contacts.length-1);
          this.participantTwo = this.participantTwo;
        }

        this.messagesObservableTwo = messagesObservable?.subscribe(messages => {this.messages = messages.data()?.['messages']; console.log(this.messages)}
        );
      })
  }

  participantData!: UserProfile;

  message: string = ''
  contacts = [] as any;
  messages = [] as any;

  constructor(private chatService: ChatService) { }

  ngOnInit(): void {
    this.contactSubscription = this.chatService.loadContacts()
      .subscribe((contact) => {
        if (contact) {
          let isUnique = this.checkUnique(contact['username'])
          
          if(isUnique && contact['username'] !== localStorage.getItem('<USERNAME>')) {
            this.getLastSeen(contact as UserProfile);
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
    this.chatService.sendMessage(this.message, this.participantOne, this.participantTwo);
    this.message = '';
  }

  selectParticipant(participantUsername: string) {
    this.participantTwo = participantUsername;
    this.participantData = this.contacts.find((user: UserProfile) => user.username == participantUsername)
  }

  private checkUnique(username: string) {
    return !this.contacts.find((contact: UserProfile) => contact.username  == username);
  }

  private getLastSeen(contact: UserProfile) {
    let time = Date.now();

    if (contact.status == 'online') {
      return;
    }

    let timeDiff = time - Number(contact.lastSeen);

    let seconds = Math.floor(timeDiff / 1000);
    if (seconds < 60) {
      contact.lastSeenReadable = `${seconds} seconds`
      return;
    }

    let minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      contact.lastSeenReadable = `${minutes} minutes`
      return;
    }

    let hours = Math.floor(minutes / 60);
    if (hours < 24) {
      contact.lastSeenReadable = `${hours} hours`
      return;
    }

    let days = Math.floor(hours / 24);
    if (days < 7) {
      contact.lastSeenReadable = `${days} days`
      return;
    }

    let weeks = Math.floor(days / 7)
    if (weeks < 4) {
      contact.lastSeenReadable = `${weeks} weeks`
      return;
    }

    let months = Math.floor(weeks / 4)
    if (months < 12) {
      contact.lastSeenReadable = `${months} months`
      return;
    }

    let years = Math.floor(months / 12);
    contact.lastSeenReadable = `${years} years`
    return;
  }

  ngOnDestroy(): void {
    this.contactSubscription.unsubscribe();
    // this.messagesObservableOne.unsubscribe();
    if ( this.messagesObservableTwo) {
      this.messagesObservableTwo.unsubscribe();
    }
    console.log('unsubscribing');
    this.contacts.splice(0, this.contacts.length-1);
    
  }

}
