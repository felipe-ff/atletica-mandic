import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TrainingsPage } from './trainings.page';

const routes: Routes = [
  {
    path: '',
    component: TrainingsPage
  },  {
    path: 'attendance',
    loadChildren: () => import('./attendance/attendance.module').then( m => m.AttendancePageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrainingsPageRoutingModule {}
