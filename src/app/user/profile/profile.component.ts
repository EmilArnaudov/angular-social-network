import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserProfile } from 'firebase/auth';
import { UserService } from '../user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  userData!: UserProfile | any;
  currentUserUsername = localStorage.getItem('<USERNAME>');

  constructor(private userService: UserService, private route: ActivatedRoute) {
   }


   //Subcription is needed here because loading a profile from another profile didnt update the values.

   ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['username']) {
        this.userService.loadUserInfo(params['username'])
          .subscribe(data => {
            this.userData = data.data();
            console.log(data.data());
                    
          })
      }
    })
  }

  async followUser() {
    await this.userService.followUser(this.currentUserUsername, this.userData.username);
  }

  // ngOnInit(): void {
  //   let username = this.route.snapshot.params['username'];

  //   this.userService.loadUserInfo(username)
  //     .then(data => {
  //       this.userData = data;
  //     });
  // }

}
