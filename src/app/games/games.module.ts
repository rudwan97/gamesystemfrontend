import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { GameCreateComponent } from './games-create/game-create.component';
import { GameListComponent } from './games-list/game-list.component';
import { AngularMaterialModule } from '../angular-material.module';

@NgModule({
  declarations: [GameCreateComponent, GameListComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    RouterModule
  ]
})
export class GamesModule {}
