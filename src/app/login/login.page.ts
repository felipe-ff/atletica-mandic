import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, LoadingController, ToastController, AlertController } from '@ionic/angular';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
// import { Keyboard } from '@ionic-native/keyboard/ngx';
import { UserService } from 'src/app/services/user.service';
import { Role } from '../enums/role.enum';
import { Gender } from '../enums/gender.enum';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  @ViewChild(IonSlides) slides: IonSlides;

  userLogin: User = {};
  userRegister: User = {};

  loading: any;
  confirmPass: string;
  showResendButton = false;

  userImgPlaceholder =
    'https://firebasestorage.googleapis.com/v0/b/mandic-atletic.appspot.com/o/user-placeholder.jpg?alt=media&token=79c3f100-b681-4706-82ba-68436ceb6d62';

  genders = [
    { id: Gender.MALE, name: 'Masculino' }, { id: Gender.FEMALE, name: 'Feminino' }
  ];

  constructor(
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private userService: UserService,
    private router: Router,
    public alertController: AlertController,
  //  public keyboard: Keyboard
  ) { }

  ngOnInit() { }

  enableNextStep(fields: string[]) {
    return !fields.some(field => field === undefined);
  }

  verifyStep1() {
    return this.enableNextStep([this.userRegister.name, this.userRegister.email, this.userRegister.gender]);
  }

  verifyStep2() {
    return this.enableNextStep([this.userRegister.registerCode, this.userRegister.schoolClass]);
  }

  backSlide(event: any) {
    this.slides.slidePrev();
  }

  async nextSlide(event: any, step) {
    let valid = true;
    if (step && step === 1) {
      valid = this.verifyStep1();
    } else if (step && step === 2) {
      valid = this.verifyStep2();
      if (valid) {
        const found = await this.userService.getUsersByRA(this.userRegister.registerCode).pipe(first()).toPromise();
        if (found?.length) {
          this.presentToast('Já existe um usuário cadastrado com este RA!');
          return;
        }
      }
    }

    if (valid) {
      this.slides.slideNext();
    }
  }

  async login() {
    await this.presentLoading();

    try {
      await this.authService.login(this.userLogin);
      const currentUser = await this.authService.getCurrentUser();
      if (!currentUser.emailVerified) {
        this.showResendButton = true;
        this.presentToast('E-mail não verificado!');
      } else {
        this.router.navigate(['tabs']);
      }
    } catch (error) {
      this.presentToast(this.translateErrorMessage(error.message));
    } finally {
      this.loading.dismiss();
    }
  }

  async resendEmail() {
    const currentUser = await this.authService.getCurrentUser();
    await currentUser.sendEmailVerification();
    this.presentToast('E-mail enviado com sucesso!');
  }

  translateErrorMessage(msg) {
    if (msg.startsWith('There is no user record')) {
      return 'Não há usuário cadastro com este e-mail!'
    } else if ('The email address is badly') {
      return 'Endereço de e-mail inválido!'
    } else if ('The password is invalid') {
      return 'Senha inválida!'
    } else {
      return msg;
    }
  }

  async register() {
    try {
      await this.presentLoading();
      this.validatePassword();

      const user = await this.authService.register(this.userRegister);
      await this.authService.sendConfirmationEmail();

      await this.createUserInDatabase(user);
      this.slides.slideNext();
    } catch (error) {
      this.presentToast(error.message);
    } finally {
      this.loading.dismiss();
    }
  }

  validatePassword() {
    if (this.confirmPass !== this.userRegister.password) {
      throw { message: 'As senhas são diferentes!' };
    }
  }

  async presentAlertConfirm() {
    if (!this.userLogin?.email) {
      this.presentToast('Digite um e-mail no campo de e-mail para redefinição.')
      return;
    }
    const alert = await this.alertController.create({
    //  cssClass: 'my-custom-class',
      header: 'Aviso',
      message: 'Um e-mail será enviado para redefinição da sua senha, deseja continuar?',
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
          handler: async () => {
            try {
              await this.authService.sendRedefinePasswordEmail(this.userLogin.email);
              this.presentToast('E-mail enviado com sucesso!');
            } catch(e) {
              console.log(e);
              this.presentToast('E-mail inválido!');
            }
          }
        }
      ]
    });

    await alert.present();
  }

  createUserInDatabase(user) {
    this.userRegister.id = user.user.uid;

    this.userRegister.role = Role.NON_MEMBER;
    this.userRegister.name = this.capitalize(this.userRegister.name);
    this.userRegister.verified = false;
    this.userRegister.profileImageUrl = this.userImgPlaceholder;
    this.userRegister.categories = [];

    delete this.userRegister.password;

    return this.userService.addUser(this.userRegister, user.user.uid);
  }

  capitalize(name) {
    return name.charAt(0).toUpperCase() + name.slice(1);
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