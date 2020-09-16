import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class WallService {

  constructor(private fireStore: AngularFirestore, private angularFireStorage: AngularFireStorage) {  }

  getAllPosts() {
    return this.fireStore.collection("Wall").get().pipe(
      take(1),
      map(querySnapshot => {
        console.log(querySnapshot);
        const list = [];
        querySnapshot.forEach(function(doc) {
          const id = doc.id;
          list.push({ id, ...doc.data() });
        });
        return list;
      })
    );
  }

  getWallBySegment(segment) {
    let query: any;
    if (segment === 'all') {
      query = this.fireStore.collection("Wall");
    } else {
      query = this.fireStore.collection("Wall", ref => ref.where('category', '==', segment));
    }

    return query.valueChanges().pipe(
      map((notifications: any) => {
        return notifications.sort( (a,b) => b.date > a.date ? 1 : -1);
      })
    );
  }

  getAllPostCategories() {
    return this.fireStore.collection("Wall-post-categories", ref => ref.orderBy('order')).get().pipe(
      take(1),
      map(querySnapshot => {
        const list = [];
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            list.push(doc.data());
        });
        return list;
      })
    );
  }

  addWallPost(wall) {
    wall.date = new Date().getTime();
    wall.id = this.fireStore.createId();
    return this.fireStore.collection("/Wall").doc(wall.id).set(wall);
  }

  getWall(id: string) {
    return this.fireStore.collection('Wall').doc(id).get();
  }

  updateWallPost(id: string, wallPost: any) {
    return this.fireStore.collection('Wall').doc(id).update(wallPost);
  }

  deleteWallPost(id: string, url) {
    if (url) {
      this.angularFireStorage.storage.refFromURL(url).delete();
    }

    return this.fireStore.collection('Wall').doc(id).delete();
  } 
}