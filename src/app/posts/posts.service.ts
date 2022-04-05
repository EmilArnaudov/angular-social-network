import { Injectable } from '@angular/core';
import { arrayUnion, doc, docSnapshots, DocumentData, Firestore, increment, setDoc, updateDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { arrayRemove, FieldValue } from 'firebase/firestore';
import { Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(private firestore: Firestore, private userService: UserService, private router: Router) { }


  likePost(postId: string, username: string, isLiked: boolean) {
    const postRef = doc(this.firestore, 'posts', postId);
    const userRef = doc(this.firestore, 'users', username);
    if (!isLiked) {
      return Promise.all([updateDoc(postRef, {likes: arrayUnion(username)}), updateDoc(userRef, {postsLiked: arrayUnion(postId)})])
    }

    return Promise.all([updateDoc(postRef, {likes: arrayRemove(username)}), updateDoc(userRef, {postsLiked: arrayRemove(postId)})])

  }

  async createPost(imageUrl: string, description: string, username: string | null) {
    let dateOfCreation = Date.now().toString();
    const docRef = doc(this.firestore, 'posts', dateOfCreation);
    const incrementOne = increment(1)

    //insert post id in user's posts array
    const userRef = doc(this.firestore, 'users', username ? username : '');
    await updateDoc(userRef, {posts: arrayUnion(dateOfCreation), postsCount: incrementOne});

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
    return this.userService.loadUserInfo(localStorage.getItem('<USERNAME>') as string)
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

  loadUserPosts(username: string) {
    return this.userService.loadUserInfo(username)
      .pipe(map((data) => {
        let userData = data.data();
        return userData?.['posts']
      }))
  }

  loadPostContent(postId: string): Observable<DocumentData | undefined> {
    const docRef = doc(this.firestore, 'posts', postId);

    return docSnapshots(docRef).pipe(map((x) => {
      return postId == 'subsure' ? x.data() : {...x.data(), _id: postId}}
      ))
  }


}
