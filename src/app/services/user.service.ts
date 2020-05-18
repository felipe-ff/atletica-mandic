import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { User } from '../interfaces/user';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usersCollection: AngularFirestoreCollection<User>;

  constructor(private fireStore: AngularFirestore) {
    this.usersCollection = this.fireStore.collection<User>('Users');
  }

  getUsers() {
    return this.usersCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;

          return { id, ...data };
        });
      })
    );
  }

  addUser(user) {
    return this.usersCollection.add(user);
  }

  getUser(uid: string) {
    return this.fireStore.collection('/Users', ref => ref.where('uid', '==', uid)).valueChanges();
  }

  updateUser(id: string, user: User) {
    return this.usersCollection.doc<User>(id).update(user);
  }

  deleteUser(id: string) {
    return this.usersCollection.doc(id).delete();
  }
}