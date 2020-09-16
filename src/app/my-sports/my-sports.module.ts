import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MySportsPageRoutingModule } from './my-sports-routing.module';

import { MySportsPage } from './my-sports.page';
import { HeaderMenuPageModule } from '../header-menu/header-menu.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MySportsPageRoutingModule,
    HeaderMenuPageModule,
    FontAwesomeModule
  ],
  declarations: [MySportsPage]
})
export class MySportsPageModule {}
