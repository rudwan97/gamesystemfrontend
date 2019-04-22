import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';
import { Character } from './character.model';
import { Game } from '../games/game.model';

const BACKEND_URL = environment.apiUrl + '/characters/';

@Injectable({ providedIn: 'root' })
export class CharactersService {
  private characters: Character[] = [];
  private charactersUpdated = new Subject<{ characters: Character[]; postCount: number }>();

  constructor(private http: HttpClient, private router: Router) {}

  getCharacters(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; characters: any; maxCharacters: number }>(
        BACKEND_URL + queryParams
      )
      .pipe(
        map(characterData => {
          return {
            characters: characterData.characters.map(character => {
              return {
                id: character._id,
                name: character.name,
                game: character.game.title,
                creator: character.creator
              };
            }),
            maxCharacters: characterData.maxCharacters
          };
        })
      )
      .subscribe(transformedCharacterData => {
        this.characters = transformedCharacterData.characters;
        this.charactersUpdated.next({
          characters: [...this.characters],
          postCount: transformedCharacterData.maxCharacters
        });
      });
  }

  getCharacterUpdateListener() {
    return this.charactersUpdated.asObservable();
  }

  getCharacter(id: string) {
    return this.http.get<{
      _id: string;
      name: string;
      game: Game;
      creator: string;
    }>(BACKEND_URL + id);
  }

  addCharacter(name: string, game: string) {
    // const characterData = new FormData();
    // characterData.append('name', name);
    // characterData.append('game', game);
    const character = {
      'name': name,
      'game': game
    };
    console.log(name + ' ' + game);
    this.http
      .post<{ message: string; character: Character }>(
        BACKEND_URL,
        character
      )
      .subscribe(responseData => {
        this.router.navigate(['/characters']);
      });
  }

  updateCharacter(id: string, name: string, game: string) {
    let characterData: Character | FormData;
    characterData = {
        id: id,
        name: name,
        game: game,
        creator: null
    };
    console.log('Update character information: ' + characterData);
    this.http
      .put(BACKEND_URL + id, characterData)
      .subscribe(response => {
        this.router.navigate(['/characters']);
      });
  }

  deleteCharacter(characterId: string) {
    return this.http.delete(BACKEND_URL + characterId);
  }
}
