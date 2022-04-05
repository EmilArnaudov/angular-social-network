import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { DocumentData } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';
import { PostsService } from '../posts/posts.service';
import { Post } from '../shared/interfaces/post.interface';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {

  postsSubscription!: Subscription
  posts = [] as any;
  loadingPosts!: boolean;

  constructor(private postsService: PostsService) { }


  //Set timeout is needed here because of a bug that didnt load main page right after logging in because localstorage setItem took too
  // long and username was needed before it had completed saving it
  ngOnInit(): void {
    
    this.loadingPosts = true;
    // clear array
    this.posts.splice(0, this.posts.length)
    //
    
    setTimeout(() => {

      this.posts.splice(0, this.posts.length)
      this.postsSubscription = this.postsService.loadMainContent()
      .subscribe(data => {
        this.loadingPosts = false;
        if (data) {
          let isUnique = this.checkUnique(data['createdAt'])
          if(isUnique) {
            this.posts.push(data);
          }

        }
        

      })
    }, 1100);

  }

  ngOnDestroy(): void {
    console.log('unsubscribing');
    this.postsSubscription.unsubscribe();
    this.posts.splice(0, this.posts.length)
  }

  private checkUnique(createdAt: string) {
    return !this.posts.find((post: Post) => post.createdAt  == createdAt);
  }

}
