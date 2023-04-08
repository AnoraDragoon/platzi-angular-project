import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { retry, catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

import { environment } from 'src/environments/environment';
import { CreateProductDTO, Product, UpdateProductDTO } from './../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private readonly apiUrl = `${environment.API_URL}/api/products`;

  constructor(
    private http: HttpClient
  ) { }

  getAllProducts(limit?: number, offset?: number) {
    let params = new HttpParams();
    if (limit && offset) {
      params = params.set('limit', limit);
      params = params.set('offset', offset);
    }
    return this.http.get<Product[]>(this.apiUrl, { params })
      .pipe(
        retry(3),
        map(products => products.map(item => {
          return {
            ...item,
            taxes: .19 * item.price
          };
        }))
      );
  }

  getProduct(id: string) {
    return this.http.get<Product>(`${this.apiUrl}/${id}`)
      .pipe(catchError((error: HttpErrorResponse) => {
        return this.handleErrors(error);
      }));
  }

  getProductsByPage(limit: number, offset: number = 0) {
    return this.http.get<Product[]>(this.apiUrl, { params: { limit, offset } });
  }

  create(dto: CreateProductDTO) {
    return this.http.post<Product>(this.apiUrl, dto);
  }

  update(id: string, dto: UpdateProductDTO) {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: string) {
    return this.http.delete<boolean>(`${this.apiUrl}/${id}`);
  }

  private handleErrors(error: HttpErrorResponse): Observable<never> {
    if (error.status == HttpStatusCode.Forbidden)
      return throwError('No tiene permisos para realizar la solicitud.');
    if (error.status == HttpStatusCode.NotFound)
      return throwError('El producto no existe.');
    if (error.status == HttpStatusCode.InternalServerError)
      return throwError('Error en el servidor.');
    return throwError('Un error inesperado ha ocurrido.');
  }
}
