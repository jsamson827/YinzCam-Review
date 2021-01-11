import { Injectable } from '@angular/core';
import { IUsersResponse, User } from '../github.models'
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { MessageService } from './messages.service';

@Injectable({
    providedIn: 'root'
})
export class GitHubApiService {

    readonly githubApiUrl = 'https://api.github.com';

    readonly httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    constructor(
        private http: HttpClient,
        private messageService: MessageService
    ) { }

    getUsers(since: string = '0'): Observable<IUsersResponse> {
        let usersUrl = `${this.githubApiUrl}/users`;

        return this.http.get<User[]>(usersUrl, { params: { since }, observe: 'response' })
            .pipe(
                tap((res) =>
                    this.log('fetched Useres')
                ),
                map((res) => {
                    let link = res.headers.get('link');
                    link = link.slice(link.indexOf('=') + 1, link.indexOf('>'));

                    return {
                        link: link,
                        users: res.body
                    };
                }),
                catchError(this.handleError<IUsersResponse>('getUsers', {
                    link: '0',
                    users: []
                }))
            );
    }

    // getUserNo404<Data>(id: number): Observable<User> {
    //     const url = `${this.usersUrl}/?id=${id}`;
    //     return this.http.get<User[]>(url)
    //         .pipe(
    //             map(users => users[0]), // returns a {0|1} element array
    //             tap(h => {
    //                 const outcome = h ? `fetched` : `did not find`;
    //                 this.log(`${outcome} User id=${id}`);
    //             }),
    //             catchError(this.handleError<User>(`getUser id=${id}`))
    //         );
    // }

    // /** GET User by id. Will 404 if id not found */
    // getUser(id: number): Observable<User> {
    //     const url = `${this.usersUrl}/${id}`;
    //     return this.http.get<User>(url).pipe(
    //         tap(_ => this.log(`fetched user id=${id}`)),
    //         catchError(this.handleError<User>(`getUser id=${id}`))
    //     );
    // }

    /* GET Useres whose name contains search term */
    // searchUsers(term: string): Observable<User[]> {
    //     if (!term.trim()) {
    //         // if not search term, return empty User array.
    //         return of([]);
    //     }
    //     return this.http.get<User[]>(`${this.UsersUrl}/?name=${term}`).pipe(
    //         tap(x => x.length ?
    //             this.log(`found Users matching "${term}"`) :
    //             this.log(`no Users matching "${term}"`)),
    //         catchError(this.handleError<User[]>('searchUsers', []))
    //     );
    // }

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
