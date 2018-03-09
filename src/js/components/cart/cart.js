import { default as template } from './cart.hbs';
import Layout from '../../layout';
import Utils from '../../utils';
import ApiPotier from '../../services/api-potier';
import Lockr from 'lockr';

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
        this.api = new ApiPotier();

        return instance;
    }

    async init ( el ) {
        this.el = el;
        this.items = [];
        this.discount = null;
        this.subTotal = null;
        this.totalOrder = null;
        this.offers = null;

        this.content = document.createElement( 'div' );

        // Listen to layout for click on cart menu item
        this.layout = new Layout();
        this.layout.on( 'open-cart', this.onOpenCart.bind( this ) );

        // Retrieve items if existing from the localStorage
        Lockr.prefix = 'xbks';
        const localStorageItems = Lockr.get( 'cart-items' );
        if ( localStorageItems ) {
            this.items = localStorageItems;
            await this.updateTotals();
        }

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

    async addBook ( { isbn, title, price } ) {
        return new Promise( async ( resolve ) => {
            // this.layout.displayMainLoader();

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

            // Save items into the localStorage
            Lockr.set( 'cart-items', this.items );

            await this.updateTotals();

            await this.render();

            // this.layout.removeMainLoader();
            resolve();
        } );
    }

    async updateTotals () {
        console.log( 'updateTotals' );
        // Update total without reduction
        await this.updateSubTotal();

        // Update discount object
        await this.updateDiscount();

        // Update total with applied reduction
        this.totalOrder = this.subTotal - this.discount.amount;
    }

    async updateDiscount () {
        console.log( 'updateDiscount' );
        await this.findOffers();
        this.discount = this.findBestReduction();
    }

    async findOffers () {
        console.log( 'findOffers' );
        // Get list of all isbn
        // ( if there is more than one time, we must add its isbn more than one time)
        const isbnList = [];
        this.items.forEach( book => {
            for ( let i = 0; i < book.quantity; i++ ) {
                isbnList.push( book.isbn );
            }
        } );

        await this.api.getOffers( isbnList )
            .then( data => { this.offers = data; } )
            .catch( error => { console.error( error ); } );
    }

    findBestReduction () {
        const discounts = [];
        this.offers.forEach( offer => {
            discounts.push( offer );
            switch ( offer.type ) {
            case 'percentage':
                discounts[ discounts.length - 1 ].amount = offer.value / 100 * this.subTotal;
                break;
            case 'minus':
                discounts[ discounts.length - 1 ].amount = offer.value;
                break;
            case 'slice':
                discounts[ discounts.length - 1 ].amount = Math.floor( this.subTotal / offer.sliceValue ) * offer.value;
                break;
            default:
                break;
            }
        } );
        // we need to compare amount and keep all the other stuff
        return discounts.reduce( ( maxOffer, offer ) => offer.amount > maxOffer.amount ? offer : maxOffer, discounts[0] );
    }

    updateSubTotal () {
        console.log( 'updateSubTotal' );
        if ( this.items.length > 0 ) {
            // update total without reduction (subtotal)
            const reducedSum = this.items.reduce( ( acc, item ) => {
                const price1 = ( acc.price * ( acc.quantity || 1 ) );
                const price2 = ( item.price * ( item.quantity || 1 ) );
                return ( { price: price1 + price2 } );
            } );
            // if there is only one item in the cart, this is the original item
            this.subTotal = reducedSum.price * ( reducedSum.quantity || 1 );
        }
        else {
            this.subTotal = 0;
            this.totalOrder = 0;
        }
    }

    render () {
        this.content.innerHTML = template( {
            items: this.items.map( item => {
                return Object.assign( {}, item, {
                    total: Utils.toLocalCurrency( item.price * item.quantity ),
                    price: Utils.toLocalCurrency( item.price )
                } );
            } ),
            discount: Object.assign( {}, this.discount, { amount: this.discount ? Utils.toLocalCurrency( this.discount.amount ) : null } ),
            subTotal: this.subTotal !== null ? Utils.toLocalCurrency( this.subTotal ) : 'jjj',
            totalOrder: this.totalOrder !== null ? Utils.toLocalCurrency( this.totalOrder ) : 0
        } );

        this.el.innerHTML = this.content.innerHTML;
        this.initModal();
    }
}