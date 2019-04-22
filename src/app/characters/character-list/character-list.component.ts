import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material';
import { Subscription } from 'rxjs';

import { Character } from '../character.model';
import { CharactersService } from '../character.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-character-list',
  templateUrl: './character-list.component.html',
  styleUrls: ['./character-list.component.css']
})
export class CharacterListComponent implements OnInit, OnDestroy {
  characters: Character[] = [];
  isLoading = false;
  totalPosts = 0;
  postsPerPage = 10;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  userIsAuthenticated = false;
  userId: string;
  private charactersSub: Subscription;
  private authStatusSub: Subscription;

  constructor(
    public charactersService: CharactersService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.charactersService.getCharacters(this.postsPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.charactersSub = this.charactersService
      .getCharacterUpdateListener()
      .subscribe((characterData: { characters: Character[]; postCount: number }) => {
        this.isLoading = false;
        this.totalPosts = characterData.postCount;
        this.characters = characterData.characters;
        console.log(this.totalPosts);
        console.log(this.characters);
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
    this.charactersService.getCharacters(this.postsPerPage, this.currentPage);
  }

  onDelete(characterId: string) {
    this.isLoading = true;
    this.charactersService.deleteCharacter(characterId).subscribe(() => {
      this.charactersService.getCharacters(this.postsPerPage, this.currentPage);
    }, () => {
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.charactersSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
