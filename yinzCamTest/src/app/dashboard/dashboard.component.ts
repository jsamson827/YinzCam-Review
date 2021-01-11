import { Component, OnInit } from '@angular/core';
import { User } from '../github.models'
import { UserService } from '../services/user.service'
import { GitHubApiService } from '../services/github.api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  link: string;
  users: User[] = [];

  constructor(private gitHubApiService: GitHubApiService) { }

  ngOnInit(): void {
    this.gitHubApiService.getUsers()
      .subscribe(response => {
        this.link = response.link;
        this.users = response.users;
      });
  }

  getMoreUsers(): void {
    this.gitHubApiService.getUsers(this.link).subscribe(
      response => {
        this.link = response.link;
        this.users = this.users.concat(response.users);
      }
    )
  }

  //TODO - add search function here

  //TODO - add filter function here
}
