import { Component, OnInit } from '@angular/core';
import { DocumentData } from '@angular/fire/firestore';
import { UserProfile } from '../shared/interfaces/user.interface';
import { UserService } from '../user/user.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  users!: UserProfile[];

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.loadMostPopular()
      .then(usersData => {
        this.users = usersData as UserProfile[];
        
      })
  }

}
