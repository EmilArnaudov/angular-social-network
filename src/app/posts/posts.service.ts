import { Injectable } from '@angular/core';
import { arrayUnion, doc, docSnapshots, DocumentData, DocumentSnapshot, Firestore, setDoc, updateDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { forkJoin, Observable, of } from 'rxjs';
import { concatMap, map, merge, mergeMap, switchMap, tap } from 'rxjs/operators';
import { Post } from '../shared/interfaces/post.interface';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(private firestore: Firestore, private userService: UserService, private router: Router) { }

  async createPost(imageUrl: string, description: string, username: string | null) {
    let dateOfCreation = Date.now().toString();
    const docRef = doc(this.firestore, 'posts', dateOfCreation);


    //insert post id in user's posts array
    const userRef = doc(this.firestore, 'users', username ? username : '');
    await updateDoc(userRef, {posts: arrayUnion(dateOfCreation)});

    this.userService.loadUserInfo(username)
      .subscribe(data => {
        let userData = data.data();
        setDoc(docRef, {
          creator: username,
          creatorProfilePicture: userData?.['profilePicture'],
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
      });
  }

  loadMainContent() {
    return this.userService.loadUserInfo(localStorage.getItem('<USERNAME>') ? localStorage.getItem('<USERNAME>') : '')
    .pipe(mergeMap((x): string => {
      let userData = x.data();
      let usersFollowing = userData?.['following'];
      
      return usersFollowing;
    }),
    mergeMap((user: string) => this.loadUserPosts(user)),
    mergeMap((postIds: string[]) => of(postIds).pipe(
      mergeMap(postIds => {return postIds}),
      mergeMap((postId) => this.loadPostContent(postId)))))

  }

  private loadUserPosts(username: string) {
    return this.userService.loadUserInfo(username)
      .pipe(map((data) => {
        let userData = data.data();
        return userData?.['posts']
      }))
  }

  private loadPostContent(postId: string): Observable<DocumentData | undefined> {
    const docRef = doc(this.firestore, 'posts', postId);

    return docSnapshots(docRef).pipe(map((x) => x.data()))
  }
}
