import { Component, OnInit, OnDestroy } from '@angular/core';
import { PostService } from 'src/app/service/post.service';
import { Post } from './../../interfaces/categories.interfact';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-all-post',
  templateUrl: './all-post.component.html',
  styleUrls: ['./all-post.component.scss'],
})
export class AllPostComponent implements OnInit, OnDestroy {
  allPosts: Post[] = [];

  private readonly destroy$ = new Subject<void>();

  constructor(private readonly postService: PostService) {}

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
    console.log('Delete post clicked:', postId);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
