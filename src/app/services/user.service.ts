import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { User } from '../interfaces/user';
import { map } from 'rxjs/operators';
import { Role } from '../enums/role.enum';
import { Observable, empty, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  loggedUser: User; //guardar no localstorage
  forceBackToLogin = false;
  notificationSeenCounter = 0;

  constructor(private fireStore: AngularFirestore) { }

  getUsersBySegment(segment) {
    let query: any;
    if (segment === 'all') {
      query = this.fireStore.collection("Users", ref => ref.orderBy('name'));
    } else if (segment === 'verified') {
      query = this.fireStore.collection("Users", ref => ref.where('verified', '==', true));
    } else if (segment === 'student') {
      query = this.fireStore.collection("Users", ref => ref.where('role', '==', '1'));
    } else if (segment === 'member') {
      query = this.fireStore.collection("Users", ref => ref.where('role', '==', '2'));
    } else if (segment === 'director') {
      query = this.fireStore.collection("Users", ref => ref.where('teaches', '>', ''));
    } else if (segment === 'admin') {
      query = this.fireStore.collection("Users", ref => ref.where('role', '==', '4'));
    } else {
      query = this.fireStore.collection("Users", ref => ref.where('verified', '==', false));
    };

    return query.valueChanges().pipe(
      map((users: any) => {
        return users.sort( (a,b) => a.name > b.name ? 1 : -1);
      })
    );
  }

  getUsersByName(name) {
    return this.fireStore.collection("Users", ref => ref.orderBy(name).startAt(name).endAt('name' + '\uf8ff')).get().pipe(
      map(querySnapshot => {
        const list = [];
        querySnapshot.forEach(function(doc) {
          const id = doc.id;
          list.push({ id, ...doc.data() });
        });
        return list;
      })
    );
  }

  getUsersBySportCategory(sport) {
    if (!sport) {
      return of([]);
    }

    return this.fireStore.collection("Users", ref => ref.where('categories', 'array-contains', sport)).valueChanges().pipe(
      map(users => {
        return users;
      })
    );
  }

  getUsersByTeachesCategory(sport) {
    return this.fireStore.collection("Users", ref => ref.where('teaches', '==', sport)).get().pipe(
      map(querySnapshot => {
        const list = [];
        querySnapshot.forEach(function(doc) {
          const id = doc.id;
          list.push({ id, ...doc.data() });
        });
        return list;
      })
    );
  }

  getUsersByRA(ra) {
    return this.fireStore.collection("Users", ref => ref.where('registerCode', '==', ra)).get().pipe(
      map(querySnapshot => {
        const list = [];
        querySnapshot.forEach(function(doc) {
          list.push(doc.data());
        });
        return list;
      })
    );
  }

  addUser(user, uid) {
    user.id = uid;
    return this.fireStore.collection("/Users").doc(uid).set(user);
  }

  getUser(id: string) {
    return this.fireStore.collection('/Users', ref => ref.where('id', '==', id)).valueChanges();
  }

  getUserByStarting() {
    return this.fireStore.collection('/Users', ref => ref.startAt("Burned")).valueChanges();
  }

  updateUser(id: string, user: User) {
    if (!Array.isArray(user.categories)) {
      user.categories = [ user.categories ];
    };
    return this.fireStore.collection('Users').doc<User>(id).update(user);
  }

  setLoggedUser(user: User) {
    if (user && user.categories === undefined) {
      user.categories = [];
    };
    this.loggedUser = user;
  }

  isAdministrator() {
    return this.loggedUser.role === Role.ADMIN;
  }

  isUser() {
    return this.loggedUser.role === Role.MEMBER || this.loggedUser.role === Role.NON_MEMBER;
  }

}