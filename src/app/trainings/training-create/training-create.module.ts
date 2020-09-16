import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TrainingCreatePageRoutingModule } from './training-create-routing.module';

import { TrainingCreatePage } from './training-create.page';
import { HeaderMenuPageModule } from 'src/app/header-menu/header-menu.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TrainingCreatePageRoutingModule,
    HeaderMenuPageModule
  ],
  declarations: [TrainingCreatePage]
})
export class TrainingCreatePageModule {}
