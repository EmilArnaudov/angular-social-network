import { Component, OnInit } from '@angular/core';
import { UserProfile } from 'firebase/auth';
import { UserService } from '../user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  userData!: UserProfile | any;

  constructor(private userService: UserService) {
   }

  ngOnInit(): void {
    this.userService.loadUserInfo()
      .then(data => {
        this.userData = data;
      });
    
    
  }

}
