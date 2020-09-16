import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TrainingCategoryService {

  private collectionName = 'Training-categories';

  constructor(private fireStore: AngularFirestore) {  }

  getAllTrainingCategories() {
    return this.fireStore.collection(this.collectionName).get().pipe(
      take(1),
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

  getTrainingCategoriesWithInFilter(segments) {
    if (!segments?.length) {
      return of([]);
    }
    return this.fireStore.collection(this.collectionName, ref => ref.where('id', 'in', segments)).get().pipe(
      take(1),
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

  addTrainingCategory(category) {
    category.id = this.fireStore.createId();
    return this.fireStore.collection(this.collectionName).doc(category.id).set(category);
  }
}