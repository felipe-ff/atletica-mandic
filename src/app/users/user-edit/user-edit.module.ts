import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserEditPage } from './user-edit.page';
import { HeaderMenuPageModule } from 'src/app/header-menu/header-menu.module';
import { UserEditPageRoutingModule } from './user-edit-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserEditPageRoutingModule,
    HeaderMenuPageModule
  ],
  declarations: [UserEditPage]
})
export class UserEditPageModule {}
