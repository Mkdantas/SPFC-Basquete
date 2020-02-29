import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReadmorePageRoutingModule } from './readmore-routing.module';

import { ReadmorePage } from './readmore.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReadmorePageRoutingModule
  ],
  declarations: [ReadmorePage]
})
export class ReadmorePageModule {}
