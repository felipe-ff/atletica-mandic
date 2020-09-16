import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WallListPage } from './wall-list.page';

const routes: Routes = [
  {
    path: '',
    component: WallListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WallListPageRoutingModule {}
