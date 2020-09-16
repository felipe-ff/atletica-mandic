import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { LoadingController, ToastController, NavController } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';
import { take, flatMap } from 'rxjs/operators';
import { TrainingService } from 'src/app/services/training.service';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.page.html',
  styleUrls: ['./attendance.page.scss'],
})
export class AttendancePage implements OnInit {

  private loading: any;
  public users = new Array();
  test = false;
  training: any;
  trainingId;

  constructor(
    private loadingCtrl: LoadingController,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private navCtrl: NavController,
    private trainingService: TrainingService,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    const id = this.activatedRoute.snapshot.params['id'];
    this.trainingId = id;

    this.trainingService.getTrainingSingle(this.trainingId).pipe(
      take(1),
      flatMap((training: any) => {
        this.training = training.data();
        if (!this.training.attendanceList) {
          this.training.attendanceList = [];
        }
        return this.userService.getUsersBySportCategory(this.training.category);
    })).subscribe(data => {
      this.users = data;
      this.users.forEach(user => {
        user.checked = this.isPresent(user.id);
      });
    });
  }

  isPresent(id): boolean {
    if (!this.training.attendanceList) {
      return false;
    }
    return !!this.training.attendanceList.find(userId => userId === id);
  }

  async save() {
    await this.presentLoading();
    this.training.attendanceList = [];
    this.training.attendanceListDetailed = [];

    this.users.forEach(user => {
      this.training.attendanceList.push(user.id);
      this.training.attendanceListDetailed.push( {userId: user.id, present: user.checked });
    });

    try {
      await this.trainingService.updateTraining(this.trainingId, this.training);
      await this.loading.dismiss();
      this.navCtrl.navigateBack('tabs/trainings/training-list');
    } catch(error) {
      console.log(error);
      this.presentToast('Erro ao tentar salvar');
      this.loading.dismiss();
    }
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
