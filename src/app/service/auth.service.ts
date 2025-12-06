import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private afAuth: AngularFireAuth) {}

  async login(email: string, password: string) {
    return await this.afAuth.signInWithEmailAndPassword(email, password);
  }

  async logout(): Promise<void> {
    await this.afAuth.signOut();
  }

  getUser() {
    return this.afAuth.authState;
  }
}
