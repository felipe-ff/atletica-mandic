import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivate } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UserService
  ) { }

  canActivate(): Promise<boolean> {
    return new Promise(resolve => {
      this.authService.getAuth().onAuthStateChanged(user => {
        if (user) {
          this.userService.getUser(user.uid).subscribe((users: any[]) => {
            if (users && users.length && users[0].verified) {
              resolve(users ? true : false);
            } else {
              this.authService.logout();
              this.router.navigate(['login']);
            }
          });
        } else {
          this.authService.logout();
          this.router.navigate(['login']);
        }
      });
    });
  }
}