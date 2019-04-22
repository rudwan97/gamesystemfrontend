import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';
import { Developer } from './developer.model';

const BACKEND_URL = environment.apiUrl + '/developers/';

@Injectable({ providedIn: 'root' })
export class DevelopersService {
  private developers: Developer[] = [];
  private developersUpdated = new Subject<{ developers: Developer[]; postCount: number }>();

  constructor(private http: HttpClient, private router: Router) {}

  getDevelopers(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; developers: any; maxDevelopers: number }>(
        BACKEND_URL + queryParams
      )
      .pipe(
        map(developerData => {
          return {
            developers: developerData.developers.map(developer => {
              return {
                name: developer.name,
                description: developer.description,
                id: developer._id,
                city: developer.city,
                creator: developer.creator
              };
            }),
            maxDevelopers: developerData.maxDevelopers
          };
        })
      )
      .subscribe(transformedPostData => {
        this.developers = transformedPostData.developers;
        this.developersUpdated.next({
          developers: [...this.developers],
          postCount: transformedPostData.maxDevelopers
        });
      });
  }

  getDeveloperUpdateListener() {
    return this.developersUpdated.asObservable();
  }

  getDeveloper(id: string) {
    return this.http.get<{
      _id: string;
      name: string;
      description: string;
      city: string;
      creator: string;
    }>(BACKEND_URL + id);
  }

  addDeveloper(name: string, description: string, city: string) {
    // let developerData = new FormData();
    // developerData.append('name', name);
    // developerData.append('description', description);
    // developerData.append('city', city);
    const developer = {
      'name': name,
      'description': description,
      'city': city
    };
    console.log(name + ' ' + description + ' ' + city);
    console.log(BACKEND_URL + ' ' + developer);
    this.http
      .post<{ message: string; developer: Developer }>(
        BACKEND_URL,
        developer
      )
      .subscribe(responseData => {
        this.router.navigate(['/developers']);
      });
  }

  updateDeveloper(id: string, name: string, description: string, city: string) {
    let developerData: Developer | FormData;
      developerData = {
        id: id,
        name: name,
        description: description,
        city: city,
        creator: null
      };

    this.http
      .put(BACKEND_URL + id, developerData)
      .subscribe(response => {
        this.router.navigate(['/developers']);
      });
  }

  deleteDeveloper(developerId: string) {
    return this.http.delete(BACKEND_URL + developerId);
  }
}
