// cart.service.ts
import { Injectable, Output } from '@angular/core';
import { Product } from 'app/products/data-access/product.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
    private cart: Product[] = [];
    private isCartVisible = new BehaviorSubject<boolean>(false);
    private cartQuantity = new BehaviorSubject<number>(0);
  
    constructor() {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        this.cart = JSON.parse(storedCart);
        this.cartQuantity.next(this.cart.length);
      }
    }
  
    // Toggle cart visibility
    toggleCartVisibility(): void {
      const currentState = this.isCartVisible.value;
      this.isCartVisible.next(!currentState);
    }
  
    // Observable to watch cart visibility state
    getCartVisibility() {
      return this.isCartVisible.asObservable();
    }

    getCartQuantity() {
        return this.cartQuantity.asObservable();
    }
  
    addToCart(product: Product): void {
        this.cart.push(product);
        this.saveCart();
        this.cartQuantity.next(this.cart.length); 
    }
  
    removeFromCart(product: Product): void {
        const index = this.cart.findIndex((p) => p.id === product.id);
        if (index > -1) {
          this.cart.splice(index, 1);
          this.saveCart();
          this.cartQuantity.next(this.cart.length); // Update quantity
        }
      }
    
      getCartItems(): Product[] {
        return [...this.cart]; // Return a copy of the cart
      }
    
      private saveCart(): void {
        localStorage.setItem('cart', JSON.stringify(this.cart));
      }
  }
