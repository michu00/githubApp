import { RepoDetail } from '../core/models/repo-detail.model';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RepositoriesService } from '../core/services/repositories.service';

@Component({
  selector: 'app-repo-details',
  templateUrl: './repo-details.component.html',
  styleUrls: ['./repo-details.component.scss']
})
export class RepoDetailsComponent {
  username: string = sessionStorage.getItem("username") || '';
  repositoryName: string = sessionStorage.getItem("repositoryName") || '';
  repoDetailsFromApi!: object;
  repoDetails: RepoDetail[] = [];
  percentValueStyle: any;
  displayRepo!: boolean;

  constructor(
    protected repositoriesService: RepositoriesService,
    protected router: Router
  ) { }

  ngOnInit(): void {
    this.getRepositoryDetails();
  }

  backToListOfRepos() {
    this.router.navigate(['/repositories']);
  }

  getRepositoryDetails() {
    this.repositoriesService.getRepositoryDetails(this.username, this.repositoryName)
    .toPromise().then(data => {
        this.repoDetailsFromApi = JSON.parse(JSON.stringify(data));
    }).then(()=>{
      if(Object.keys(this.repoDetailsFromApi).length!=0){
        this.createRepoDetails(this.repoDetailsFromApi);
        this.displayRepo = true;
      } else
        this.displayRepo = false;
    });
  }

  createRepoDetails(json: object){
    let i=0;
    let colorArray = ['#69CFA7', '#7A32BA', '#BA527D', '#586CED', '#C279CB', '#984763','#F4835F','#73BEEB', '#9DD29C', '#FCD154'];
    for(const element in json) {
        // colorArray.push('rgb(' + Math.floor(Math.random()*256) +','+ Math.floor(Math.random()*256)  +',' + Math.floor(Math.random()*256)  +')');
        const totalBytes = Object.values(json).reduce((a,b) => {return a+b});
        const percentage = Object.values(json)[i] / totalBytes * 100;
        this.repoDetails.push(new RepoDetail(Object.keys(json)[i], parseFloat(percentage.toFixed(1)), colorArray.pop()));
        i++;
    }
  }

  goHome(): void{
    this.router.navigate(['/home']);
  }
}
