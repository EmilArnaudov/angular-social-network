import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserProfile } from 'firebase/auth';
import { DocumentData, DocumentSnapshot } from 'firebase/firestore';
import { ObservableInput, Subscription } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { PostsService } from 'src/app/posts/posts.service';
import { Post } from 'src/app/shared/interfaces/post.interface';
import { UserService } from '../user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  routeSubscription!: Subscription
  userInfoSubscription!: Subscription

  userPostsContent = [] as any;
  userData!: UserProfile | any;
  currentUserUsername = localStorage.getItem('<USERNAME>');

  constructor(private userService: UserService, private route: ActivatedRoute, private postService: PostsService) {
   }


   //Subcription is needed here because loading a profile from another profile didnt update the values.

   ngOnInit(): void {
     console.log('ON INIT: ', this.userPostsContent);
     
    this.routeSubscription = this.route.params.subscribe(params => {
      if (params['username']) {
        //clear array
        // console.log('ROUTE CHANGE BEFORE CLEAR: ', this.userPostsContent);
        
        this.userPostsContent.splice(0, this.userPostsContent.length);
        //

        // console.log('ROUTE CHANGE AFTER CLEAR: ', this.userPostsContent);

        this.userInfoSubscription = this.userService.loadUserInfo(params['username'])
          .pipe(mergeMap((data: DocumentSnapshot): ObservableInput<any> => {
            this.userData = data.data();
            
            console.log('USER INFO REQUIORED/EDITED: USER DATA: ', this.userData['posts']);

            return this.userData['posts'].length > 0 ? this.userData['posts'] : [];
          }), mergeMap((post: string): ObservableInput<DocumentData | undefined | Post> => this.postService.loadPostContent(post)))
          .subscribe(postContent => {
              // console.log('POST CONTENT: ', postContent);
              
              console.log('IN SUBSSCRIBE BEFORE PUSH: ', this.userPostsContent);
              
              // console.log(this.userPostsContent);
              if (postContent) {
                let isUnique = this.checkUnique(postContent.createdAt);
                console.log('IS UNIQUE: ', isUnique);
                
                if(isUnique) {
                  this.userPostsContent.unshift(postContent)
                }


                // console.log('IN SUBSSCRIBE AFTER PUSH: ', this.userPostsContent);
                // console.log('POST CONTENT FROM THE ARRAY: ', this.userPostsContent[0]);
                
              }
          }
          )
      }
    })
  }

  async followUser() {
    console.log('IN FOLLOW USER BEFORE FOLLOW: ', this.userPostsContent);
    
    await this.userService.followUser(this.currentUserUsername, this.userData.username);
    this.userPostsContent.splice(0, this.userPostsContent.length)
    console.log('IN FOLLOW USER AFTER FOLLOW: ', this.userPostsContent);
  }


  private checkUnique(createdAt: string) {
    return !this.userPostsContent.find((post: Post) => post.createdAt  == createdAt);
  }

  ngOnDestroy(): void {
    console.log('unsubscribing');
    this.userInfoSubscription.unsubscribe();
    this.routeSubscription.unsubscribe();
    this.userPostsContent.splice(0, this.userPostsContent.length);
  }

}
