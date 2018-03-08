import { default as template } from './cart.hbs';
import Layout from '../../layout';
import Util from '../../utils';

let instance = null;

export default class Cart {
    constructor () {
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
        this.discount = null;
        this.subTotal = null;
        this.totalOrder = null;

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
        console.log( 'Cart.addBook ', isbn, title );

        // Updates books list
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

        // update discount object
        this.updateDiscount();

        this.updateTotals();

        this.render();
    }

    updateDiscount () {
        this.discount = {
            type: null,
            amount: 0
        };
    }

    updateTotals () {
        if ( this.items.length > 0 ) {
            // update total without reduction (subtotal)
            const reducedSum = this.items.reduce( ( acc, item ) => {
                const price1 = ( acc.price * ( acc.quantity || 1 ) );
                const price2 = ( item.price * ( item.quantity || 1 ) );
                return ( { price: price1 + price2 } );
            } );
            // if there is only one item in the cart, this is the original item
            this.subTotal = reducedSum.price * ( reducedSum.quantity || 1 );

            // update total with applied reduction
            this.totalOrder = this.subTotal - this.discount.amount;
        }
        else {
            this.subTotal = 0;
            this.totalOrder = 0;
        }
    }

    render () {
        console.log( 'Cart.render ' );
        this.content.innerHTML = template( {
            items: this.items.map( item => {
                return Object.assign( {}, item, {
                    total: Util.toLocalCurrency( item.price * item.quantity ),
                    price: Util.toLocalCurrency( item.price )
                } );
            } ),
            discount: Object.assign( {}, this.discount, { amount: this.discount ? Util.toLocalCurrency( this.discount.amount ) : null } ),
            subTotal: this.subTotal !== null ? Util.toLocalCurrency( this.subTotal ) : 'jjj',
            totalOrder: this.totalOrder !== null ? Util.toLocalCurrency( this.totalOrder ) : 0
        } );

        this.el.innerHTML = this.content.innerHTML;
        this.initModal();
    }
}
