import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TrainingCategoryListPage } from './training-category-list.page';

const routes: Routes = [
  {
    path: '',
    component: TrainingCategoryListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrainingCategoryListPageRoutingModule {}
