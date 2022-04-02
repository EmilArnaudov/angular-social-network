import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserProfile } from 'firebase/auth';
import { DocumentData, DocumentSnapshot } from 'firebase/firestore';
import { Observable, ObservableInput, Subscription } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
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
  userPostsContent = [] as any;
  userData!: UserProfile | any;
  currentUserUsername = localStorage.getItem('<USERNAME>');

  constructor(private userService: UserService, private route: ActivatedRoute, private postService: PostsService) {
   }


   //Subcription is needed here because loading a profile from another profile didnt update the values.

   ngOnInit(): void {
    this.routeSubscription = this.route.params.subscribe(params => {
      if (params['username']) {
        //clear array 
        console.log(this.userPostsContent);
        
        this.userPostsContent.splice(0, this.userPostsContent.length);
        //

        this.userService.loadUserInfo(params['username'])
          .pipe(mergeMap((data: DocumentSnapshot): ObservableInput<any> => {
            this.userData = data.data();           
            return this.userData['posts'].length > 0 ? this.userData['posts'] : [];
          }), mergeMap((post: string): ObservableInput<DocumentData | undefined | Post> => this.postService.loadPostContent(post)))
          .subscribe(postContent => {
            if (postContent) {
              console.log(this.userPostsContent);
              if (postContent) {
                this.userPostsContent.unshift(postContent)
              }
              
            }
            
          }
          )
      }
    })
  }

  async followUser() {
    await this.userService.followUser(this.currentUserUsername, this.userData.username);
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
  }

}
