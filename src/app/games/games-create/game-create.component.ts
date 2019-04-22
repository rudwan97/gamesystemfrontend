import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, FormControlName } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';

import { GamesService } from '../games.service';
import { Game } from '../game.model';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-game-create',
  templateUrl: './game-create.component.html',
  styleUrls: ['./game-create.component.css']
})
export class GameCreateComponent implements OnInit, OnDestroy {
  enteredTitle = '';
  enteredGenre = '';
  enteredDeveloper = '';
  game: Game;
  isLoading = false;
  form: FormGroup;
  private mode = 'create';
  private gameId: string;
  private authStatusSub: Subscription;

  constructor(
    public gamesService: GamesService,
    public route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(authStatus => {
        this.isLoading = false;
      });
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      genre: new FormControl(null, { validators: [Validators.required] }),
      developer: new FormControl(null, { validators: [Validators.required] })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('gameId')) {
        this.mode = 'edit';
        this.gameId = paramMap.get('gameId');
        this.isLoading = true;
        this.gamesService.getGame(this.gameId).subscribe(gameData => {
          this.isLoading = false;
          this.game = {
            id: gameData._id,
            title: gameData.title,
            genre: gameData.genre,
            developer: gameData.developer.name,
            creator: gameData.creator
          };
          this.form.setValue({
            title: this.game.title,
            genre: this.game.genre,
            developer: this.game.developer
          });
        });
      } else {
        this.mode = 'create';
        this.gameId = null;
      }
    });
  }

  onSaveGame() {
    if (this.form.invalid) {
      console.log('Game form is invalid!');
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      console.log('Saving Game!');
      this.gamesService.addGame(
        this.form.value.title,
        this.form.value.genre,
        this.form.value.developer
      );
    } else {
      this.gamesService.updateGame(
        this.gameId,
        this.form.value.title,
        this.form.value.genre,
        this.form.value.developer
      );
    }
    this.form.reset();
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
