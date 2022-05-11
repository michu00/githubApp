import { Repository } from './../core/models/repository.model';
import { RepositoriesService } from '../core/services/repositories.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-repo-list',
  templateUrl: './repo-list.component.html',
  styleUrls: ['./repo-list.component.scss']
})
export class RepoListComponent implements OnInit {
  repositories: Repository[] | null = [];
  username = sessionStorage.getItem("username") || '';
  repositoriesPerPage = 5;
  apiPages!: number;
  nextApiPage!: number;
  currentPage!: number;
  isReady: boolean = false;
  noRepos: boolean = false;

  constructor(
    protected repositoriesService: RepositoriesService,
    protected router: Router
  ) { }

  ngOnInit(): void {
      console.log(this.getRepositories());
      this.getRepositories();
      sessionStorage.setItem("username", this.username);
  }

  getRepositories() {
    return this.repositoriesService.getRepositories(this.username, this.repositoriesPerPage, this.currentPage).subscribe(
      (res) => {
        console.log(res.body![2]);

        if(res.headers.get('Link')!=null)
          this.trimHeaderPropertyLink(res.headers.get('Link'));

        this.repositories = res.body;
      },(error) => {
        this.router.navigate(['/no-user']);
      },()=>{

          if(this.repositories!.length==0)
              this.noRepos=true;

          this.isReady = true;
   })
  }

  getNextRepository(page: number) {
    this.repositoriesService.getRepositories(this.username, this.repositoriesPerPage, page).subscribe((res) => {
      this.repositories = res.body;
    });
  }

  getRepositoryInfo(repository: string): void {
    sessionStorage.setItem("repositoryName", repository);
    if(this.currentPage!=undefined)
        sessionStorage.setItem("currentPage", this.currentPage.toString());
    this.router.navigate(['/repository-details']);
  }

  trimHeaderPropertyLink(linkToTrim: string | null): void {
    if(linkToTrim!=null){
      let splitedString: Array<string> = linkToTrim.split(",");

      splitedString.forEach(element => {
          if(element.includes("next")) {
              let nextPage: string = '';
              for(let i=element.lastIndexOf("page=")+5; i<element.indexOf(">"); i++){
                nextPage += element[i];
              }
              this.nextApiPage = parseInt(nextPage);
          } else if(element.includes("last")) {
              let pagesCount: string = '';
              for(let i=element.lastIndexOf("page=")+5; i<element.indexOf(">"); i++){
                pagesCount += element[i];
              }
              this.apiPages = parseInt(pagesCount);
          }
       });
    }

    if(parseInt(sessionStorage.getItem("currentPage")!)){
        this.currentPage = parseInt(sessionStorage.getItem("currentPage")!);
    } else
        this.currentPage = this.nextApiPage-1;
  }

  nextPage(): void {
    if(this.currentPage < this.apiPages){
      this.currentPage++;
      this.getNextRepository(this.currentPage);
    }
  }

  previousPage(): void {
    if(this.currentPage>1){
      this.currentPage--;
      this.getNextRepository(this.currentPage);
    }
  }

  backToHome() {
    this.router.navigate(['/']);
  }
}
