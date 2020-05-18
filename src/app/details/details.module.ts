import { NgModule } from '@angular/core';

import { DetailsPage } from './details.page';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DetailsPageRoutingModule } from './details-routing.module';
import { HeaderMenuPage } from '../header-menu/header-menu.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailsPageRoutingModule
  ],
  declarations: [DetailsPage, HeaderMenuPage]
})
export class DetailsPageModule {}
