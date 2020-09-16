import { Component, OnInit, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { Training } from 'src/app/interfaces/training';
import { TrainingService } from 'src/app/services/training.service';
import { ActivatedRoute } from '@angular/router';
import { take, first } from 'rxjs/operators';
import { TrainingCategoryService } from 'src/app/services/training-category.service';
import { ToastController, LoadingController, NavController, AlertController } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';
import { Role } from 'src/app/enums/role.enum';

@Component({
  selector: 'app-training-create',
  templateUrl: './training-create.page.html',
  styleUrls: ['./training-create.page.scss'],
})
export class TrainingCreatePage implements OnInit {

  loading: any;

  selectedTraining: Training = {};
  $trainingCatList;
  date;
  selectedCategory;

  monthShortNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

  constructor(
    private trainingService: TrainingService,
    private trainingCategorySerice: TrainingCategoryService,
    private activatedRoute: ActivatedRoute,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private userService: UserService,
    public alertController: AlertController,
    private navCtrl: NavController,
    private cdref: ChangeDetectorRef
  ) {
      this.init();
  }

  async init() {
    const id = this.activatedRoute.snapshot.params['id'];

    this.$trainingCatList = this.userService.loggedUser.role === Role.ADMIN
     ? this.trainingCategorySerice.getAllTrainingCategories()
     : this.trainingCategorySerice.getTrainingCategoriesWithInFilter(this.userService.loggedUser.categories);

    if (id) {
      const training: any = await this.trainingService.getTraining(id).pipe(first()).toPromise();
      this.selectedTraining = { id, ...training };
      setTimeout(()=> {
        this.selectedCategory = this.selectedTraining.category;
      }, 1100);
      this.date = new Date(this.selectedTraining.date).toISOString();
    } else {
      this.date = new Date().toISOString();
    }
  }

  change(categoryId) {
    this.selectedTraining.category = categoryId;
  }

  ngOnInit() { }

  async save() {
    await this.presentLoading();

    this.selectedTraining.category = this.selectedCategory;
    try {
      this.validateFields();
      if (this.selectedTraining.id) {
        await this.trainingService.updateTraining(this.selectedTraining.id, this.selectedTraining);
      } else {
        if (!this.selectedTraining.date) {
          this.selectedTraining.date = new Date().getTime();
        }
        await this.trainingService.addTraining(this.selectedTraining);
       // this.notificationService.addNotification(this.createUserNotification()); Teria que iterar todos usuários inscritos no treino, e
       // causará grande impacto na performance (deve ser feito no cloud functions futuramente)
      }
      await this.loading.dismiss();
      this.navCtrl.navigateBack('tabs/trainings/training-list');
    } catch(error) {
      console.log(error);
      this.presentToast(error.message);
      this.loading.dismiss();
    }
  }

  validateFields() {
    if (!this.selectedTraining.name) {
      throw { message: 'Por favor preencha o campo nome!' };
    }
    if (!this.selectedTraining.category) {
      throw { message: 'Por favor selecione a categoria!' };
    }
  }

  changeDate(event) {
    const dateStr = event.detail.value;
    const date = new Date(dateStr).getTime();

    this.selectedTraining.date = date;

    this.cdref.detectChanges();
  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({ message: 'Aguarde...' });
    return this.loading.present();
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({ message, duration: 2000 });
    toast.present();
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
    //  cssClass: 'my-custom-class',
      header: 'Aviso',
      message: 'Deseja cancelar o treino? está ação não pode ser desfeita.',
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
            this.cancel();
            console.log('Confirm Okay');
          }
        }
      ]
    });

    await alert.present();
  }

  async presentAlertDelete() {
    const alert = await this.alertController.create({
    //  cssClass: 'my-custom-class',
      header: 'Aviso',
      message: 'Deseja excluir o treino? está ação não pode ser desfeita.',
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
            this.delete();
            console.log('Confirm Okay');
          }
        }
      ]
    });

    await alert.present();
  }

  async cancel() {
    await this.presentLoading();

    try {
      this.selectedTraining.cancelled = true;
      await this.trainingService.updateTraining(this.selectedTraining.id, this.selectedTraining);

      await this.loading.dismiss();
      this.navCtrl.navigateBack('tabs/trainings/training-list');
    } catch(error) {
      console.log(error);
      this.presentToast(error.message);
      this.loading.dismiss();
    }
  }

  async delete() {
    await this.presentLoading();

    try {
      await this.trainingService.deleteTraining(this.selectedTraining.id);

      await this.loading.dismiss();
      this.navCtrl.navigateBack('tabs/trainings/training-list');
    } catch(error) {
      console.log(error);
      this.presentToast(error.message);
      this.loading.dismiss();
    }
  }

}
