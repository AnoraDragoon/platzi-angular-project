import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Credentials, Login } from '../models/user.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${environment.API_URL}/api/auth`;


  constructor(private http: HttpClient) { }

  loginUser(credentials: Credentials): Observable<Login>{
    return this.http.post<Login>('https://example.com/api/login', credentials);
  }

}
