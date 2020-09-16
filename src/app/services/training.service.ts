import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import { Training } from '../interfaces/training';
import * as moment from 'moment';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TrainingService {

  constructor(private fireStore: AngularFirestore) {  }

  getTrainingsBySportCategories(sportCategories: string[]) {
    if (!sportCategories.length) {
      return of([]);
    };

    return this.fireStore.collection('Trainings', ref => ref.where('category', 'in', sportCategories)).valueChanges().pipe(
      map((trainings: Training[]) => {
        const filteredTrainings = this.filterByDate(trainings); // TODO why unused?
        return trainings.sort( (a,b) => a.date < b.date ? 1 : -1);
      })
    );
  }

  getTrainingsByUserAttendance(userId: string) {
    return this.fireStore.collection('Trainings', ref => ref.where('attendanceList', 'array-contains', userId)).valueChanges().pipe(
      map((trainings: Training[]) => {
        const removeCancelled = trainings.filter(training => !training.cancelled);
        return this.filterByDate(removeCancelled);
      })
    );
  }

  filterByDate(trainings: Training[]) {
    const year = moment().year();
    const initialMonth = moment().month() < 8 ? 1 : 8;
    const finalMonth = moment().month() < 8 ? 7 : 12;

    const initialDate = moment(`${initialMonth}-01-${year}`, 'MM-DD-YYYY');
    const finalDate = moment(`${finalMonth}-01-${year}`, 'MM-DD-YYYY');

    return trainings.filter(training => moment(training.date).isBetween(initialDate, finalDate, 'months', '[]'));
  }

  addTraining(training) {
    training.id = this.fireStore.createId();
    return this.fireStore.collection('/Trainings').doc(training.id).set(training);
  }

  getTraining(id: string) {
    return this.fireStore.collection('Trainings').doc(id).valueChanges();
  }

  getTrainingSingle(id: string) {
    return this.fireStore.collection('Trainings').doc(id).get();
  }

  updateTraining(id: string, training: Training) {
    return this.fireStore.collection('Trainings').doc<Training>(id).update(training);
  }

  deleteTraining(id: string) {
    return this.fireStore.collection("/".concat('Trainings')).doc(id).delete();
  }
}