import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { UserService } from './services/user.service';
import { NotificationService } from './services/notification.service';
import { Utils } from "./utils/utils";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  public selectedIndex = 0;
  public appPages = [
    {
      title: 'Mural',
      url: '/wall-list',
      icon: 'home'
    },
    {
      title: 'Usuários',
      url: '/user-list',
      icon: 'people'
    },
    {
      title: 'Parceiros',
      url: '/folder/Favorites',
      icon: 'shield-checkmark'
    }
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work'];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private userService: UserService,
    private notificationsService: NotificationService
  ) {
   // document.body.classList.toggle('dark', true);
    this.initializeApp();
  }

  initializeApp() {
/*     this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    }); */
  }

  ngOnInit() {
    this.init();
  }

  async init() {
    while(!this.userService.loggedUser) {
      await new Promise(resolve => setTimeout(resolve, 200));
      if (this.userService.loggedUser) {
        this.notificationsService.initNotifications();
        this.initNotificationCounter();
      }
    }
  }

  initNotificationCounter() {
    const user = this.userService.loggedUser;
    const query = Utils.buildNotificationFilterArray(user.role, user.categories, user.teaches);

    this.notificationsService.getAllNotificationsFromUser(user.id, query).subscribe(result => { //do not close the stream
      const notifications = [];
      result.forEach(nots => {
        nots.forEach(notification => {
          if (notification?.id) {
            notifications.push(notification);
          }
        });
      });
      this.userService.notificationSeenCounter = 0;
      notifications.forEach( (notification: any) => {
        if (!notification.seen) {
          this.userService.notificationSeenCounter++;
        }
      });
    });
  }
}
