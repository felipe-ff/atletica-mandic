import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WallPageRoutingModule } from './wall-routing.module';

import { WallPage } from './wall.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WallPageRoutingModule
  ],
  declarations: [WallPage]
})
export class WallPageModule {}
