import { Component, OnInit } from '@angular/core';
import { Plugins, CameraResultType, CameraSource, FilesystemDirectory, FilesystemEncoding } from '@capacitor/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { WallService } from 'src/app/services/wall.service';
import { LoadingController, ToastController, NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-wall-create',
  templateUrl: './wall-create.page.html',
  styleUrls: ['./wall-create.page.scss'],
})
export class WallCreatePage implements OnInit {
  photo;
  wallPost: any = {};
  $wallCategories;
  loading: any;
  imageLoading;
  image;
  selectedCategory;

  constructor(
    private angularFireStorage: AngularFireStorage,
    private loadingCtrl: LoadingController,
    private activatedRoute: ActivatedRoute,
    private toastCtrl: ToastController,
    private navCtrl: NavController,
    private wallService: WallService
  ) {
    const id = this.activatedRoute.snapshot.params['id'];
    this.$wallCategories = this.wallService.getAllPostCategories();

    if (id) {
      this.wallService.getWall(id).pipe(take(1)).subscribe((wall: any) => {
        this.wallPost = wall.data();
        setTimeout(()=> {
          this.selectedCategory = this.wallPost.category;
        }, 1100);

        // this.date = new Date(this.selectedTraining.date).toISOString();
      });
    }
  }

  ngOnInit() { }

  async takePicture() {
    this.imageLoading = true;
    const image = await Plugins.Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      source: CameraSource.Photos,
      resultType: CameraResultType.Uri
    });

    this.image = image;
    this.imageLoading = false;
  }

  async save() {
    const { Filesystem } = Plugins;

    if (this.image) {
      const photoInTempStorage = await Filesystem.readFile({ path: this.image.path });
      const storageRef = this.angularFireStorage.storage.ref();
      const ref = storageRef.child('wall/' + new Date().getTime() + '.png');

      ref.putString(photoInTempStorage.data, 'base64').then( snapshot => {
        ref.getDownloadURL().then(url =>{
          this.wallPost.url = url;
          this.doSave();
        });
      });
    } else {
      this.doSave();
    }
  }

  async doSave() {
    await this.presentLoading();

    this.wallPost.category = this.selectedCategory;
    try {
      this.validateFields();
      if (this.wallPost.id) {
        await this.wallService.updateWallPost(this.wallPost.id, this.wallPost);
      } else {
/*         if (!this.selectedTraining.date) {
          this.selectedTraining.date = new Date().getTime();
        } */
        await this.wallService.addWallPost(this.wallPost);
      }
      await this.loading.dismiss();
      this.navCtrl.navigateBack('tabs/wall/wall-list');
    } catch(error) {
      console.log(error);
      this.presentToast(error.message);
      this.loading.dismiss();
    }
  }

  validateFields() {
    if (!this.wallPost.name) {
      throw { message: 'Por favor preencha o campo nome!' };
    }
    if (!this.wallPost.category) {
      throw { message: 'Por favor selecione a categoria!' };
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
