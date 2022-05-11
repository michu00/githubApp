import { Repository } from './../models/repository.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RepositoriesService {
  constructor(private http: HttpClient) { }

  private repositoryUrl = 'https://api.github.com/users';
  private repositoryDetailsUrl = 'https://api.github.com/repos';

  myToken = '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';
  tokenAuth = { 'Authorization': 'Bearer ' + this.myToken };

  header = this.myToken=='' ? {} : this.tokenAuth;

  getRepositories(user: string, per_page: number, page: number): Observable<HttpResponse<Repository[]>> {
    return this.http.get<Repository[]>(
      this.repositoryUrl + '/' + user + '/repos?per_page=' + per_page + '&page=' + page, { observe: 'response', headers: this.header });
  }

  getRepositoryDetails(user: string, repositoryName: string): Observable<string> {
    return this.http.get<string>(this.repositoryDetailsUrl + '/' + user + "/" + repositoryName + '/languages', { headers: this.header });
  }
}
