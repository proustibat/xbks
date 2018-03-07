import { default as template } from './cart.hbs';
import Layout from '../../layout';
import Util from '../../utils';

let instance = null;

export default class Cart {
    constructor () {
        console.log( 'Hello Cart' );

        if ( !instance ) {
            instance = this;
        }

        this.el = null;
        this.content = null;
        this.$modal = null;
        this.layout = null;

        return instance;
    }

    init ( el ) {
        this.el = el;
        this.items = [];

        this.discount = {
            type: 'percentage',
            amount: 20
        };

        this.subTotal = 60;
        this.totalOrder = 40;

        this.content = document.createElement( 'div' );

        // Listen to layout for click on cart menu item
        this.layout = new Layout();
        this.layout.on( 'open-cart', this.onOpenCart.bind( this ) );

        this.render();
    }

    initModal () {
        this.$modal = $( '.modal-cart' );
        this.$modal.modal( {
            opacity: 0.9, // Opacity of modal background
            inDuration: 200, // Transition in duration
            outDuration: 200, // Transition out duration
            // Callback for Modal open. Modal and trigger parameters available.
            // ready: this.onModalOpen.bind( this ),
            // Callback for Modal close
            // complete: this.onModalClose.bind( this )
        } );
    }

    onOpenCart () {
        this.$modal.modal( 'open' );
    }

    // onModalOpen () {
    //     console.log( 'onModalOpen' );
    // }
    //
    // onModalClose () {
    //     console.log( 'onModalClose' );
    // }

    addBook ( { isbn, title, price } ) {
        console.log( 'Cart.addBook ', isbn, title, price );

        const index = this.items.findIndex( item => item.isbn === isbn );
        // if item already exists in the cart, just increment the quantity
        if ( index >= 0 ) {
            this.items[ index ].quantity++;
        }
        else {
            this.items.push( {
                isbn: isbn,
                title: title,
                price: price,
                quantity: 1
            } );
        }

        // TODO: update discount, subtotal, totalorder

        this.render();
    }

    render () {
        console.log( 'Cart.render' );
        this.content.innerHTML = template( {
            items: this.items.map( item => {
                return Object.assign( {}, item, {
                    total: Util.toLocalCurrency( item.price * item.quantity ),
                    price: Util.toLocalCurrency( item.price )
                } );
            } ),
            discount: Object.assign( {}, this.discount, { amount: Util.toLocalCurrency( this.discount.amount ) } ),
            subTotal: Util.toLocalCurrency( this.subTotal ),
            totalOrder: Util.toLocalCurrency( this.totalOrder )
        } );

        this.el.innerHTML = this.content.innerHTML;
        this.initModal();
    }
}
