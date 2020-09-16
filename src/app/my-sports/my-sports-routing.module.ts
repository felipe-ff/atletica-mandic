import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MySportsPage } from './my-sports.page';

const routes: Routes = [
  {
    path: '',
    component: MySportsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MySportsPageRoutingModule {}
