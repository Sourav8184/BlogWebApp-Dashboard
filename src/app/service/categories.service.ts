import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Category } from '../interfaces/categories.interfact';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Timestamp } from 'firebase/firestore';

//This service handles CRUD operations for categories in Firestore Database
@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  constructor(private firestore: AngularFirestore) {}

  async addCategory(category: Category): Promise<void> {
    await this.firestore.collection('categories').add(category);
  }

  getCategories(): Observable<Category[]> {
    return this.firestore
      .collection<Category>('categories')
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((doc) => {
            const id = doc.payload.doc.id;
            const data = doc.payload.doc.data() as Category;
            // Convert Firestore Timestamp → JavaScript Date
            if (data.createdAt instanceof Timestamp) {
              data.createdAt = data.createdAt.toDate();
            }
            return { id, ...data };
          }),
        ),
      );
  }

  async editCategory(
    id: string,
    updatedData: Partial<Category>,
  ): Promise<void> {
    await this.firestore.doc<Category>(`categories/${id}`).update(updatedData);
  }

  async deleteCategory(id: string): Promise<void> {
    await this.firestore.doc<Category>(`categories/${id}`).delete();
  }
}
