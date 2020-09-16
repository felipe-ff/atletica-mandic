import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WallListPageRoutingModule } from './wall-list-routing.module';

import { WallListPage } from './wall-list.page';
import { HeaderMenuPageModule } from 'src/app/header-menu/header-menu.module';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { HideElementDirective } from './hide-element.directive';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WallListPageRoutingModule,
    HeaderMenuPageModule
  ],
  declarations: [WallListPage, HideElementDirective],
  providers: [ PhotoViewer ]
})
export class WallListPageModule {}
