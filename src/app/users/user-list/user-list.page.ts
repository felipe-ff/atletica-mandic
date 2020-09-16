import { Component, OnInit } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/interfaces/user';
import { take, first } from 'rxjs/operators';
import { TrainingCategoryService } from 'src/app/services/training-category.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.page.html',
  styleUrls: ['./user-list.page.scss'],
})
export class UserListPage implements OnInit {
  loading: any;
  users = new Array<User>();
  originalUsers = new Array<User>();
  selectedSegment = 'unverified';
  userService: UserService;
  listLoading = true;
  teachesName;

  constructor(
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private trainingCategoryService: TrainingCategoryService,
    userService: UserService
  ) {
    this.userService = userService;
  }

  ngOnInit() { }

  ionViewWillEnter() {
    this.loadTeachesName();
   this.loadUsers();
  }

  loadUsers() {
    this.listLoading = true;
    const searchResult$ = this.userService.isAdministrator() ?
      this.userService.getUsersBySegment(this.selectedSegment) :
      this.userService.getUsersBySportCategory(this.userService.loggedUser.teaches);

    searchResult$.subscribe(data => {
      this.listLoading = false;
      this.users = data;
      this.originalUsers = [ ...data ];
    });
  }

  async loadTeachesName() {
    if (this.userService.loggedUser.teaches) {
      const category = await this.trainingCategoryService.getTrainingCategoriesWithInFilter(new Array(this.userService.loggedUser.teaches)).pipe(first()).toPromise();;
      this.teachesName = `(${category[0]?.name})`;
    }
  }
 
  async presentLoading() {
    this.loading = await this.loadingCtrl.create({ message: 'Aguarde...' });
    return this.loading.present();
  }

  segmentChanged(event) {
    this.users = new Array<User>();
    this.selectedSegment = event.detail.value;
    this.loadUsers();
  }

  filterByName(ev) {
    const val = ev.target.value;
    if (val && val.trim() != '') {
      this.users = this.originalUsers.filter(user => user.name.toLowerCase().includes(val.toLowerCase())) || new Array<User>();
    } else {
      this.users = [...this.originalUsers ]; 
    }
  }

 /*  async deleteUser(id: string) {
    try {
      await this.userService.deleteUser(id);
    } catch (error) {
      this.presentToast('Erro ao tentar deletar');
    }
  } */

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({ message, duration: 2000 });
    toast.present();
  }
}