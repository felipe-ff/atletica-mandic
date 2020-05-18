import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HeaderMenuPageRoutingModule } from './header-menu-routing.module';

import { HeaderMenuPage } from './header-menu.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HeaderMenuPageRoutingModule
  ],
  declarations: [HeaderMenuPage],
  exports: [ HeaderMenuPage ]
})
export class HeaderMenuPageModule {}
