import { Component, OnInit } from '@angular/core';
import { TrainingCategoryService } from '../services/training-category.service';
import { take } from 'rxjs/operators';
import { UserService } from '../services/user.service';
import { ToastController, LoadingController, AlertController } from '@ionic/angular';
import { NotificationType } from '../enums/notification-type.enum';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-my-sports',
  templateUrl: './my-sports.page.html',
  styleUrls: ['./my-sports.page.scss'],
})
export class MySportsPage implements OnInit {
  builtList = [];
  trainingCatList = [];
  loading;

  constructor(
    private trainingCategoryService: TrainingCategoryService,
    private userService: UserService,
    private toastCtrl: ToastController,
    private notificationService: NotificationService,
    private loadingCtrl: LoadingController,
    public alertController: AlertController
  ) { }

  ngOnInit() { }

  ionViewWillEnter() {
    this.trainingCategoryService.getAllTrainingCategories().pipe(take(1)).subscribe(categories =>{
      this.builtList = categories.filter(category => !category.gender || category.gender === this.userService.loggedUser.gender);

      if (this.userService.loggedUser.categories) {
        this.userService.loggedUser.categories.forEach( (userCatId: any) => {
          this.builtList.find(cat => cat.id === userCatId).selected = true;
        });
      }
    });
  }

  async presentAlertConfirm(category) {
    const alert = await this.alertController.create({
      message: `Deseja se ${!category.selected ? 'inscrever no' : 'desinscrever do'} esporte ${category.name}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Confirmar',
          handler: () => {
            this.toggleSport(category);
          }
        }
      ]
    });

    await alert.present();
  }

  async toggleSport(category) {
    if (!category.selected && this.userService.loggedUser.categories?.length >= 9) {
      this.presentToast('Não é possível estar cadastrado em mais de 9 esportes.')
      return;
    }

    await this.presentLoading();
    category.selected = !category.selected;

    if (this.userService.loggedUser.categories === undefined) {
      this.userService.loggedUser.categories = [];
    }

    try {
      if (category.selected) {
        this.userService.loggedUser.categories.push(category.id);
      } else {
        let userCategories = this.userService.loggedUser.categories;
        userCategories.splice(userCategories.indexOf(category.id), 1);
      }

      await this.userService.updateUser(this.userService.loggedUser.id, this.userService.loggedUser);

      try {
        this.notificationService.addNotification(this.createUserNotification(category, this.userService.loggedUser, false));

        this.userService.getUsersByTeachesCategory(category.id).subscribe((users: any) => {
          if (users?.length) {
            this.notificationService.addNotification(this.createUserNotification(category, users[0], true));
          }
        });

        this.subscribeToSportTopic(category);
      } catch(e) {
        console.log(e);
      }

      this.presentToast(category.selected ? 'Inscrição realizada!' : 'Desinscrição realizada!');
      this.loading.dismiss();
    } catch(e) {
      console.log(e);
    }
  }

  subscribeToSportTopic(category) {
    if (category.selected) {
      this.notificationService.subscribeToSpecificTopic('/topics/sport-' + category.id);
    } else {
      this.notificationService.unsubscribeFromSpecificTopic('/topics/sport-' + category.id);
    }
  }

  createUserNotification(category, user, isDirector) {
    return {
      title: this.buildTitleMsg(category, isDirector),
      description: this.buildDescriptionMsg(category, isDirector),
      date: new Date().getTime(),
      notificationType: NotificationType.SPORT,
      userId: user.id,
      userToken: user.notificationToken
    };
  }

  buildTitleMsg(category, isDirector) {
    if (isDirector) {
      return `${category.selected ? 'Nova inscrição': 'Desinscrição'} na sua modalidade.`;
    } else {
      return `${category.selected ? 'Inscrição': 'Desinscrição'} no ${category.name} realizada com sucesso!`;
    }
  }

  buildDescriptionMsg(category, isDirector) {
    if (isDirector) {
      return `O usuário ${this.userService.loggedUser.name} se ${category.selected ? 'inscreveu': 'desinscreveu'} da modalidade ${category.name}.`;
    } else {
      return category.selected ?
        `Acesse a aba de treinos no menu para ver os treinos do dia do esporte: ${category.name} !` :
        'Você não receberá mais notificações desta modalidade.';
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({ message, duration: 2000 });
    toast.present();
  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({ message: 'Aguarde...' });
    return this.loading.present();
  }

  isJudo(name: string) {
    return name.includes('Judo');
  }
}
