// @flow
// $FlowFixMe
import { default as template } from './book-preview.hbs';
import { default as $ } from 'jquery'; // As Materialize-css requires jQuery (here use for Toast)
import Utils from '../../utils';
import Cart from '../cart/cart';

/**
 *
 * @param {object} data
 * @param {string} data.isbn
 * @param {string} data.cover
 * @param {string} data.excerpt
 * @param {number} data.price
 * @param {Array<string>} data.synopsis
 * @param {string} data.title
 */
export default class BookPreview {
    data: any;
    el: any;
    addButtons: any;
    removeButtons: any;
    cartLoaders: any;
    addCartListener: any;
    removeItemListener: any;
    seeCartListener: any;
    toastButton: any;
    $toastContent: any;
    cart: Cart;
    badgesNb: any;

    constructor ( { isbn, cover, excerpt, price, synopsis, title }: { isbn: string, cover: string, excerpt: string, price: number, synopsis: Array<string>, title: string } ) {
        this.data = { isbn, cover, excerpt, price, synopsis, title };
        this.el = null;
        this.addButtons = null;
        this.removeButtons = null;
        this.cartLoaders = null;
        this.addCartListener = this.onAdd.bind( this );
        this.seeCartListener = this.onSeeCart.bind( this );
        this.removeItemListener = this.onRemoveItem.bind( this );
    }

    /**
     *
     * @returns {BookPreview}
     */
    prepare (): BookPreview {
        this.el = document.createElement( 'div' );
        this.el.innerHTML = template(
            Object.assign( {},
                this.data, {
                    price: Utils.toLocalCurrency( this.data.price )
                } )
        );
        this.cartLoaders = this.el.querySelectorAll( '.cart-loader' );

        // Add to cart buttons
        this.addButtons = this.el.querySelectorAll( '.cta-add-cart' );
        this.addButtons.forEach( ( btn: any ) => {
            btn.addEventListener( 'click', this.addCartListener );
        } );

        // Remove from vart buttons
        this.removeButtons = this.el.querySelectorAll( '.btn-remove-item' );
        this.removeButtons.forEach( ( btn: any ) => {
            btn.addEventListener( 'click', this.removeItemListener );
        } );

        this.toggleLoaderCartButton( 'remove' );

        this.toastButton = $( '<button class="btn toast-action waves-effect grey lighten-5 black-text toast-see-cart">See your cart</button>' );
        this.toastButton[ 0 ].addEventListener( 'click', this.seeCartListener );
        this.$toastContent = $( '<span>Your book has been added to your cart</span>' ).add( this.toastButton );


        this.badgesNb = this.el.querySelectorAll( '.nb-in-cart' );

        this.cart = new Cart(); // this is a singleton so don't panic!
        this.cart.on( 'update-cart',  this.updateBadgeItem.bind( this ) );

        this.updateBadgeItem();

        return this;
    }

    /**
     *
     * @param {Event} e
     * @returns {Promise<void>}
     */
    async onAdd ( e: Event ): Promise<void> {
        e.preventDefault();

        this.toggleLoaderCartButton( 'add' );

        await this.cart.addBook( {
            isbn: this.data.isbn,
            price: this.data.price,
            title: this.data.title
        } );

        this.updateBadgeItem();

        this.toggleLoaderCartButton( 'remove' );
        // $FlowFixMe
        Materialize.toast( this.$toastContent, 3000, 'toast-feedback-add green' );
    }

    /**
     *
     */
    updateBadgeItem() {
        this.badgesNb.forEach( ( badge: any ) => {
            // Update content of badges
            const nbItem = this.cart.findNbForItem( this.data.isbn );
            badge.innerHTML = nbItem;

            // Show or hide badges depending on items number
            badge.classList[ nbItem === 0 ? 'add' : 'remove' ]( 'hide' );

            // Show or hide remove button depending on items number
            this.removeButtons.forEach( ( btn: any ) => {
                btn.classList[ nbItem === 0 ? 'add' : 'remove' ]( 'hide' );
            } );
        } );

    }

    /**
     * Show or hide add to cart button and loader
     * @param {string} action must be 'add' or 'remove'
     */
    toggleLoaderCartButton ( action: string ) {
        this.cartLoaders.forEach( ( loader: any ) => {
            loader.classList[ action ]( 'active' );
        } );
        this.addButtons.forEach( ( btn: any ) => {
            btn.classList[ action ]( 'hide' );
        } );
    }

    /**
     *
     */
    onSeeCart () {
        // $FlowFixMe
        Materialize.Toast.removeAll();
        this.cart.onOpenCart();
    }

    onRemoveItem ( e: Event ) {
        e.preventDefault();
        this.cart.removeBook( this.data.isbn );
    }

    /**
     *
     */
    destroy () {
        this.addButtons.forEach( ( btn: any ) => {
            btn.removeEventListener( 'click', this.addCartListener );
        } );
        this.removeButtons.forEach( ( btn: any ) => {
            btn.removeEventListener( 'click', this.removeItemListener );
        } );
        this.toastButton[ 0 ].removeEventListener( 'click', this.seeCartListener );
    }
}
