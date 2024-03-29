import { Component, OnInit } from '@angular/core';
import { PostsService } from 'src/app/services/posts.service';

@Component({
  selector: 'app-all-posts',
  templateUrl: './all-posts.component.html',
  styleUrls: ['./all-posts.component.css']
})
export class AllPostsComponent implements OnInit {

  constructor(private postService: PostsService) { }

  postArr = []

  ngOnInit(): void {
    this.postService.loadData().subscribe(val => {
      this.postArr = val
    })
  }

  onDelete(id, postImgPath) {
    this.postService.deleteImage(id, postImgPath);
  }

  onFeatured(id, status) {
    const featuredData = {
      isFeatured: status
    }
    this.postService.markFeatured(id, featuredData);
  }
}
