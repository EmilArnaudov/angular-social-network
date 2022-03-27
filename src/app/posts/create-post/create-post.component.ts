import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ImageUploadService } from 'src/app/image-upload.service';
import { PostsServiceService } from '../posts.service';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss']
})
export class CreatePostComponent implements OnInit {

  @ViewChild('form') form!: NgForm

  imageUrl: string = '';
  imageUploaded = false;
  username = localStorage.getItem('<USERNAME>');

  constructor(private postsService: PostsServiceService, private imageUploadService: ImageUploadService) { }

  ngOnInit(): void {
  }

  uploadImageToStorage(event: any) {
    
    let time = Date.now();
    
    const image = event.target.files[0];
    const path = `images/posts/${this.username}/${time}`;
    
    this.imageUploadService.uploadImage(image, path)
      .subscribe((image) => {
        this.imageUrl = image;
        this.imageUploaded = true;
      }
      )

  }

  createPost() {
    this.form.value.image = this.imageUrl;
    
    console.log(this.form.value);
    
    
  }

}
