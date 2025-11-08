import { Component, OnInit } from '@angular/core';
import { DEFAULT_POST_IMAGE } from 'src/app/constants/image-paths';
import { Category } from 'src/app/interfaces/categories.interfact';
import { CategoriesService } from 'src/app/service/categories.service';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.scss'],
})
export class NewPostComponent implements OnInit {
  permalink: string = '';
  imgSrc: string = DEFAULT_POST_IMAGE;
  categories: Category[] = [];
  selectedCategory: string = '';
  editorContent: string = '';

  constructor(private readonly categoriesService: CategoriesService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  onTitleChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const title = inputElement.value;
    this.permalink = title.trim().toLowerCase().replace(/\s+/g, '-');
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

  loadCategories() {
    this.categoriesService.getCategories().subscribe((data) => {
      this.categories = data;
    });
  }
}
