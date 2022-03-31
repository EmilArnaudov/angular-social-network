import { Component, OnInit } from '@angular/core';
import { DocumentData } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';
import { PostsService } from '../posts/posts.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent  {

  postsSubscription!: Subscription
  posts = [] as any;

  constructor(private postsService: PostsService) { }

  ngOnInit(): void {
    this.postsSubscription = this.postsService.loadMainContent()
      .subscribe(data => {
        console.log(data);
        
        this.posts.push(data);
        
      })
  }

}
