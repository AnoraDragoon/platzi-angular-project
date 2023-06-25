import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { StoreService } from '../../../services/store.service'
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user.model';
import { Category } from 'src/app/models/category.model';
import { CategoriesService } from 'src/app/services/categories.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  activeMenu = false;
  counter = 0;
  profile: User | null = null;
  categories: Category[] = [];

  constructor(
    private router: Router,
    private storeService: StoreService,
    private authService: AuthService,
    private categoriesService: CategoriesService
  ) { }

  ngOnInit(): void {
    this.storeService.myCart$.subscribe(products => {
      this.counter = products.length;
    });
    this.getAllCategories();
  }

  toggleMenu() {
    this.activeMenu = !this.activeMenu;
  }

  login() {
    this.authService.loginAndGet('sebas@mail.com', '1212')
      .subscribe(() => {
        this.router.navigate(['/profile']);
      });
  }

  getAllCategories(){
    this.categoriesService.getAll().subscribe(data => {
      this.categories = data;
    })
  }

  logout():void {
    this.authService.logout();
    this.profile = null;
    this.router.navigate(['/home']);
  }
}
