import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WallCreatePage } from './wall-create.page';

const routes: Routes = [
  {
    path: '',
    component: WallCreatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WallCreatePageRoutingModule {}
