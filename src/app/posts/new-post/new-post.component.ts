import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Post } from 'src/app/models/post';
import { CategoriesService } from 'src/app/services/categories.service';
import { PostsService } from 'src/app/services/posts.service';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.css']
})
export class NewPostComponent implements OnInit {

  permalink: string = ""
  imgSrc: any = ""
  selectedImg: any
  categories = []
  post: any
  postForm: FormGroup
  formStatus: string = "Add New"
  queryId: string

  constructor(
    private categoryServie: CategoriesService,
    private fb: FormBuilder,
    private postService: PostsService,
    private route: ActivatedRoute) {

    this.route.queryParams.subscribe(val => {
      this.queryId = val['id']

      if (this.queryId) {
        this.postService.loadOneData(val['id']).subscribe(post => {
          this.post = post
          this.postForm = this.fb.group({
            title: [this.post.title, [Validators.required, Validators.minLength(10)]],
            permalink: [this.post.permalink, Validators.required],
            excerpt: [this.post.excerpt, [Validators.required, Validators.minLength(10)]],
            postImg: ['', Validators.required],
            category: [`${this.post.category.categoryId}-${this.post.category.category}`, Validators.required],
            content: [this.post.content, Validators.required]
          })
          this.imgSrc = this.post.postImgPath
          this.formStatus = "Edit"
        })
      }
      else {
        this.postForm = this.fb.group({
          title: ['', [Validators.required, Validators.minLength(10)]],
          permalink: ['', Validators.required],
          excerpt: ['', [Validators.required, Validators.minLength(10)]],
          postImg: ['', Validators.required],
          category: ['', Validators.required],
          content: ['', Validators.required]
        })
      }
    })
  }

  ngOnInit(): void {
    this.categoryServie.loadData().subscribe(val => {
      this.categories = val;
    })
  }

  get fc() {
    return this.postForm.controls;
  }

  onTitleChanged($event) {
    const title = $event.target.value
    this.permalink = title.replace(/\s/g, '-');
  }

  showPreview($event) {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.imgSrc = e.target.result
    }

    reader.readAsDataURL($event.target.files[0])
    this.selectedImg = $event.target.files[0]
  }

  async onSubmit() {
    let splitted = this.postForm.value.category.split('-');
    const url = await this.postService.uploadImage(this.selectedImg);
    const postData: Post = {
      title: this.postForm.value.title,
      permalink: this.postForm.value.permalink,
      category: {
        categoryId: splitted[0],
        category: splitted[1]
      },
      postImgPath: url,
      excerpt: this.postForm.value.excerpt,
      content: this.postForm.value.content,
      isFeatured: false,
      views: 0,
      status: '',
      createdAt: new Date()
    }

    if (this.formStatus == "Edit") {
      this.postService.updateData(this.queryId, postData);
    }
    else if (this.formStatus == "Add New") {
      this.postService.saveData(postData);
    }

    this.postForm.reset();
    this.imgSrc = "";
  }
}
