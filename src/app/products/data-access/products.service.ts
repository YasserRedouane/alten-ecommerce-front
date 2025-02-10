import { Injectable, inject, signal } from "@angular/core";
import { Product } from "./product.model";
import { HttpClient } from "@angular/common/http";
import {catchError, map, Observable, of, tap} from "rxjs";

@Injectable({
    providedIn: "root"
}) export class ProductsService {

    private readonly http = inject(HttpClient);
    private readonly path = "/api/products";

    private readonly _products = signal<Product[]>([]);
    private readonly _totalRecords = signal<number>(0);

    public readonly products = this._products.asReadonly();
    public readonly totalRecords = this._totalRecords.asReadonly();

  public get(page: number = 0, size: number = 5): Observable<{ data: Product[], total: number }> {
    return this.http.get<{ data: Product[], total: number }>(`${this.path}?page=${page}&size=${size}`).pipe(
      catchError(() => {
        return this.http.get<Product[]>("assets/products.json").pipe(
          map((products) => {
            const paginatedData = products.slice(page * size, (page + 1) * size);
            return {
              data: paginatedData,
              total: products.length
            };
          }),
          tap((response) => {
            this._products.set(response.data);
            this._totalRecords.set(response.total);
          })
        );
      }),
      tap((response) => {
        this._products.set(response.data);
        this._totalRecords.set(response.total);
      })
    );
  }

    public create(product: Product): Observable<boolean> {
        return this.http.post<boolean>(this.path, product).pipe(
            catchError(() => {
                return of(true);
            }),
            tap(() => this._products.update(products => [product, ...products])),
        );
    }

    public update(product: Product): Observable<boolean> {
        return this.http.patch<boolean>(`${this.path}/${product.id}`, product).pipe(
            catchError(() => {
                return of(true);
            }),
            tap(() => this._products.update(products => {
                return products.map(p => p.id === product.id ? product : p)
            })),
        );
    }

    public delete(productId: number): Observable<boolean> {
        return this.http.delete<boolean>(`${this.path}/${productId}`).pipe(
            catchError(() => {
                return of(true);
            }),
            tap(() => this._products.update(products => products.filter(product => product.id !== productId))),
        );
    }
}
