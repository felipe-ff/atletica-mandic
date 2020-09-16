import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute } from '@angular/router';
import { take, first } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';
import { TrainingCategoryService } from 'src/app/services/training-category.service';
import { LoadingController, ToastController, NavController } from '@ionic/angular';
import { Role } from 'src/app/enums/role.enum';
import { User } from 'src/app/interfaces/user';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.page.html',
  styleUrls: ['./user-edit.page.scss'],
})
export class UserEditPage implements OnInit {

  roles = [
    {id: Role.NON_MEMBER, name: 'Não Sócio' }, {id: Role.MEMBER, name: 'Sócio' }, {id: Role.ADMIN, name: 'Administrador'}
  ];

  selectedUser: User = {};
  loading: any;
  trainingCatList;
  userId;
  initialLoad = true;
  userService: UserService;

  selectedCategories;
  teaches;

  constructor(
    userService: UserService,
    private activatedRoute: ActivatedRoute,
    private loadingCtrl: LoadingController,
    private navCtrl: NavController,
    private angularFireStorage: AngularFireStorage,
    private toastCtrl: ToastController,
    private trainingCategoryService: TrainingCategoryService,
    private notificationService: NotificationService
  ) {
    this.userService = userService;
    this.init();
  }

  ngOnInit() { }

  ionViewWillEnter() { }

  async init() {
    const id = this.activatedRoute.snapshot.params['id'];
    this.userId = id;

    if (id) {
      const users = await this.userService.getUser(id).pipe(first()).toPromise();
      this.selectedUser = users[0];
      setTimeout(()=> {
        this.selectedCategories = this.selectedUser.categories;
        this.teaches = this.selectedUser.teaches;
      }, 1100);
    }

    this.trainingCategoryService.getAllTrainingCategories().pipe(take(1)).subscribe(categories => {
      this.trainingCatList = categories.filter(category => !category.gender || category.gender === this.selectedUser.gender);
    });
  }

  fetchCategoryName(id) {
    if (this.trainingCatList && id) {
      return this.trainingCatList.find(category => category.id === id)?.name;
    }
  }

  fetchRole(id) {
    return this.roles.find(role => role.id === id)?.name;
  }

  async save() {
    await this.presentLoading();

    try {
      this.validateMaxSports();
      await this.validateRa(this.selectedUser);
      if (this.selectedUser.role) {
        this.notificationService.unsubscribeFromAllTopics(this.selectedUser.notificationToken);
        this.notificationService.subscribeToAllTopics();
        this.selectedUser.teaches = this.teaches|| null;
        this.selectedUser.categories = this.selectedCategories || [];
        await this.userService.updateUser(this.userId, this.selectedUser);
      } else {
        this.presentToast("É necessário selecionar o 'Tipo de usuário'");
      }
      await this.loading.dismiss();
      this.navCtrl.navigateBack('tabs/users/user-list');
    } catch(error) {
      console.log(error);
      this.presentToast(error.message);
      this.loading.dismiss();
    }
  }

  async validateRa(user) {
    const found = await this.userService.getUsersByRA(user.registerCode).pipe(first()).toPromise();
    if (found?.length && found[0].id !== user.id) {
      throw { message: 'Já existe outro usuário cadastrado com este RA!' };
    }
  }

  validateMaxSports() {
    if (this.selectedCategories?.length >= 9) {
      throw { message: 'Não é possível estar cadastrado em mais de 9 esportes.' };
    }
  }

  resetSports() {
    if (!this.initialLoad) {
      this.selectedUser.categories = [];
    }
    this.initialLoad = false;
  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({ message: 'Aguarde...' });
    return this.loading.present();
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({ message, duration: 2000 });
    toast.present();
  }

}
