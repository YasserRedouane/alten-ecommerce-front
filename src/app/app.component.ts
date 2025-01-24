import {
  Component,
} from "@angular/core";
import { RouterModule } from "@angular/router";
import { SplitterModule } from 'primeng/splitter';
import { ToolbarModule } from 'primeng/toolbar';
import { PanelMenuComponent } from "./shared/ui/panel-menu/panel-menu.component";
import { CartComponent } from "./carts/cart/cart.component";
import { CartService } from "./carts/data-access/carts.service";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  standalone: true,
  imports: [RouterModule, SplitterModule, ToolbarModule, PanelMenuComponent, CartComponent, CommonModule],
})
export class AppComponent {
  title = "ALTEN SHOP";

  showCart = false;
  cartQuantity = 0;

  constructor(private cartService: CartService) {
    this.cartService.getCartQuantity().subscribe((quantity) => {
      this.cartQuantity = quantity;
    });
    this.cartService.getCartVisibility().subscribe((isVisible) => {
      this.showCart = isVisible;
    });
  }

  toggleCart(): void {
    this.cartService.toggleCartVisibility();
  }
}
