import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, LoadingController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { Plugins, CameraResultType, CameraSource, FilesystemDirectory, FilesystemEncoding } from '@capacitor/core';
import { UserService } from '../services/user.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { Utils } from "../utils/utils";
import { TrainingCategoryService } from '../services/training-category.service';
import { take } from 'rxjs/operators';
import { TrainingService } from '../services/training.service';
import { Training } from '../interfaces/training';
import * as Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
  loading: any;
  photo = "https://firebasestorage.googleapis.com/v0/b/mandic-atletic.appspot.com/o/user-placeholder.jpg?alt=media&token=79c3f100-b681-4706-82ba-68436ceb6d62";
  isEdit = false;
  modalities = [];
  utils = Utils;
  userService: UserService;
  directorModality;

  @ViewChild("pieCanvas", { static: false }) doughnutCanvas: ElementRef;

  private doughnutChart: Chart;

  constructor(
    userService: UserService,
    private activatedRoute: ActivatedRoute,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private trainingService: TrainingService,
    private trainingCategoryService: TrainingCategoryService,
    private cdr: ChangeDetectorRef,
    private angularFireStorage: AngularFireStorage,
    private toastCtrl: ToastController
  ) {
    this.userService = userService;
  }

  ngOnInit() {

  }

  ionViewWillEnter() {
    this.loadPhoto();
    this.initChart();

    this.trainingCategoryService.getAllTrainingCategories().pipe(take(1)).subscribe(categories => {
      if (this.userService.loggedUser.categories) {
        this.userService.loggedUser.categories.forEach( (userCatId: any) => {
          this.modalities.push(categories.find(cat => cat.id === userCatId));
        });
      }
      if (this.userService.loggedUser.teaches) {
        this.directorModality = categories.find(category => category.id === this.userService.loggedUser.teaches);
      }
    });
  }

  initChart() {
    Chart.plugins.register(ChartDataLabels);
    this.trainingService.getTrainingsByUserAttendance(this.userService.loggedUser.id).subscribe((trainings: Training[]) => {
      let presence = 0;
      let misses = 0;
      trainings.forEach((training: Training) => {
        const attendance = training.attendanceListDetailed.find(details => details.userId === this.userService.loggedUser.id);
        if (attendance.present) {
          presence++;
        } else {
          misses++;
        }
      });

      let total = presence + misses;

      if (total) {
        this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
          type: "pie",
          data: {
            labels: ["Presenças", "Faltas"],
            datasets: [
              {
                label: "Porcentagem",
                data: [presence, misses],
                backgroundColor: ["#36A2EB", "#FF6384"],
                borderWidth: 1,
              }
            ]
          },
          options: {
              plugins: {
                datalabels: {
                  color: 'white',
                  font: {
                    weight: 'bold'
                  },
                  formatter: function(value, context) {
                    return (100 * value / total).toFixed(2) + '%';
                  }
                }
              }
            }
          });
        }
      });
  }

  async takePicture() {
    const image = await Plugins.Camera.getPhoto({
      quality: 50,
      allowEditing: false,
      resultType: CameraResultType.Uri
    });

    this.uploadFile(image);
  }

  somethingChanged() {
    this.userService.updateUser(this.userService.loggedUser.id, this.userService.loggedUser);
  }

  async uploadFile(image) {
    const { Filesystem } = Plugins;

    this.stat(image.path);
    const photoInTempStorage = await Filesystem.readFile({ path: image.path });

    const ref = this.angularFireStorage.storage.ref().child('profile/' + this.userService.loggedUser.id + '.png');

    ref.putString(photoInTempStorage.data, 'base64').then( snapshot => {
      ref.getDownloadURL().then(url => {
        this.userService.loggedUser.profileImageUrl = url;
        this.userService.updateUser(this.userService.loggedUser.id, this.userService.loggedUser);

        this.photo = url;
      });
    });
  }

  async stat(path) {
    try {
      const { Filesystem } = Plugins;
      let ret = await Filesystem.stat({
        path: path
       // directory: FilesystemDirectory.Documents
      });
      console.log(ret.size);
    } catch(e) {
      console.error('Unable to stat file', e);
    }
  }

  getExtension() {
    var pathPhoto = this.userService.loggedUser.profileImageUrl.split('?')[0];
    return pathPhoto.substring(pathPhoto.length-4, pathPhoto.length);
  }

  loadPhoto() {
    const path = this.userService.loggedUser.id + this.getExtension();
    const storageRef = this.angularFireStorage.storage.ref().child(path);

    //this.photo = storageRef.getDownloadURL();
    this.photo = this.userService.loggedUser.profileImageUrl;
  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({ message: 'Aguarde...' });
    return this.loading.present();
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({ message, duration: 2000 });
    toast.present();
  }

  async logout() {
    await this.presentLoading();

    this.authService.logout().then(() => {
      console.log('loged out');
      this.loading.dismiss();
    }).catch(function(error) {
      console.error(error);
      this.loading.dismiss();
    });
  }

  isJudo(name: string) {
    return name.includes('Judo');
  }
}