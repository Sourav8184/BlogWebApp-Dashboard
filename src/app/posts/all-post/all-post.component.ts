import { Component, OnInit, OnDestroy } from '@angular/core';
import { PostService } from 'src/app/service/post.service';
import { Post } from './../../interfaces/posts.interface';
import { Subject, takeUntil } from 'rxjs';
import { SweetAlertService } from 'src/app/service/sweet-alert.service.ts.service';

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
  ) {}

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.postService
      .getPosts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (posts) => {
          this.allPosts = posts || [];
        },
        error: (err) => {
          console.error('Error fetching posts:', err);
        },
      });
  }

  onDeletePost(postId: string): void {
    this.swalService.confirmDelete().then((result) => {
      if (result.isConfirmed) {
        this.postService
          .deletePost(postId)
          .then(() => {
            this.allPosts = this.allPosts.filter((post) => post.id !== postId);
          })
          .catch((error) => {
            console.error('Error while deleting post:', error);
          });
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
