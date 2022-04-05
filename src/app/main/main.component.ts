import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { Subscription } from 'rxjs';
import { PostsService } from '../posts/posts.service';
import { Post } from '../shared/interfaces/post.interface';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {

  
  get currentUsername() {
    return  localStorage.getItem('<USERNAME>') as string;
   }

  postsSubscription!: Subscription
  posts = [] as any;
  loadingPosts!: boolean;

  constructor(private postsService: PostsService, private renderer: Renderer2) { }


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
            data['hasUserLiked'] = data['likes'].includes(this.currentUsername)
            this.posts.push(data);
            console.log(data);
            
          }

        }
        

      })
    }, 1100);

  }


  likePost(postId: string, heart: HTMLElement, postsCountDiv: HTMLDivElement) {
    this.postsService.likePost(postId, this.currentUsername)
      .then(() => {
        this.renderer.addClass(heart, 'liked');
        this.renderer.removeClass(heart, 'not-liked');

        let newLikes = Number(postsCountDiv.textContent?.split(' ')[0]) + 1;
        postsCountDiv.textContent = `${newLikes} likes`;
      })
    
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
