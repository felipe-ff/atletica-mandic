import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TrainingCategoryCreatePage } from './training-category-create.page';

const routes: Routes = [
  {
    path: '',
    component: TrainingCategoryCreatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrainingCategoryCreatePageRoutingModule {}
