import { Injectable } from '@angular/core';
import { doc, Firestore, setDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class PostsServiceService {

  constructor(private firestore: Firestore, private userService: UserService, private router: Router) { }

  async createPost(imageUrl: string, description: string, username: string | null) {
    let dateOfCreation = Date.now().toString();
    const docRef = doc(this.firestore, 'posts', username ? username : '', 'posts', dateOfCreation);
    let userData = await this.userService.loadUserInfo(username)

    setDoc(docRef, {
      creator: username,
      creatorProfilePicture: userData?.profilePicture,
      imageUrl: imageUrl,
      createdAt: dateOfCreation,
      likes: [],
      comments: [],
      description: description,
    })
      .then(() => {
        this.router.navigate(['/app']);
      })
      .catch(error => console.log(error)
      );
  }
}
