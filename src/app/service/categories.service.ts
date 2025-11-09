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

  addCategory(category: Category) {
    return this.firestore.collection('categories').add(category);
  }

  getCategories(): Observable<Category[]> {
    return this.firestore
      .collection('categories')
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((doc) => {
            const id = doc.payload.doc.id;
            const data = doc.payload.doc.data() as Category;
            if (data.createdAt instanceof Timestamp) {
              data.createdAt = data.createdAt.toDate();
            }
            return { id, ...data };
          }),
        ),
      );
  }

  editCategory(id: string, updatedData: Partial<Category>) {
    return this.firestore.doc(`categories/${id}`).update(updatedData);
  }

  deleteCategory(id: string) {
    return this.firestore.doc(`categories/${id}`).delete();
  }
}
