import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { finalize, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Post } from '../interfaces/categories.interfact';

// This service handles post creation and image uploads
@Injectable({
  providedIn: 'root',
})
export class PostService {
  constructor(
    private readonly storage: AngularFireStorage,
    private readonly toastr: ToastrService,
    private readonly translate: TranslateService,
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
                this.toastr.success(this.translate.instant('IMAGE_ADDED'));
                observer.next(url);
                observer.complete();
              },
              error: () => {
                this.toastr.error(this.translate.instant('IMAGE_ERROR'));
                observer.error('Failed to get download URL');
              },
            });
          }),
        )
        .subscribe();
    });
  }

  async createPost(postData: Post) {
    return await this.firestore
      .collection<Post>('posts')
      .add(postData)
      .then(() => {
        this.toastr.success(this.translate.instant('POST_ADDED'));
      })
      .catch(() => {
        this.toastr.error(this.translate.instant('POST_ERROR'));
      });
  }

  getPosts(): Observable<Post[]> {
    return this.firestore
      .collection<Post>('posts')
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((doc) => {
            const id = doc.payload.doc.id;
            const data = doc.payload.doc.data();
            return { id, ...data };
          }),
        ),
      );
  }
}
