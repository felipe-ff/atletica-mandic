import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { User } from '../interfaces/user';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-wait-confirm',
  templateUrl: './wait-confirm.page.html',
  styleUrls: ['./wait-confirm.page.scss'],
})
export class WaitConfirmPage implements OnInit {

  subscription;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router) { }

  ngOnInit() {
    if (this.userService.loggedUser) {
      this.subscription = this.userService.getUser(this.userService.loggedUser.id).subscribe((users: User[]) => {
        if (users[0].verified) {
          this.router.navigate(['tabs']);
        }
      });
    }
  }

  ionViewDidLeave() {
    this.subscription?.unsubscribe();
  }

  logout() {
    this.authService.logout();
  }

}
