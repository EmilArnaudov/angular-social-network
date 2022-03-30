import { Component, OnInit, ViewChild } from '@angular/core';
import { DocumentData } from '@angular/fire/firestore';
import { NgForm } from '@angular/forms';
import { ImageUploadService } from 'src/app/image-upload.service';


import { UserProfile } from 'src/app/shared/interfaces/user.interface';
import { UserService } from '../user.service';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss']
})
export class ProfileEditComponent implements OnInit {

  @ViewChild('form') form!: NgForm

  userData!: DocumentData | undefined | UserProfile
  pictureUploaded = false;
  profilePictureUrl = '';

  constructor(private userService: UserService, private imageUploadService: ImageUploadService) { }

  ngOnInit(): void {
      let username = localStorage.getItem('<USERNAME>')
      this.userService.loadUserInfo(username)
        .subscribe(data => {
          this.userData = data.data();
        })  
  }

  updateUserInfo() {
    if (this.profilePictureUrl !== '') {
      this.form.value.profilePicture = this.profilePictureUrl;
    }

    this.userService.updateUserInfo(this.userData?.username, this.form.value)
      .then(() => {console.log('Success');
      })
      .catch(error => console.log(error)
      )
  }

  uploadProfilePicture(event: any, username: string) {
    const image = event.target.files[0];
    const path = `images/profile/${username}`

    this.imageUploadService.uploadImage(image, path)
      .subscribe(profilePicture => this.profilePictureUrl = profilePicture);
    
    this.pictureUploaded = true;
  }

}
