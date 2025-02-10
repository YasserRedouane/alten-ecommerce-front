import {CommonModule} from "@angular/common";
import {Component, OnInit, inject, signal} from "@angular/core";
import {CartService} from "app/carts/data-access/carts.service";
import {Product} from "app/products/data-access/product.model";
import {ProductsService} from "app/products/data-access/products.service";
import {ProductFormComponent} from "app/products/ui/product-form/product-form.component";
import {ButtonModule} from "primeng/button";
import {CardModule} from "primeng/card";
import {DataViewModule} from 'primeng/dataview';
import {DialogModule} from 'primeng/dialog';
import {PaginatorModule} from "primeng/paginator";
import {MessageService} from "primeng/api";
import {ToastModule} from "primeng/toast";

const emptyProduct: Product = {
  id: 0,
  code: "",
  name: "",
  description: "",
  image: "",
  category: "",
  price: 0,
  quantity: 0,
  internalReference: "",
  shellId: 0,
  inventoryStatus: "INSTOCK",
  rating: 0,
  createdAt: 0,
  updatedAt: 0,
};

@Component({
  selector: "app-product-list",
  templateUrl: "./product-list.component.html",
  styleUrls: ["./product-list.component.scss"],
  standalone: true,
  imports: [DataViewModule, CardModule, ButtonModule, DialogModule, ProductFormComponent, CommonModule, PaginatorModule, ToastModule],
})
export class ProductListComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  private readonly cartService = inject(CartService);
  private readonly messageService = inject(MessageService);

  public readonly products = this.productsService.products;
  public readonly totalRecords = this.productsService.totalRecords;

  public isDialogVisible = false;
  public isCreation = false;
  public readonly editedProduct = signal<Product>(emptyProduct);

  public currentPage = 0;
  public pageSize = 5;

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productsService.get(this.currentPage, this.pageSize).subscribe();
  }

  // Get filled stars based on rating
  getRatingStars(rating: number): number[] {
    return new Array(Math.floor(rating));  // Returns an array with the number of filled stars
  }

  // Get empty stars based on rating
  getEmptyStars(rating: number): number[] {
    const validRating = Math.max(0, Math.min(5, Math.floor(rating)));
    return new Array(5 - validRating);
  }

  public onCreate() {
    this.isCreation = true;
    this.isDialogVisible = true;
    this.editedProduct.set({... emptyProduct});
  }

  public onUpdate(product: Product) {
    this.isCreation = false;
    this.isDialogVisible = true;
    this.editedProduct.set(product);
  }

  public onDelete(product: Product) {
    this.productsService.delete(product.id).subscribe((value: boolean) => {
      if (value) {
        // Show success notification after the product is created
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Product deleted successfully',
          life: 3000
        });
      } else {
        // Show error notification if operation fails
        this.messageService.add({
          severity: 'error',
          summary: 'Operation not allowed',
          detail: 'Operation not allowed',
          life: 3000
        });
      }
    });
  }

  public onSave(product: Product) {
    if (this.isCreation) {
      this.productsService.create(product).subscribe((value: boolean) => {
        if (value) {
          // Show success notification after the product is created
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Product created successfully',
            life: 3000
          });
        } else {
          // Show error notification if operation fails
          this.messageService.add({
            severity: 'error',
            summary: 'Operation not allowed',
            detail: 'Operation not allowed',
            life: 3000
          });
        }
      });
    } else {
      // Update product logic here if needed
      this.productsService.update(product).subscribe((value: boolean) => {
        if (value) {
          // Show success notification after the product is created
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Product updated successfully',
            life: 3000
          });
        } else {
          // Show error notification if operation fails
          this.messageService.add({
            severity: 'error',
            summary: 'Operation not allowed',
            detail: 'Operation not allowed',
            life: 3000
          });
        }
      });
    }
    this.closeDialog();
  }


  public onCancel() {
    this.editedProduct.set({ ...emptyProduct });
    this.closeDialog();
  }

  private closeDialog() {
    this.isDialogVisible = false;
  }

  addToCart(product: Product) {
    console.log(product);
    this.cartService.addToCart(product).subscribe((value: boolean) => {
      if (value) {
        // Show success notification after the product is created
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Product added to Shopping Cart successfully',
          life: 3000
        });
      } else {
        // Show error notification if operation fails
        this.messageService.add({
          severity: 'error',
          summary: 'Operation not allowed',
          detail: 'Operation not allowed',
          life: 3000
        });
      }
    });
  }

  onPageChange(event: any) {
    this.currentPage = event.page;
    this.pageSize = event.rows;
    this.loadProducts();
  }
}
