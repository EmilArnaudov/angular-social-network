import { Component, OnInit } from '@angular/core';
import { PostsService } from '../posts/posts.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent  {

  posts$ = this.postsService.loadMainContent();

  constructor(private postsService: PostsService) { }

  ngOnInit(): void {
  }

  // ngOnInit(): void {
  //   this.postsService.findMainContentPosts()
  //     .subscribe(data => {
  //       data.forEach(subscription => {
  //         subscription.subscribe(newData => console.log(newData)
  //         )
  //       })
  //     })
  // }

}
