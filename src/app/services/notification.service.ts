import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, mergeMap, tap, concatAll, first } from 'rxjs/operators';
import { Notification } from '../interfaces/notification';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { take, flatMap} from 'rxjs/operators';
import { forkJoin, zip, merge, combineLatest } from 'rxjs';
import { Role } from '../enums/role.enum';
import { UserService } from './user.service';
import { Utils } from '../utils/utils';
import {
  Plugins,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed } from '@capacitor/core';

const { PushNotifications } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private collectionName = "Notifications"

  constructor(
    private fireStore: AngularFirestore,
    private userService: UserService,
    private http: HttpClient) {  }

  getAllNotificationsFromUser(userId: string, filterQuery: string[]) {
    const obs1 = this.fireStore.collection(this.collectionName, ref => ref.where('userId', '==', userId)).valueChanges();

    const observableArray = filterQuery.map(query => {
      return this.fireStore.collection(this.collectionName, ref => ref.where('topic', '==', query)).valueChanges();
    });
    observableArray.push(obs1);

    return combineLatest(...observableArray);

    /* return forkJoin(tokenCall, topicCall).pipe(
      map(([s1, s2]) => [...s1, ...s2])
    ); */
  }

  addNotification(notification: Notification) {
    notification.id = this.fireStore.createId();
    return this.fireStore.collection("/".concat(this.collectionName)).doc(notification.id).set(notification);
  }

  updateNotification(id: string, notification: Notification) {
    return this.fireStore.collection(this.collectionName).doc<Notification>(id).update(notification);
  }

  removeNotification(notification: Notification) {
    return this.fireStore.collection("/".concat(this.collectionName)).doc(notification.id).delete();
  }

  initNotifications() {
    const { FCMPlugin } = Plugins;
    if (Utils.isAppOnDevice()) {
      PushNotifications.requestPermission().then( result => {
        if (result.granted) {
          // Register with Apple / Google to receive push via APNS/FCM
          PushNotifications.register();
        } else {
          console.log('ERROR');
        }
      });

      PushNotifications.addListener('registration',
        (token: PushNotificationToken) => {
          console.log('TOKEN');
          console.log(token.value);
          this.userService.loggedUser.notificationToken = token.value;
          this.userService.updateUser(this.userService.loggedUser.id, this.userService.loggedUser);
        }
      );

      this.subscribeToAllTopics();
    }
  }

  subscribeToAllTopics() {
    const userRole = this.userService.loggedUser.role;

    this.subscribeToSpecificTopic('/topics/wall');

    let topicAction = {
      [Role.ADMIN]: () => '/topics/admin',
      [Role.MEMBER]: () =>'/topics/member',
      [Role.NON_MEMBER]: () => '/topics/non-member'
    };
    let topic = topicAction[userRole]();
    this.subscribeToSpecificTopic(topic);

    if (this.userService.loggedUser.categories?.length) {
      this.userService.loggedUser.categories.forEach(category => {
        this.subscribeToSpecificTopic('/topics/sport-' + category);
      });
    }

    if (this.userService.loggedUser.teaches) {
      this.subscribeToSpecificTopic('/topics/director-' + this.userService.loggedUser.teaches);
    }
  }

  subscribeToSpecificTopic(topic) {
    const { FCMPlugin } = Plugins;

    if (Utils.isAppOnDevice()) {
      PushNotifications.register().then(() => {
        if (topic) {
          FCMPlugin.subscribeTo({ topic: topic }).catch(err => console.log(err));
        }
      })
      .catch(err => alert(JSON.stringify(err)));
    }
  }

  async unsubscribeFromAllTopics(userToken) {
    if (Utils.isAppOnDevice() && userToken) {
      const { FCMPlugin } = Plugins;
      let headers = new HttpHeaders();
      headers = headers.append('Content-Type', 'application/json');
      headers = headers.append('Authorization', environment.notificationServerKey);
      let options = { headers: headers };
      let apiUrl: string = 'https://iid.googleapis.com/iid/info/' + userToken + '?details=true';

      const resp: any = await this.http.get(apiUrl, options).pipe(first()).toPromise();
      if (resp?.rel?.topics) {
        Object.keys(resp.rel.topics).forEach(topic => {
          FCMPlugin.unsubscribeFrom({ topic: topic }).catch(err => console.log(err));
        });
      }
    }
  }

  unsubscribeFromSpecificTopic(topic) {
    if (Utils.isAppOnDevice()) {
      const { FCMPlugin } = Plugins;
      FCMPlugin.unsubscribeFrom({ topic: topic }).catch(err => console.log(err));
    }
  }
}