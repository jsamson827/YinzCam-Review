import { Injectable } from '@angular/core';
import { User} from '../github.models'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { MessageService } from './messages.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private usersUrl = 'https://api.github.com/users?since=0';
  private userUrl = 'https://api.github.com/users';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
 
 

  constructor(
    
    private http: HttpClient,
    private messageService: MessageService
    ) { }

  // getUsers(): Observable<User[]> {
  //   // TODO: send the message _after_ fetching the users
  //   this.messageService.add('userService: fetched users');
  //   return of(USERS);
  // }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.usersUrl)
      .pipe(
        tap(_ => this.log('fetched Useres')),
        catchError(this.handleError<User[]>('getUsers', []))
      );
  }
  
  getUserNo404<Data>(login: string): Observable<User> {
    const url = `${this.userUrl}/${login}`;
    return this.http.get<User[]>(url)
      .pipe(
        map(users => users[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} User login=${login}`);
        }),
        catchError(this.handleError<User>(`getUser login=${login}`))
      );
  }

  /** GET User by login. Will 404 if login not found */
  getUser(login: string): Observable<User> {
    const url = `${this.userUrl}/${login}`;
    return this.http.get<User>(url).pipe(
      tap(_ => this.log(`fetched user login=${login}`)),
      catchError(this.handleError<User>(`getUser login=${login}`))
    );
  }
  // getFollowers(login: string): Observable<User[]> {
  //   const url = `${this.userUrl}/${login}/followers`;
  //   return this.http.get<User[]>(url).pipe(
  //     tap(_ => this.log(`fetched user login=${login}`)),
  //     catchError(this.handleError<User>(`getUser login=${login}`))
  //   );
  // }

  getFollowers(login: string): Observable<User[]> {
    return this.http.get<User[]>(login)
      .pipe(
        tap(_ => this.log('fetched Users')),
        catchError(this.handleError<User[]>('getFollowers', []))
      );
  }
  /* GET Useres whose name contains search term */
  searchUsers(term: string): Observable<User[]> {
    if (!term.trim()) {
      // if not search term, return empty User array.
      return of([]);
    }
    return this.http.get<User[]>(`${this.usersUrl}/?name=${term}`).pipe(
      tap(x => x.length ?
         this.log(`found Users matching "${term}"`) :
         this.log(`no Users matching "${term}"`)),
      catchError(this.handleError<User[]>('searchUsers', []))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a UserService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`UserService: ${message}`);
  }

  

}
