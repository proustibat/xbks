import { default as template } from './book.hbs';
import Utils from '../../utils';
import Cart from '../cart/cart';

export default class BookPreview {
    constructor ( { isbn, cover, excerpt, price, synopsis, title } ) {
        this.data = { isbn, cover, excerpt, price, synopsis, title };
        this.el = null;
        this.addButton = null;
        this.cartLoader = null;
        this.addCartListener = this.onAdd.bind( this );
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
    }

    /**
     * Show or hide add to cart button and loader
     * @param action:string must be 'add' or 'remove'
     */
    toggleLoaderCartButton ( action ) {
        this.cartLoader.classList[ action ]( 'active' );
        this.addButton.classList[ action ]( 'hide' );
    }

    destroy () {
        this.addButton.removeEventListener( 'click', this.addCartListener );
    }
}
