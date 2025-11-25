import { Component, OnInit, OnDestroy } from '@angular/core';
import { PostService } from 'src/app/service/post.service';
import { Post } from './../../interfaces/posts.interface';
import { Subject, takeUntil } from 'rxjs';
import { SweetAlertService } from 'src/app/service/sweet-alert.service.ts.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-all-post',
  templateUrl: './all-post.component.html',
  styleUrls: ['./all-post.component.scss'],
})
export class AllPostComponent implements OnInit, OnDestroy {
  allPosts: Post[] = [];

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly postService: PostService,
    private readonly swalService: SweetAlertService,
    private readonly toastr: ToastrService,
    private readonly translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.postService
      .getPosts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (posts: Post[]) => (this.allPosts = posts),
        error: () =>
          this.toastr.error(this.translate.instant('FETCH_POSTS_ERROR')),
      });
  }

  onDeletePost(postId: string, imgPath: string): void {
    this.swalService.confirmDelete().then(async (result) => {
      if (!result.isConfirmed) return;
      try {
        await this.postService.deletePost(postId, imgPath);
        this.toastr.success(this.translate.instant('POST_DELETED'));
      } catch {
        this.toastr.error(this.translate.instant('POST_DELETE_ERROR'));
      }
    });
  }

  async onFeaturePost(post: Post) {
    try {
      await this.postService.updatePost(post.id!, { isFeatured: true });
      post.isFeatured = true;
      this.toastr.success(this.translate.instant('POST_FEATURED'));
    } catch {
      this.toastr.error(this.translate.instant('FEATURE_ERROR'));
    }
  }

  async onRemoveFeatured(post: Post) {
    try {
      await this.postService.updatePost(post.id!, { isFeatured: false });
      post.isFeatured = false;
      this.toastr.success(this.translate.instant('FEATURE_REMOVED'));
    } catch {
      this.toastr.error(this.translate.instant('FEATURE_REMOVE_ERROR'));
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
