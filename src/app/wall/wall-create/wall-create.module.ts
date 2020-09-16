import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WallCreatePageRoutingModule } from './wall-create-routing.module';

import { WallCreatePage } from './wall-create.page';
import { HeaderMenuPageModule } from 'src/app/header-menu/header-menu.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WallCreatePageRoutingModule,
    HeaderMenuPageModule
  ],
  declarations: [WallCreatePage]
})
export class WallCreatePageModule {}
