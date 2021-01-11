import { Component, OnInit, Input } from '@angular/core';
import { User } from '../github.models';
import { Followers } from '../github.models';
import { UserService} from "../services/user.service";
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {
  @Input() user: User;
  followers: User[];

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private location: Location) { }

  ngOnInit(): void{
    this.getUserNo404();
    this.getFollowers();
  }

  getUserNo404(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    // const login = +this.route.snapshot.params.login;
    const path = location.pathname.split('/');
    const login = path[2]
    console.log(location)
    console.log(typeof(login));
    this.userService.getUser(login)
      .subscribe(user => this.user = user);
  }

getFollowers():void{
  const login = location.pathname.split('/')
  const path = 'https://api.github.com/users/'+login[2] + '/followers';
    
    // const login =this.user.followers_url
  this.userService.getFollowers(path)
      .subscribe(followers => this.followers = followers);
}
  goBack(): void {
    this.location.back();
  }
}
