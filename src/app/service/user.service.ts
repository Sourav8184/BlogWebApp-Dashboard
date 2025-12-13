import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Timestamp } from 'firebase/firestore';
import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private readonly firestore: AngularFirestore) {}

  /** Get all users */
  getAllUsers(): Observable<User[]> {
    return this.firestore
      .collection<User>('subscriptions', (ref) =>
        ref.orderBy('createdAt', 'desc'),
      )
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((doc) => {
            const id = doc.payload.doc.id;
            const data = doc.payload.doc.data() as User;

            if (data.createdAt instanceof Timestamp) {
              data.createdAt = data.createdAt.toDate();
            }

            return { id, ...data };
          }),
        ),
      );
  }

  deleteUser(id: string) {
    return this.firestore.collection('subscriptions').doc(id).delete();
  }
}
