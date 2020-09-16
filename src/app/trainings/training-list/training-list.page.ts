import { Component, OnInit, ViewChild } from '@angular/core';
import { LoadingController, ToastController, IonBackButtonDelegate, NavController } from '@ionic/angular';
import { TrainingService } from 'src/app/services/training.service';
import { TrainingCategoryService } from 'src/app/services/training-category.service';
import { Router } from '@angular/router';
import { User } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';
import { Role } from 'src/app/enums/role.enum';
import { AuthService } from 'src/app/services/auth.service';
import { take, first } from 'rxjs/operators';
import { Gender } from 'src/app/enums/gender.enum';

@Component({
  selector: 'app-training-list',
  templateUrl: './training-list.page.html',
  styleUrls: ['./training-list.page.scss'],
})
export class TrainingListPage implements OnInit {

  loading: any;
  trainingList = [];
  trainingSubscription;
  trainingCatList = [];
  userService: UserService;
  selectedSegment = 'all';
  userCategories;

  constructor(
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private trainingService: TrainingService,
    private router: Router,
    private trainingCategoryService: TrainingCategoryService,
    userService: UserService
  ) {
    this.userService = userService;
  }

  async ionViewWillEnter() {
    if (!this.userService.loggedUser.categories?.length && !this.userService.loggedUser.teaches) {
      this.trainingList = [{ name: 'Não há treinos.' }];
      return;
    }

    this.userCategories = [ this.userService.loggedUser.teaches, ...this.userService.loggedUser.categories ].filter(e => e);

    const categoryList =  await this.trainingCategoryService.getTrainingCategoriesWithInFilter(this.userCategories).pipe(first()).toPromise();
    this.trainingCatList = [ { id: 'all', name: 'todos' }, ...categoryList ];
    this.loadTrainings();
  }

  loadTrainings() {
    const categoriesFilter = this.selectedSegment !== 'all' ? ([this.selectedSegment ]) : this.userCategories;
    this.trainingSubscription = this.trainingService.getTrainingsBySportCategories(categoriesFilter).subscribe(trainings => {
      this.trainingList = trainings;
      this.trainingList.forEach(training => {
        training.category = this.trainingCatList.find(cat => cat.id === training.category);
      });

      if (this.trainingList.length === 0) {
        this.trainingList = [{ name: 'Não há treinos.' }];
      }
    });
  }

  segmentChanged(event) {
    this.trainingList = new Array<any>();
    this.selectedSegment = event.detail.value;
    this.loadTrainings();
  }

  ngOnInit() {
    // setInterval( () => { this.register(); }, 1500);
  }

  capitalize(name) {
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  randomIntFromInterval(min, max) { // min and max included 
    const s = Math.floor(Math.random() * (max - min + 1) + min);
    return '' + s;
  }

  goToPage() {
   this.router.navigate(['tabs/trainings/training-create']);
  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({ message: 'Aguarde...' });
    return this.loading.present();
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({ message, duration: 2000 });
    toast.present();
  }

  showButton(category) {
    const isTeacher = this.userService.loggedUser.teaches === category;
    return this.userService.isAdministrator() || isTeacher;
  }

  showCreateButton() {
    return this.userService.isAdministrator() || !!this.userService.loggedUser.teaches;
  }

/*
  async register() {
    let r = Math.random().toString(36).substring(7);
    const userGenerated: User = { name: r, email: r + '@gmail.com', password: '123456', gender: Gender.MALE,
                                  registerCode: this.randomIntFromInterval(1, 10000), schoolClass: this.randomIntFromInterval(1, 10000) }
    const user = await this.authService.register(userGenerated);
    userGenerated.id = user.user.id;
    delete userGenerated.password;
    userGenerated.name = this.capitalize(userGenerated.name);
    userGenerated.email = this.capitalize(userGenerated.email);
    userGenerated.verified = false;
    userGenerated.role = Role.NON_MEMBER;
    userGenerated.profileImageUrl = "https://firebasestorage.googleapis.com/v0/b/mandic-atletic.appspot.com/o/user-placeholder.jpg?alt=media&token=79c3f100-b681-4706-82ba-68436ceb6d62"
    this.userService.addUser(userGenerated, user.user.uid).then(t => console.log(t));    
  } */
}
