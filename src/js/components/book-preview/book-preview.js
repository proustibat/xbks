import { default as template } from './book.hbs';
import Util from '../../utils';
import Cart from '../cart/cart';

export default class BookPreview {
    constructor ( { isbn, cover, excerpt, price, synopsis, title } ) {
        this.data = { isbn, cover, excerpt, price, synopsis, title };
        this.el = null;
        this.addButton = null;
        this.addCartListener = this.onAdd.bind( this );
    }

    prepare () {
        this.el = document.createElement( 'div' );
        this.el.innerHTML = template(
            Object.assign( {},
                this.data, {
                    price: Util.toLocalCurrency( this.data.price )
                } )
        );
        this.addButton = this.el.querySelector( '.cta-add-cart' );
        this.addButton.addEventListener( 'click', this.addCartListener );
        return this;
    }

    onAdd ( e ) {
        e.preventDefault();
        console.log( 'BookPreview.onAdd ' );
        this.cart = new Cart(); // this is a singleton so don't panic!
        this.cart.addBook( {
            isbn: this.data.isbn,
            price: this.data.price,
            title: this.data.title
        } );
    }

    destroy () {
        this.addButton.removeEventListener( 'click', this.addCartListener );
    }
}
