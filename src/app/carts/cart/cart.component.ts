import { Component } from '@angular/core';
import { Product } from 'app/products/data-access/product.model';
import { CartService } from '../data-access/carts.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  cartItems: Product[] = [];
  cartVisible = false;

  constructor(private cartService: CartService) {
    this.cartItems = this.cartService.getCartItems();

    // Subscribe to cart visibility changes
    this.cartService.getCartVisibility().subscribe((visible) => {
      this.cartVisible = visible;
    });
  }

  // Remove a product from the cart
  removeProduct(product: Product): void {
    this.cartService.removeFromCart(product);
    this.cartItems = this.cartService.getCartItems();
  }

  // Close the cart
  closeCart(): void {
    this.cartService.toggleCartVisibility();
  }
}