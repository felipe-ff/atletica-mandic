import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivate } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoggedGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate(): Promise<boolean> {
    return new Promise(resolve => {
      this.authService.getAuth().onAuthStateChanged(user => {
        this.authService.getCurrentUser().then(currentUser => {
          if (user && currentUser?.emailVerified) {
            this.router.navigate(['tabs']);
            resolve(false);
          } else {
            resolve(true);
          }
        });
      });
    });
  }
}