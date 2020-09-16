import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../services/notification.service';
import { Notification } from '../interfaces/notification';
import { UserService } from '../services/user.service';
import { Utils } from "../utils/utils";

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {

  notifications: Notification[] = [];

  constructor(private notificationsService: NotificationService,
              private userService: UserService
            ) { }

  ngOnInit() {}

  ionViewWillEnter() {
    this.loadNotifications();
  }

  loadNotifications() {
    const user = this.userService.loggedUser;
    const notificationArray = Utils.buildNotificationFilterArray(user.role, user.categories, user.teaches);
    if (notificationArray?.length) {
      this.notificationsService.getAllNotificationsFromUser(user.id, notificationArray).subscribe((result: any) => {
       result.forEach(notifications => {
          notifications.forEach(notification => {
            if (notification?.id) {
              this.notifications.push(notification);
            }
          });
        });

        this.notifications.forEach(notification => {
          notification.seen = true;
          this.notificationsService.updateNotification(notification.id, notification);
        });

        this.userService.notificationSeenCounter = 0;
      });
    }
  }

  async remove(notification: Notification) {
    await this.notificationsService.removeNotification(notification);
    this.loadNotifications();
  }

}
