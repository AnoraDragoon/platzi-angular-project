import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Credentials, Login, User } from 'src/app/models/user.interface';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent  {

  constructor(private auth: AuthService) { }

  loginUser(): void {
    const credentials: Credentials = {
      email: 'user@gmail.com',
      password: '12345'
    }
    this.auth.loginUser(credentials).subscribe((res: Login) => {
      localStorage.setItem('auth_token', res.access_token);
    });
  }

}
