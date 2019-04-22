import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';
import { Game } from './game.model';
import { Developer } from '../developers/developer.model';

const BACKEND_URL = environment.apiUrl + '/games/';
const BACKEND_URL_DEVELOPERS = environment.apiUrl + '/games/developer/';

@Injectable({ providedIn: 'root' })
export class GamesService {
  private games: Game[] = [];
  private gamesUpdated = new Subject<{ games: Game[]; postCount: number }>();

  constructor(private http: HttpClient, private router: Router) {}

  getGames(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; games: any; maxGames: number }>(
        BACKEND_URL + queryParams
      )
      .pipe(
        map(gameData => {
          return {
            games: gameData.games.map(game => {
              return {
                id: game._id,
                title: game.title,
                genre: game.genre,
                developer: game.developer.name,
                creator: game.creator
              };
            }),
            maxGames: gameData.maxGames
          };
        })
      )
      .subscribe(transformedGameData => {
        this.games = transformedGameData.games;
        this.gamesUpdated.next({
          games: [...this.games],
          postCount: transformedGameData.maxGames
        });
      });
  }

  getGameUpdateListener() {
    return this.gamesUpdated.asObservable();
  }

  getGame(id: string) {
    return this.http.get<{
      _id: string;
      title: string;
      genre: string;
      developer: Developer;
      creator: string;
    }>(BACKEND_URL + id);
  }

  addGame(title: string, genre: string, developer: string) {
    // const gameData = new FormData();
    // gameData.append('title', title);
    // gameData.append('genre', genre);
    // gameData.append('developer', developer);
    const game = {
      'title': title,
      'genre': genre,
      'developer': developer
    };

    console.log(title + ' ' + genre + ' ' + developer);
    this.http
      .post<{ message: string; game: Game }>(
        BACKEND_URL,
        game
      )
      .subscribe(responseData => {
        this.router.navigate(['/games']);
      });
  }

  updateGame(id: string, title: string, genre: string, developer: string) {
    let gameData: Game | FormData;
      gameData = {
        id: id,
        title: title,
        genre: genre,
        developer: developer,
        creator: null
      };

    this.http
      .put(BACKEND_URL + id, gameData)
      .subscribe(response => {
        this.router.navigate(['/games']);
      });
  }

  deleteGame(gameId: string) {
    return this.http.delete(BACKEND_URL + gameId);
  }
}
