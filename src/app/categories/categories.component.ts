import { Component, OnInit } from '@angular/core';
import { Category } from '../interfaces/categories.interfact';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { CategoriesService } from '../service/categories.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit {
  categoryName: string = '';
  isLoading: boolean = false;
  categories: Category[] = [];

  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly toastr: ToastrService,
    private readonly translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  async addCategory() {
    if (!this.categoryName.trim()) {
      this.toastr.warning(this.translate.instant('CATEGORY_EMPTY'));
      return;
    }

    const category: Category = {
      name: this.categoryName.trim(),
      createdAt: new Date(),
    };

    try {
      this.isLoading = true;
      await this.categoriesService.addCategory(category);
      this.toastr.success(this.translate.instant('CATEGORY_ADDED'));
      this.categoryName = '';
    } catch (error) {
      this.toastr.error(this.translate.instant('CATEGORY_ERROR'));
    }
  }

  loadCategories() {
    this.categoriesService.getCategories().subscribe((data) => {
      this.categories = data;
      this.isLoading = false;
    });
  }
}
