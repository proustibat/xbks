import { default as template } from './book-preview.hbs';
import Utils from '../../utils';
import Cart from '../cart/cart';

export default class BookPreview {
    constructor ( { isbn, cover, excerpt, price, synopsis, title } ) {
        this.data = { isbn, cover, excerpt, price, synopsis, title };
        this.el = null;
        this.addButton = null;
        this.cartLoader = null;
        this.addCartListener = this.onAdd.bind( this );
        this.seeCartListener = this.onSeeCart.bind( this );
    }

    prepare () {
        this.el = document.createElement( 'div' );
        this.el.innerHTML = template(
            Object.assign( {},
                this.data, {
                    price: Utils.toLocalCurrency( this.data.price )
                } )
        );
        this.cartLoader = this.el.querySelector( '.cart-loader' );
        this.addButton = this.el.querySelector( '.cta-add-cart' );
        this.addButton.addEventListener( 'click', this.addCartListener );
        this.toggleLoaderCartButton( 'remove' );

        this.toastButton = $( '<button class="btn toast-action waves-effect grey lighten-5 black-text toast-see-cart">See your cart</button>' );
        this.toastButton[ 0 ].addEventListener( 'click', this.seeCartListener );
        this.$toastContent = $( '<span>Your book has been added to your cart</span>' ).add( this.toastButton );

        return this;
    }

    async onAdd ( e ) {
        e.preventDefault();

        this.toggleLoaderCartButton( 'add' );

        this.cart = new Cart(); // this is a singleton so don't panic!
        await this.cart.addBook( {
            isbn: this.data.isbn,
            price: this.data.price,
            title: this.data.title
        } );

        this.toggleLoaderCartButton( 'remove' );
        Materialize.toast( this.$toastContent, 3000, 'toast-feedback-add green' );
    }

    /**
     * Show or hide add to cart button and loader
     * @param {string} action must be 'add' or 'remove'
     */
    toggleLoaderCartButton ( action ) {
        this.cartLoader.classList[ action ]( 'active' );
        this.addButton.classList[ action ]( 'hide' );
    }

    onSeeCart () {
        Materialize.Toast.removeAll();
        this.cart.onOpenCart();
    }

    destroy () {
        this.addButton.removeEventListener( 'click', this.addCartListener );
        this.toastButton[ 0 ].removeEventListener( 'click', this.seeCartListener );
    }
}
