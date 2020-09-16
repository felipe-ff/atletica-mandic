import { NgModule } from '@angular/core';

import { DetailsPage } from './details.page';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DetailsPageRoutingModule } from './details-routing.module';
import { HeaderMenuPageModule } from '../header-menu/header-menu.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailsPageRoutingModule,
    HeaderMenuPageModule,
    FontAwesomeModule
  ],
  declarations: [DetailsPage]
})
export class DetailsPageModule {}
