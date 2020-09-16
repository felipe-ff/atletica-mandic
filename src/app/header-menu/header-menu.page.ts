import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { User } from '../interfaces/user';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header-menu',
  templateUrl: './header-menu.page.html',
  styleUrls: ['./header-menu.page.scss'],
})
export class HeaderMenuPage implements OnInit {

  @Input() title = 'Atlética Mandic';
  loggedUser: any = {};
  @Input() showBack = true;
  userService: UserService;
  @Input() showPhoto = true;

  constructor(private router: Router, userService: UserService, private authService: AuthService) { 
    this.userService = userService;
  }

  ngOnInit() {
/*  const user = this.userService.loggedUser; //deixar deste jeito
    if (!user) {
      this.authService.logout();
      this.router.navigate(['login']);
    } */
    this.showBack =
      !(this.router.url === '/tabs/wall/wall-list'|| this.router.url === '/tabs/trainings/training-list' || this.router.url === '/tabs/users/user-list'
      ||this.router.url === '/tabs/my-sports' || this.router.url === '/tabs/notifications');

    this.showPhoto = !(this.router.url === '/profile-edit');
  }

  navigateToProfilePage() {
    this.router.navigate(['profile-edit']);
  }

  ionViewWillEnter() {

  }

}
