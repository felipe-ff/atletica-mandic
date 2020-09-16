import { ToastController } from '@ionic/angular';
import { Role } from '../enums/role.enum';

export class Utils {
  static async presentToast(message: string, toastCtrl: ToastController) {
    const toast = await toastCtrl.create({ message, duration: 2000 });
    toast.present();
  }

  static isAppOnDevice(): boolean {
    if (window.location.port === '8100') {
      return false;
    } else {
      return true;
	  }
  }

  static buildNotificationFilterArray(role: Role, categories: string[], teaches) {
    const queryList = [];

    if (categories) {
      switch (role) {
        case Role.ADMIN:
          categories.forEach(category => queryList.push('/topics/admin-' + category))
          break;

        case Role.MEMBER:
          categories.forEach(category => queryList.push('/topics/member-' + category))
          break;

        case Role.NON_MEMBER:
          categories.forEach(category => queryList.push('/topics/non-member-' + category))
          break;

        default:
          break;
      }
    };

    if (teaches) {
      queryList.push('/topics/director-' + teaches);
    };

    return queryList;
  }

  static getRoleUser(role: Role) {
    var strRole = "UNKNOWN";
    switch (role) {
       case '1':
        strRole = "Não-sócio";
        break;
      case '2':
        strRole = "Sócio";
        break;
      case '4':
        strRole = "Administrador";
        break;
    }
    return strRole;
  }
}