import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Tab0Page } from './tab0.page';

const routes: Routes = [
  {
    path: '',
    component: Tab0Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Tab0PageRoutingModule {}
