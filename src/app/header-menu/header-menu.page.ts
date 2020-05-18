import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-menu',
  templateUrl: './header-menu.page.html',
  styleUrls: ['./header-menu.page.scss'],
})
export class HeaderMenuPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  navigateToProfilePage() {
    this.router.navigate(['profile-edit']);
  }

}
