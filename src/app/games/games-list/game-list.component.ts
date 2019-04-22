import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material';
import { Subscription } from 'rxjs';

import { Game } from '../game.model';
import { GamesService } from '../games.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.css']
})
export class GameListComponent implements OnInit, OnDestroy {
  games: Game[] = [];
  isLoading = false;
  totalPosts = 0;
  postsPerPage = 10;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  userIsAuthenticated = false;
  userId: string;
  private gamesSub: Subscription;
  private authStatusSub: Subscription;

  constructor(
    public gamesService: GamesService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.gamesService.getGames(this.postsPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.gamesSub = this.gamesService
      .getGameUpdateListener()
      .subscribe((gameData: { games: Game[]; postCount: number }) => {
        this.isLoading = false;
        this.totalPosts = gameData.postCount;
        this.games = gameData.games;
        console.log(this.totalPosts);
        console.log(this.games);
      });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.gamesService.getGames(this.postsPerPage, this.currentPage);
  }

  onDelete(gameId: string) {
    this.isLoading = true;
    this.gamesService.deleteGame(gameId).subscribe(() => {
      this.gamesService.getGames(this.postsPerPage, this.currentPage);
    }, () => {
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.gamesSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
