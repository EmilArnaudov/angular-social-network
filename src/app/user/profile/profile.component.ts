import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserProfile } from 'firebase/auth';
import { UserService } from '../user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  userData!: UserProfile | any;

  constructor(private userService: UserService, private route: ActivatedRoute) {
   }

  ngOnInit(): void {
    let username = this.route.snapshot.params['username'];

    this.userService.loadUserInfo(username)
      .then(data => {
        this.userData = data;
      });
    
    
  }

}
