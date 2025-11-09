import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DEFAULT_POST_IMAGE } from 'src/app/constants/image-paths';
import { Category, Post } from 'src/app/interfaces/categories.interfact';
import { CategoriesService } from 'src/app/service/categories.service';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.scss'],
})
export class NewPostComponent implements OnInit {
  postForm!: FormGroup;
  imgSrc: string = DEFAULT_POST_IMAGE;
  categories: Category[] = [];

  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.postForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      permalink: [{ value: '', disabled: true }],
      excerpt: ['', [Validators.required, Validators.maxLength(200)]],
      category: ['', Validators.required],
      content: ['', Validators.required],
      imgPreview: ['', Validators.required],
    });

    this.loadCategories();
  }

  onTitleChange(event: Event): void {
    const title = (event.target as HTMLInputElement).value;
    const permalink = title.trim().toLowerCase().replace(/\s+/g, '-');
    this.postForm.patchValue({ permalink });
  }

  showPreview(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.imgSrc = e.target?.result as string;
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  loadCategories(): void {
    this.categoriesService.getCategories().subscribe((data) => {
      this.categories = data;
    });
  }

  submitPost(): void {
    if (this.postForm.invalid) {
      this.postForm.markAllAsTouched();
      return;
    }

    const postData: Post = {
      ...this.postForm.getRawValue(),
      imagePath: '',
      isFeatured: false,
      views: 0,
      status: 'new',
      createdAt: new Date(),
    };

    // reset UI
    this.postForm.reset();
    this.imgSrc = DEFAULT_POST_IMAGE;
  }
}
