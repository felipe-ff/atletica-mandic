import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingController, ToastController, Platform, AlertController } from '@ionic/angular';
import { WallService } from 'src/app/services/wall.service';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';

import { Utils } from "../../utils/utils";
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-wall-list',
  templateUrl: './wall-list.page.html',
  styleUrls: ['./wall-list.page.scss']
})
export class WallListPage implements OnInit {

  loading: any;
  wallList = [];
  selectedSegment = '69OtD5A6IDZotFoTxrUU';
  userService: UserService;
  categoryList = [];

  showMoreArray = [];

  constructor(
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private wallService: WallService,
    public alertController: AlertController,
    private router: Router,
    private photoViewer: PhotoViewer,
    userService: UserService
  ) {
    this.userService = userService;
  }

  ngOnInit() { }

  async ionViewWillEnter() {
    this.categoryList = await this.wallService.getAllPostCategories().pipe(first()).toPromise();
    this.loadPosts();
  }

  loadPosts() {
    let query = this.selectedSegment;
    if (this.categoryList.find(category => category.id === this.selectedSegment).name === 'Geral') {
      query = 'all';
    }

    this.wallService.getWallBySegment(query).subscribe(data => {
      this.wallList = data;
    });
  }

  goToPage($event, id) {
    $event.preventDefault();
    $event.stopPropagation();
    this.router.navigate(['/tabs/wall/wall-create', id]);
  }

  goToViewPage($event, id) {
    $event.preventDefault();
    $event.stopPropagation();
    this.router.navigate(['/tabs/wall/wall-view', id]);
  }

  showFullscreenImage(wall) {
    this.photoViewer.show(wall.url);
  }

  segmentChanged(event) {
    this.wallList = new Array<any>();
    this.selectedSegment = event.detail.value;
    this.loadPosts();
  }

  toggleMore($event, id) {
    $event.preventDefault();
    $event.stopPropagation();

    if (this.showMoreArray.find(value => value === id)) {
      this.showMoreArray.splice(this.showMoreArray.indexOf(id), 1);
    } else {
      this.showMoreArray.push(id);
    }

  }

  showMore(id) {
    return this.showMoreArray.find(value => value === id);
  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({ message: 'Aguarde...' });
    return this.loading.present();
  }

  async deleteWallPost(id: string, url: string) {
   try {
      await this.wallService.deleteWallPost(id, url);
      Utils.presentToast('Deletado com successo!', this.toastCtrl);
      this.loadPosts();
    } catch (error) {
      Utils.presentToast('Erro ao tentar deletar', this.toastCtrl);
    }
  }

  async presentAlertConfirm($event, id: string, url: string) {
    $event.preventDefault();
    $event.stopPropagation();

    const alert = await this.alertController.create({
    //  cssClass: 'my-custom-class',
      header: 'Aviso',
      message: 'Deseja apagar este post?',
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
            this.deleteWallPost(id, url);
            console.log('Confirm Okay');
          }
        }
      ]
    });

    await alert.present();
  }

  usefulForFuture() {
  /*   // Unsubscribe from a specific topic
    FCMPlugin
      .unsubscribeFrom({ topic: "test" })
      .then(() => alert(`unsubscribed from topic`))
      .catch(err => console.log(err)); */


/*       // Get FCM token instead the APN one returned by Capacitor
      FCMPlugin
        .getToken()
        .then(r => alert(`Token ${r.token}`))
        .catch(err => console.log(err));


      // Remove FCM instance
      FCMPlugin
        .deleteInstance()
        .then(() => alert(`Token deleted`))
        .catch(err => console.log(err)); */
  }

}
