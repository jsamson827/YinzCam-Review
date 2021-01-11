export interface IUsersResponse {
  link: string;
  users: User[];
}

export interface User {

  login: string;
  id: number;
  avatar_url: string;
  followers_url: string;
  name: string;
  repos_url: string
  
  }

  export interface Followers {

    login: string;
    id: number;
       
    }