import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from '../interfaces/user';
import { NotificationService } from './notification.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private fireAuth: AngularFireAuth, private notificationService: NotificationService, private userService: UserService) { }

  login(user: User) {
    return this.fireAuth.signInWithEmailAndPassword(user.email, user.password);
  }

  register(user: User) {
    return this.fireAuth.createUserWithEmailAndPassword(user.email, user.password);
  }

  sendConfirmationEmail() {
    this.fireAuth.currentUser.then(user => user.sendEmailVerification());
  }

  getCurrentUser() {
    return this.fireAuth.currentUser;
  }

  async logout() {
    try {
      await this.notificationService.unsubscribeFromAllTopics(this.userService.loggedUser.notificationToken);
    } catch(e) {
      console.log(e);
    }
    return this.fireAuth.signOut();
  }

  sendRedefinePasswordEmail(email) {
    return this.fireAuth.sendPasswordResetEmail(email);
  }

  getAuth(): any {
    return this.fireAuth;
  }
}