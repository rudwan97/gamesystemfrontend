import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { DeveloperCreateComponent } from './developers/developer-create/developer-create.component';
import { DeveloperListComponent } from './developers/developer-list/developer-list.component';
import { GameCreateComponent } from './games/games-create/game-create.component';
import { GameListComponent } from './games/games-list/game-list.component';
import { CharacterCreateComponent} from './characters/character-create/character-create.component';
import { CharacterListComponent} from './characters/character-list/character-list.component';

const routes: Routes = [
  { path: 'developer/create', component: DeveloperCreateComponent, canActivate: [AuthGuard]},
  { path: 'developer/edit/:developerId', component: DeveloperCreateComponent, canActivate: [AuthGuard]},
  { path: 'developers', component: DeveloperListComponent, canActivate: [AuthGuard]},
  { path: 'game/create', component: GameCreateComponent, canActivate: [AuthGuard]},
  { path: 'game/edit/:gameId', component: GameCreateComponent, canActivate: [AuthGuard]},
  { path: 'games', component: GameListComponent, canActivate: [AuthGuard]},
  { path: 'character/create', component: CharacterCreateComponent, canActivate: [AuthGuard]},
  { path: 'character/edit/:characterId', component: CharacterCreateComponent, canActivate: [AuthGuard]},
  { path: 'characters', component: CharacterListComponent, canActivate: [AuthGuard]},
  { path: 'auth', loadChildren: './auth/auth.module#AuthModule'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
