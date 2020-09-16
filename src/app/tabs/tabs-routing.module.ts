import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { AuthGuard } from '../guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'wall',
        loadChildren: () => import('../wall/wall-list/wall-list.module').then( m => m.WallListPageModule),
        canActivate: [AuthGuard],
        children: [
          {
            path: '',
            redirectTo: 'wall-list'
          },
          {
            path: 'wall-list',
            loadChildren: () => import('../wall/wall-list/wall-list.module').then( m => m.WallListPageModule),
          },
          {
            path: 'wall-create',
            loadChildren: () => import('../wall/wall-create/wall-create.module').then( m => m.WallCreatePageModule),
          },
          {
            path: 'wall-create/:id',
            loadChildren: () => import('../wall/wall-create/wall-create.module').then( m => m.WallCreatePageModule),
          }
        ]
      },
      {
        path: 'users',
        loadChildren: () => import('../trainings/trainings.module').then( m => m.TrainingsPageModule),
        canActivate: [AuthGuard],
        children: [
          {
            path: '',
            redirectTo: 'user-list'
          },
          {
            path: 'user-list',
            loadChildren: () => import('../users/user-list/user-list.module').then( m => m.UserListPageModule),
          },
          {
            path: 'user-edit/:id',
            loadChildren: () => import('../users/user-edit/user-edit.module').then( m => m.UserEditPageModule),
          }
        ]
      },
      {
        path: 'trainings',
        loadChildren: () => import('../trainings/trainings.module').then( m => m.TrainingsPageModule),
        canActivate: [AuthGuard],
        children: [
          {
            path: '',
            redirectTo: 'training-list'
          },
          {
            path: 'training-list',
            loadChildren: () => import('../trainings/training-list/training-list.module').then( m => m.TrainingListPageModule),
          },
          {
            path: 'training-create',
            loadChildren: () => import('../trainings/training-create/training-create.module').then( m => m.TrainingCreatePageModule),
          },
          {
            path: 'training-create/:id',
            loadChildren: () => import('../trainings/training-create/training-create.module').then( m => m.TrainingCreatePageModule),
          },
          {
            path: 'training-attendance/:id',
            loadChildren: () => import('../trainings/attendance/attendance.module').then( m => m.AttendancePageModule)
          }
        ]
      },

      {
        path: 'training-category-list',
        loadChildren: () => import('../training-category/training-category-list/training-category-list.module').then( m => m.TrainingCategoryListPageModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'training-category-create',
        loadChildren: () => import('../training-category/training-category-create/training-category-create.module').then( m => m.TrainingCategoryCreatePageModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'training-category-list',
        loadChildren: () => import('../training-category/training-category-list/training-category-list.module').then( m => m.TrainingCategoryListPageModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'training-category-create',
        loadChildren: () => import('../training-category/training-category-create/training-category-create.module').then( m => m.TrainingCategoryCreatePageModule),
        canActivate: [AuthGuard]
      },

      {
        path: 'my-sports',
        loadChildren: () => import('../my-sports/my-sports.module').then( m => m.MySportsPageModule)
      },
      {
        path: 'profile-edit',
        loadChildren: () => import('../details/details.module').then( m => m.DetailsPageModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'notifications',
        loadChildren: () => import('../notifications/notifications.module').then( m => m.NotificationsPageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/wall/wall-list',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/wall/wall-list',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
