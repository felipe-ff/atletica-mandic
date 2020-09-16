import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { Role } from '../enums/role.enum';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  isDirector() {
    return !!this.userService.loggedUser.teaches;
  }

}
