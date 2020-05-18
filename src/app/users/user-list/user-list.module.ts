import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { UserListPage } from './user-list.page';
import { HeaderMenuPage } from 'src/app/header-menu/header-menu.page';

const routes: Routes = [
  {
    path: '',
    component: UserListPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [UserListPage, HeaderMenuPage]
})
export class UserListPageModule {}
