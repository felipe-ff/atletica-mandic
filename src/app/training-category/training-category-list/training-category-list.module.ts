import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TrainingCategoryListPageRoutingModule } from './training-category-list-routing.module';

import { TrainingCategoryListPage } from './training-category-list.page';
import { HeaderMenuPageModule } from 'src/app/header-menu/header-menu.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TrainingCategoryListPageRoutingModule,
    HeaderMenuPageModule
  ],
  declarations: [TrainingCategoryListPage]
})
export class TrainingCategoryListPageModule {}
