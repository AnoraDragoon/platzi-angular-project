import { Component, OnInit } from '@angular/core';

import { UsersService } from './services/users.service';
import { FilesService } from './services/files.service';
import { AuthService } from './services/auth.service';
import { TokenService } from './services/token.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  // template: '<button (click)="createUser()">Create User</button><router-outlet></router-outlet>',
  template: '<router-outlet></router-outlet>',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  // imgParent = '';
  // showImg = true;
  // token: string = '';
  imgRta: string = '';


  constructor(
    private usersService: UsersService,
    private filesService: FilesService,
    private authService: AuthService,
    private tokenService: TokenService
  ) { }

  ngOnInit(): void {
    const token = this.tokenService.getToken();
    if (token) {
      this.authService.getProfile().subscribe();
    }
  }

  onLoaded(img: string) {
    console.log('log padre', img);
  }

  // toggleImg() {
  //   this.showImg = !this.showImg;
  // }

  createUser() {
    this.usersService.create({
      name: 'Sebas',
      email: 'sebas@mail.com',
      password: '1212',
      // role: 'customer'
    })
      .subscribe(rta => {
        console.log(rta);
      });
  }

  downloadPdf() {
    this.filesService.getFile(
      'my.pdf',
      `${environment.API_URL}/api/files/dummy.pdf`,
      'application/pdf'
    ).subscribe();
  }

  onUpload(event: Event) {
    const element = event.target as HTMLInputElement;
    const file = element.files?.item(0);
    if (file) {
      this.filesService.uploadFile(file).subscribe(
        response => { this.imgRta = response.location }
      )
    }
  }

}
