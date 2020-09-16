import { NotificationType } from '../enums/notification-type.enum';

export interface Notification {
    id?: string;
    title: string;
    description: string;
    date: Number;
    notificationType?: NotificationType;
    seen?: boolean;
    userId?: string;
    userToken?: string;
    topic?: string
}