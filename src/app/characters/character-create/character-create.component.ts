import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, FormControlName } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';

import { CharactersService } from '../character.service';
import { Character } from '../character.model';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-character-create',
  templateUrl: './character-create.component.html',
  styleUrls: ['./character-create.component.css']
})
export class CharacterCreateComponent implements OnInit, OnDestroy {
  enteredName = '';
  enteredGame = '';
  character: Character;
  isLoading = false;
  form: FormGroup;
  private mode = 'create';
  private characterId: string;
  private authStatusSub: Subscription;

  constructor(
    public charactersService: CharactersService,
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
      name: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      game: new FormControl(null, { validators: [Validators.required] })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('characterId')) {
        this.mode = 'edit';
        this.characterId = paramMap.get('characterId');
        this.isLoading = true;
        this.charactersService.getCharacter(this.characterId).subscribe(characterData => {
          this.isLoading = false;
          this.character = {
            id: characterData._id,
            name: characterData.name,
            game: characterData.game.title,
            creator: characterData.creator
          };
          this.form.setValue({
            name: this.character.name,
            game: this.character.game,
          });
        });
      } else {
        this.mode = 'create';
        this.characterId = null;
      }
    });
  }

  onSaveCharacter() {
    if (this.form.invalid) {
      console.log('Character form is invalid!');
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      console.log('Saving Character!');
      this.charactersService.addCharacter(
        this.form.value.name,
        this.form.value.game
      );
    } else {
      this.charactersService.updateCharacter(
        this.characterId,
        this.form.value.name,
        this.form.value.game
      );
    }
    this.form.reset();
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
