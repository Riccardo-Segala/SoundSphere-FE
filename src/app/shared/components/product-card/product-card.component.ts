import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CatalogProductDTO } from '../../../api-client';
import {RouterLink} from "@angular/router";
import {CommonModule} from "@angular/common";

@Component({
    selector: 'app-product-card',
    templateUrl: './product-card.component.html',
    imports: [
        RouterLink,
        CommonModule,
    ],
    styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent {

    @Input() product!: CatalogProductDTO;
    @Input() isCartAvailable: boolean = false;
    @Input() isWishlistAvailable: boolean = false;
    @Input() detailPath: string = '/dettaglio-prodotto';

    @Output() addToCartClick = new EventEmitter<string>();
    @Output() addToWishlistClick = new EventEmitter<string>();

    constructor() { }

    onAddToCart(event: Event): void {
        event.stopPropagation();
        event.preventDefault();
        this.addToCartClick.emit(this.product.id);
    }
    onAddToWishlist(event: Event): void {
        event.stopPropagation();
        event.preventDefault();
        this.addToWishlistClick.emit(this.product.id);
    }
}