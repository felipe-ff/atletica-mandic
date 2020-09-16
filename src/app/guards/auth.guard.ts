import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivate } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { User } from '../interfaces/user';
import { Role } from '../enums/role.enum';

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
      this.authService.getAuth().onAuthStateChanged(authUser => {
        if (authUser) {
          this.userService.getUser(authUser.uid).subscribe( (users: User[]) => {
            this.userService.setLoggedUser(users[0]);
            if (!users[0].verified) {
              this.router.navigate(['wait-confirm']);
              resolve(false)
            } else {
              resolve(true);
            }
          });
        } else {
          this.router.navigate(['login']);
          resolve(false);
        }
      });
    });
  }
}