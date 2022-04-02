import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { DocumentData } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';
import { PostsService } from '../posts/posts.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  postsSubscription!: Subscription
  posts = [] as any;
  loadingPosts = true;

  constructor(private postsService: PostsService) { }


  //Set timeout is needed here because of a bug that didnt load main page right after logging in because localstorage setItem took too
  // long and username was needed before it had completed saving it
  ngOnInit(): void {
    setTimeout(() => {
      // clear array
      this.posts.splice(0, this.posts.length)
      //
      this.postsService.loadMainContent()
      .subscribe(data => {
        this.loadingPosts = false;
        this.posts.unshift(data);
      })
    }, 150);

  }

}
