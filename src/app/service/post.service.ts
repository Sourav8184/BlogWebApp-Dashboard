import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, lastValueFrom } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { Post } from '../interfaces/posts.interface';
import { Timestamp } from 'firebase/firestore';

// This service handles post creation and image uploads
@Injectable({
  providedIn: 'root',
})
export class PostService {
  constructor(
    private readonly storage: AngularFireStorage,
    private readonly firestore: AngularFirestore,
  ) {}

  uploadImage(file: File): Observable<string> {
    const filePath = `postImg/${Date.now()}_${file.name}`;
    const fileRef = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, file);
    return new Observable<string>((observer) => {
      uploadTask
        .snapshotChanges()
        .pipe(
          finalize(() => {
            fileRef.getDownloadURL().subscribe({
              next: (url: string) => {
                observer.next(url);
                observer.complete();
              },
              error: (err) => observer.error(err),
            });
          }),
        )
        .subscribe();
    });
  }

  async deleteImageByUrl(imageUrl: string): Promise<void> {
    if (!imageUrl) return;
    await lastValueFrom(this.storage.refFromURL(imageUrl).delete());
  }

  async createPost(postData: Post): Promise<void> {
    await this.firestore.collection<Post>('posts').add(postData);
  }

  getPosts(): Observable<Post[]> {
    return this.firestore
      .collection<Post>('posts')
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((doc) => {
            const id = doc.payload.doc.id;
            const data = doc.payload.doc.data() as Post;
            if (data.createdAt instanceof Timestamp) {
              data.createdAt = data.createdAt.toDate();
            }
            return { id, ...data };
          }),
        ),
      );
  }

  async deletePost(postId: string, imagePath?: string): Promise<void> {
    await this.firestore.collection<Post>('posts').doc(postId).delete();

    if (imagePath) {
      await lastValueFrom(this.storage.refFromURL(imagePath).delete());
    }
  }

  async updatePost(id: string, updatedData: Partial<Post>): Promise<void> {
    await this.firestore.collection<Post>('posts').doc(id).update(updatedData);
  }

  getPostById(id: string): Observable<Post | undefined> {
    return this.firestore
      .collection<Post>('posts')
      .doc(id)
      .snapshotChanges()
      .pipe(
        map((doc) => {
          const data = doc.payload.data();
          if (!data) return undefined;

          if (data.createdAt instanceof Timestamp) {
            data.createdAt = data.createdAt.toDate();
          }

          return { id: doc.payload.id, ...data };
        }),
      );
  }
}
