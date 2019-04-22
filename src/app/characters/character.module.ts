import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CharacterCreateComponent } from './character-create/character-create.component';
import { CharacterListComponent } from './character-list/character-list.component';
import { AngularMaterialModule } from '../angular-material.module';

@NgModule({
  declarations: [CharacterCreateComponent, CharacterListComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    RouterModule
  ]
})
export class CharactersModule {}
