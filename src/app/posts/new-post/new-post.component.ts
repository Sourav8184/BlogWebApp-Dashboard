import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DEFAULT_POST_IMAGE } from 'src/app/constants/image-paths';
import { Category } from 'src/app/interfaces/categories.interfact';
import { Post } from 'src/app/interfaces/posts.interface';
import { CategoriesService } from 'src/app/service/categories.service';
import { PostService } from 'src/app/service/post.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.scss'],
})
export class NewPostComponent implements OnInit, OnDestroy {
  postForm!: FormGroup;
  imgSrc: string = DEFAULT_POST_IMAGE;
  selectedImageFile: File | null = null;
  categories: Category[] = [];

  isEditMode = false;
  postId: string | null = null;
  private oldImagePath: string | null = null;
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly fb: FormBuilder,
    private readonly postService: PostService,
    private readonly toastr: ToastrService,
    private readonly translate: TranslateService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    // ✅ Initialize form
    this.postForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      permalink: [{ value: '', disabled: true }],
      excerpt: ['', [Validators.required, Validators.maxLength(200)]],
      category: ['', Validators.required],
      content: ['', Validators.required],
      imgPreview: [null, Validators.required],
    });

    this.loadCategories();

    // ✅ Detect Edit Mode
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.postId = id;
      this.loadPostForEdit(id);
    }
  }

  /** ✅ Update permalink when typing title */
  onTitleChange(event: Event): void {
    const title = (event.target as HTMLInputElement).value;
    const permalink = title.trim().toLowerCase().replace(/\s+/g, '-');
    this.postForm.patchValue({ permalink });
  }

  /** ✅ Preview selected image */
  showPreview(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedImageFile = input.files[0]; // ✅ store file

      const reader = new FileReader();
      reader.onload = (e) => {
        this.imgSrc = e.target?.result as string;
      };
      reader.readAsDataURL(this.selectedImageFile);
    }
  }

  /** ✅ Load categories for dropdown */
  loadCategories(): void {
    this.categoriesService.getCategories().subscribe((data) => {
      this.categories = data;
    });
  }

  /** ✅ Load post data when editing */
  loadPostForEdit(id: string): void {
    this.postService
      .getPostById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((post) => {
        if (!post) return;

        // ✅ Save old image URL for later deletion
        this.oldImagePath = post.imagePath ?? null;

        this.postForm.patchValue({
          title: post.title,
          permalink: post.permalink,
          excerpt: post.excerpt,
          content: post.content,
        });

        this.imgSrc = post.imagePath || DEFAULT_POST_IMAGE;

        const categoryObj = this.categories.find(
          (c) => c.name === post.category.name,
        );

        this.postForm.patchValue({ category: categoryObj });

        // ✅ Remove image required validator in edit mode
        this.postForm.get('imgPreview')?.clearValidators();
        this.postForm.get('imgPreview')?.updateValueAndValidity();
      });
  }

  /** ✅ Main submit handler */
  submitPost(): void {
    this.postForm.markAllAsTouched();
    const { imgPreview, ...formValues } = this.postForm.getRawValue();

    // ✅ UPDATE POST
    if (this.isEditMode && this.postId) {
      // ✅ If new image selected → upload then update
      if (this.selectedImageFile) {
        this.postService.uploadImage(this.selectedImageFile).subscribe({
          next: async (newImageURL) => {
            const updatedData: Partial<Post> = {
              ...formValues,
              imagePath: newImageURL,
            };

            try {
              await this.postService.updatePost(this.postId!, updatedData);

              // ✅ Delete old image ONLY if exists and different
              if (
                this.oldImagePath &&
                this.oldImagePath !== newImageURL &&
                !this.oldImagePath.includes(DEFAULT_POST_IMAGE)
              ) {
                await this.postService.deleteImageByUrl(this.oldImagePath);
              }

              this.toastr.success(this.translate.instant('POST_UPDATED'));
              this.router.navigate(['/posts']);
            } catch {
              this.toastr.error(this.translate.instant('POST_ERROR'));
            }
          },
          error: () => this.toastr.error(this.translate.instant('IMAGE_ERROR')),
        });
      }

      // ✅ No new image → update simple fields only
      else {
        const updatedData: Partial<Post> = {
          ...formValues,
          imagePath: this.oldImagePath,
        };

        (async () => {
          try {
            await this.postService.updatePost(this.postId!, updatedData);
            this.toastr.success(this.translate.instant('POST_UPDATED'));
            this.router.navigate(['/posts']);
          } catch {
            this.toastr.error(this.translate.instant('POST_ERROR'));
          }
        })();
      }

      return;
    }

    // ✅ CREATE NEW POST
    if (!this.selectedImageFile || this.postForm.invalid) return;

    this.postService.uploadImage(this.selectedImageFile).subscribe({
      next: async (imageURL) => {
        const postData: Post = {
          ...formValues,
          imagePath: imageURL,
          isFeatured: false,
          views: 0,
          status: 'new',
          createdAt: new Date(),
        };

        try {
          await this.postService.createPost(postData);
          this.toastr.success(this.translate.instant('POST_ADDED'));
          this.postForm.reset();
          this.imgSrc = DEFAULT_POST_IMAGE;
        } catch {
          this.toastr.error(this.translate.instant('POST_ERROR'));
        }
      },
      error: () => this.toastr.error(this.translate.instant('IMAGE_ERROR')),
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
