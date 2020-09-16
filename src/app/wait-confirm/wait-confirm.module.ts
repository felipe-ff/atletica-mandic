import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WaitConfirmPageRoutingModule } from './wait-confirm-routing.module';

import { WaitConfirmPage } from './wait-confirm.page';
import { HeaderMenuPageModule } from '../header-menu/header-menu.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WaitConfirmPageRoutingModule,
    HeaderMenuPageModule
  ],
  declarations: [WaitConfirmPage]
})
export class WaitConfirmPageModule {}
