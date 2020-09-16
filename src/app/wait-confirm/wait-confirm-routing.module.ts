import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WaitConfirmPage } from './wait-confirm.page';

const routes: Routes = [
  {
    path: '',
    component: WaitConfirmPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WaitConfirmPageRoutingModule {}
