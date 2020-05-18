import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private fireAuth: AngularFireAuth) { }

  login(user: User) {
    return this.fireAuth.signInWithEmailAndPassword(user.email, user.password);
  }

  register(user: User) {
    return this.fireAuth.createUserWithEmailAndPassword(user.email, user.password);
  }

  logout() {
    return this.fireAuth.signOut();
  }

  getAuth(): any {
    return this.fireAuth;
  }
}