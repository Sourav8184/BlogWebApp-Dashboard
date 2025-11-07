import { Category } from './../interfaces/categories.interfact';
import { Component, OnInit } from '@angular/core';
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
  editingCategory: Category | null = null;

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

    this.isLoading = true;

    try {
      if (this.editingCategory) {
        // ✅ UPDATE MODE
        await this.categoriesService.editCategory(this.editingCategory.id!, {
          name: this.categoryName.trim(),
        });

        this.toastr.success(this.translate.instant('CATEGORY_UPDATED'));
        this.editingCategory = null;
      } else {
        // ✅ ADD MODE
        const category: Category = {
          name: this.categoryName.trim(),
          createdAt: new Date(),
        };
        await this.categoriesService.addCategory(category);
        this.toastr.success(this.translate.instant('CATEGORY_ADDED'));
      }

      this.categoryName = '';
    } catch (error) {
      this.toastr.error(this.translate.instant('CATEGORY_ERROR'));
    } finally {
      this.isLoading = false;
    }
  }

  loadCategories() {
    this.categoriesService.getCategories().subscribe((data) => {
      this.categories = data;
      this.isLoading = false;
    });
  }

  async deleteCategory(category: Category) {
    this.isLoading = true;

    try {
      await this.categoriesService.deleteCategory(category.id!);
      this.toastr.success(this.translate.instant('CATEGORY_DELETED'));
    } catch (error) {
      this.toastr.error(this.translate.instant('CATEGORY_ERROR'));
    } finally {
      this.isLoading = false;
    }
  }

  editCategory(cat: Category) {
    this.editingCategory = cat;
    this.categoryName = cat.name;
  }

  cancelEdit() {
    this.editingCategory = null;
    this.categoryName = '';
  }
}
