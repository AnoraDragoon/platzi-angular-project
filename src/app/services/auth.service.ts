import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { switchMap, tap } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { User } from '../models/user.model';
import { Auth } from '../models/auth.model';
import { TokenService } from './token.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${environment.API_URL}/api/auth`;
  private user: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  user$: Observable<User | null> = this.user.asObservable();


  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) { }

  login(email: string, password: string) {
    return this.http.post<Auth>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(response => this.tokenService.saveToken(response.access_token))
      );
  }

  getProfile() {
    // const headers = new HttpHeaders();
    // headers.set('Authorization',  `Bearer ${token}`);
    return this.http.get<User>(`${this.apiUrl}/profile`, {
      // headers: {
      //   Authorization: `Bearer ${token}`
      //   // 'Content-type': 'application/json'
      // }
    }).pipe(tap(user => this.user.next(user)));
  }

  loginAndGet(email: string, password: string) {
    return this.login(email, password).pipe(
      switchMap(() => this.getProfile())
    );
  }

  logout() {
    this.tokenService.removeToken();
    this.user.next(null);
  }
}
