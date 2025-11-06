import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Category } from '../interfaces/categories.interfact';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit {
  categoryName: string = '';
  isLoading: boolean = false;

  constructor(
    private firestore: AngularFirestore,
    private readonly toastr: ToastrService,
    private readonly translate: TranslateService,
  ) {}

  ngOnInit(): void {}

  async addCategory() {
    if (!this.categoryName.trim()) {
      this.toastr.warning(this.translate.instant('CATEGORY_EMPTY'));
      return;
    }

    const category: Category = {
      name: this.categoryName.trim(),
      createdAt: new Date(),
    };

    /*
      const subCategory: Category = {
        name: this.categoryName.trim() + ' hello',
        createdAt: new Date(),
      };

      const moreSubCategory: Category = {
        name: this.categoryName.trim() + ' helloworld',
        createdAt: new Date(),
      };
    */

    try {
      this.isLoading = true;

      // ✅ Add Category
      const docRef = await this.firestore
        .collection('categories')
        .add(category);
      console.log('✅ Category added: ', docRef.id);

      /*
        const subDocRef = await this.firestore
          .collection('categories')
          .doc(docRef.id)
          .collection('subcategories')
          .add(subCategory);

        or

        this.firestore
        .doc(`categories/${docRef.id}`)
        .collection('subcategories')
        .add(subCategory);

        --------

        const moreSubDocRef = await this.firestore
          .collection('categories')
          .doc(docRef.id)
          .collection('subcategories')
          .doc(subDocRef.id)
          .collection('moreSubCategories')
          .add(moreSubCategory);

        or

        this.firestore
        .doc(`categories/${docRef.id}/subcategories/${subDocRef.id}`)
        .collection('moreSubCategories')
        .add(moreSubCategory);

       */
      this.toastr.success(this.translate.instant('CATEGORY_ADDED'));
      this.categoryName = '';
    } catch (error) {
      console.error('❌ Error adding category:', error);
      this.toastr.error(this.translate.instant('CATEGORY_ERROR'));
    } finally {
      this.isLoading = false;
    }
  }
}
