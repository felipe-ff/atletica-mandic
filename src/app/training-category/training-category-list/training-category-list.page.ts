import { Component, OnInit } from '@angular/core';
import { TrainingCategoryService } from 'src/app/services/training-category.service';
import { ToastController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-training-category-list',
  templateUrl: './training-category-list.page.html',
  styleUrls: ['./training-category-list.page.scss'],
})
export class TrainingCategoryListPage implements OnInit {

  private loading: any;
  $trainingList;

  constructor(
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private trainingCategoryService: TrainingCategoryService
  ) { }

  ngOnInit() {
    this.$trainingList = this.trainingCategoryService.getAllTrainingCategories();
  }

  ngOnDestroy() {
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
