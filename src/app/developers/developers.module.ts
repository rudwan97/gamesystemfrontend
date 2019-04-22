import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { DeveloperCreateComponent } from './developer-create/developer-create.component';
import { DeveloperListComponent } from './developer-list/developer-list.component';
import { AngularMaterialModule } from '../angular-material.module';

@NgModule({
  declarations: [DeveloperCreateComponent, DeveloperListComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    RouterModule
  ]
})
export class DevelopersModule {}
