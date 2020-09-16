import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { UserListPage } from './user-list.page';
import { UserListPageRoutingModule } from './user-list-routing.module';
import { HeaderMenuPageModule } from 'src/app/header-menu/header-menu.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserListPageRoutingModule,
    HeaderMenuPageModule
  ],
  declarations: [UserListPage]
})
export class UserListPageModule {}
