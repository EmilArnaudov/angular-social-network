import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { Subscription } from 'rxjs';
import { PostsService } from '../posts/posts.service';
import { IComment } from '../shared/interfaces/comment.interface';
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

   get currentProfilePic() {
    return  localStorage.getItem('<PROFILEPIC>') as string;
   }

  postsSubscription!: Subscription
  posts = [] as any;
  postsHolder = [] as any;
  loadingPosts!: boolean;

  comment!: string;

  constructor(private postsService: PostsService, private renderer: Renderer2) { }


  //Set timeout is needed here because of a bug that didnt load main page right after logging in because localstorage setItem took too
  // long and username was needed before it had completed saving it
  ngOnInit(): void {
    
    this.loadingPosts = true;
    // clear array
    this.posts.splice(0, this.posts.length)
    this.postsHolder.splice(0, this.posts.length)
    //
    
    setTimeout(() => {

      this.posts.splice(0, this.posts.length)
      this.postsHolder.splice(0, this.posts.length)
      this.postsSubscription = this.postsService.loadMainContent(this.currentUsername)
      .subscribe(data => {
        this.loadingPosts = false;
        if (data) {
          let isUnique = this.checkUnique(data['createdAt'])
          if(isUnique) {
            data['hasUserLiked'] = data['likes'].includes(this.currentUsername)
            this.postsHolder.push(data);
            this.postsHolder = this.postsHolder.sort((a: Post,b: Post) => b.createdAt.localeCompare(a.createdAt));
            this.posts = this.postsHolder; 
          }
        }       
      })
    }, 1100);

  }


  likePost(postId: string, heart: HTMLElement, postsCountDiv: HTMLDivElement, post: HTMLDivElement) {
    
    let isLiked = post.id == 'true' ? true : false;

    this.postsService.likePost(postId, this.currentUsername, isLiked)
      .then(() => {

        this.renderer.addClass(heart, !isLiked ? 'liked' : 'not-liked');
        this.renderer.removeClass(heart, !isLiked ? 'not-liked' : 'liked');

        let newLikes = !isLiked ? Number(postsCountDiv.textContent?.split(' ')[0]) + 1 : Number(postsCountDiv.textContent?.split(' ')[0]) - 1;
        postsCountDiv.textContent = `${newLikes} likes`;    
        
        post.id = isLiked ? 'false' : 'true';

      })
  }


  showComments(commentsDiv: HTMLDivElement) {
    
    if (commentsDiv.id == 'hidden') {
      console.log('removing hidden');
      
      this.renderer.removeClass(commentsDiv, 'hidden');
      commentsDiv.id = '';
    } else {
      this.renderer.addClass(commentsDiv, 'hidden');
      commentsDiv.id = 'hidden';

     }
  }

  submitCommentHandler(event: any, commentInput: HTMLDivElement) {
    if (event.keyCode === 13) {
      let postId = commentInput.id;
      this.submitComment(postId);
    }
  }

  submitComment(postId: string) {
    const newComment: IComment = {
      owner: this.currentUsername,
      profilePic: this.currentProfilePic,
      content: this.comment,
      likes: [],
      replies: [],
      createdAt: String(Date.now())
    }
    
    this.postsService.submitComment(postId, newComment)
      .then(() => {
        this.comment = '';
        let post = this.posts.find((x: any) => x.createdAt == postId);
        post.comments.unshift(newComment);
      })

  }

  displayCommentTime(comment: IComment) {
      let time = Date.now();

  
      let timeDiff = time - Number(comment.createdAt);
  
      let seconds = Math.floor(timeDiff / 1000);
      if (seconds < 60) {
        return  `${seconds} seconds`

      }
  
      let minutes = Math.floor(seconds / 60);
      if (minutes < 60) {
        return  `${minutes} minutes`
      }
  
      let hours = Math.floor(minutes / 60);
      if (hours < 24) {
        return  `${hours} hours`
      }
  
      let days = Math.floor(hours / 24);
      if (days < 7) {
        return  `${days} days`
      }
  
      let weeks = Math.floor(days / 7)
      if (weeks < 4) {
        return  `${weeks} weeks`
      }
  
      let months = Math.floor(weeks / 4)
      if (months < 12) {
        return  `${months} months`
      }
  
      let years = Math.floor(months / 12);
      return  `${years} years`

  }


  ngOnDestroy(): void {
    this.postsSubscription.unsubscribe();
    this.posts.splice(0, this.posts.length);
    this.postsHolder.splice(0, this.posts.length)
  }

  private checkUnique(createdAt: string) {
    return !this.posts.find((post: Post) => post.createdAt  == createdAt);
  }


}
