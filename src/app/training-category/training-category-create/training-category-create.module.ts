import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TrainingCategoryCreatePageRoutingModule } from './training-category-create-routing.module';

import { TrainingCategoryCreatePage } from './training-category-create.page';
import { HeaderMenuPageModule } from 'src/app/header-menu/header-menu.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TrainingCategoryCreatePageRoutingModule,
    HeaderMenuPageModule
  ],
  declarations: [TrainingCategoryCreatePage]
})
export class TrainingCategoryCreatePageModule {}
