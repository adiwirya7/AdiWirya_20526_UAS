import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/maps',
    pathMatch: 'full'
  },
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'friends',
        loadChildren: () => import('./friends/friends.module').then( m => m.FriendsPageModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule)
      },
      {
        path: 'maps',
        loadChildren: () => import('./maps/maps.module').then( m => m.MapsPageModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
