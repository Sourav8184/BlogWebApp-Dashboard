import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Category } from '../interfaces/categories.interfact';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  constructor(private firestore: AngularFirestore) {}

  addCategory(category: Category) {
    return this.firestore.collection('categories').add(category);
  }
}
