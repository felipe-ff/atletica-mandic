import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TrainingListPageRoutingModule } from './training-list-routing.module';

import { TrainingListPage } from './training-list.page';
import { HeaderMenuPageModule } from 'src/app/header-menu/header-menu.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TrainingListPageRoutingModule,
    HeaderMenuPageModule,
    FontAwesomeModule
  ],
  declarations: [TrainingListPage]
})
export class TrainingListPageModule {}
