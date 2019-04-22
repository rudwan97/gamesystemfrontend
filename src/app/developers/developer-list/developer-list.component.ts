import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material';
import { Subscription } from 'rxjs';

import { Developer } from '../developer.model';
import { DevelopersService } from '../developers.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-developer-list',
  templateUrl: './developer-list.component.html',
  styleUrls: ['./developer-list.component.css']
})
export class DeveloperListComponent implements OnInit, OnDestroy {
  developers: Developer[] = [];
  isLoading = false;
  totalPosts = 0;
  postsPerPage = 10;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  userIsAuthenticated = false;
  userId: string;
  private developersSub: Subscription;
  private authStatusSub: Subscription;

  constructor(
    public developerService: DevelopersService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.developerService.getDevelopers(this.postsPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.developersSub = this.developerService
      .getDeveloperUpdateListener()
      .subscribe((developerData: { developers: Developer[]; postCount: number }) => {
        this.isLoading = false;
        this.totalPosts = developerData.postCount;
        this.developers = developerData.developers;
        console.log(this.developers);
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
    this.developerService.getDevelopers(this.postsPerPage, this.currentPage);
  }

  onDelete(developerId: string) {
    this.isLoading = true;
    this.developerService.deleteDeveloper(developerId).subscribe(() => {
      this.developerService.getDevelopers(this.postsPerPage, this.currentPage);
    }, () => {
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.developersSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
