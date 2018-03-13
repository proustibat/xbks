// @flow
// $FlowFixMe
import { default as template } from './cart.hbs';
import Layout from '../../layout';
import Utils from '../../utils';
import ApiPotier from '../../services/api-potier';
import Lockr from 'lockr';
import { default as $ } from 'jquery'; // As Materialize-css requires jQuery (here use for Modal)
import EventEmitter from 'events';

let instance = null;

/**
 *
 */
export default class Cart extends EventEmitter {
    el: any;
    content: any;
    $modal: any;
    layout: Layout;
    api: ApiPotier;
    items: any;
    discount: any;
    subTotal: any;
    totalOrder: any;
    offers: any;
    btnEmpty: any;
    emptyListenener: Function;
    removeItemListener: Function;
    btnsRemoveItem: any;

    constructor (): Cart {
        super();
        if ( !instance ) {
            instance = this;
        }

        this.el = null;
        this.content = null;
        this.$modal = null;
        this.layout = new Layout();
        this.api = new ApiPotier();
        this.emptyListenener = this.onEmptyClick.bind( this );
        this.removeItemListener = this.onRemoveItem.bind( this );

        return instance;
    }

    /**
     *
     * @param {HTMLElement} el
     * @returns {Promise<void>}
     */
    async init ( el: any ): Promise<void> {
        this.el = el;
        this.items = [];
        this.discount = null;
        this.subTotal = null;
        this.totalOrder = null;
        this.offers = null;

        this.content = document.createElement( 'div' );

        // Listen to layout for click on cart menu item
        this.layout.on( 'open-cart', this.onOpenCart.bind( this ) );

        // Retrieve items if existing from the localStorage
        Lockr.prefix = 'xbks';
        const localStorageItems = Lockr.get( 'cart-items' );
        if ( localStorageItems ) {
            this.items = localStorageItems;
            if( this.items.length > 0 ) {
                await this.updateTotals();
            }
        }

        this.render();
    }

    /**
     *
     */
    initModal () {
        this.btnEmpty && this.btnEmpty.removeEventListener( 'click', this.emptyListenener );
        this.$modal = $( '.modal-cart' );
        this.$modal.modal( {
            opacity: 0.9, // Opacity of modal background
            inDuration: 200, // Transition in duration
            outDuration: 200, // Transition out duration
        } );

        this.btnEmpty = this.el.querySelector( '.btn-empty' );
        this.btnEmpty && this.btnEmpty.addEventListener( 'click', this.emptyListenener );
    }

    /**
     *
     */
    onOpenCart () {
        this.$modal.modal( 'open' );
    }

    /**
     *
     * @param {string} isbn
     * @param {string} title
     * @param {number} price
     * @returns {Promise<any>}
     */
    async addBook ( { isbn, title, price }: { isbn: string, title: string, price: number } ): Promise<void> {
        return new Promise( async ( resolve: Function ): Promise<void> => {

            // Updates books list
            const index = this.items.findIndex( ( item: any ): boolean => item.isbn === isbn );
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

            await this.updateCartContent();

            resolve();
        } );
    }

    /**
     *
     * @returns {Promise<void>}
     */
    async updateCartContent (): Promise<void> {
        // Save items into the localStorage
        Lockr.set( 'cart-items', this.items );

        await this.updateTotals();

        await this.render();
    }

    /**
     *
     * @returns {Promise<void>}
     */
    async updateTotals (): Promise<void> {
        // Update items number on ui
        this.layout.updateItems( this.nbItems );

        // Update total without reduction
        await this.updateSubTotal();

        // Update discount object
        await this.updateDiscount();

        // Update total with applied reduction
        this.totalOrder = this.subTotal - this.discount.amount;
    }

    /**
     *
     * @returns {Promise<void>}
     */
    async updateDiscount (): Promise<void> {
        await this.findOffers();
        this.discount = this.findBestReduction();
    }

    /**
     *
     * @returns {Promise<void>}
     */
    async findOffers (): Promise<void> {
        // Get list of all isbn
        // ( if there is more than one time, we must add its isbn more than one time)
        const isbnList = [];
        if ( this.items.length > 0 ) {
            this.items.forEach( ( book: any ) => {
                for ( let i = 0; i < book.quantity; i++ ) {
                    isbnList.push( book.isbn );
                }
            } );

            await this.api.getOffers( isbnList )
                .then( ( data: any ) => { this.offers = data; } )
                .catch( ( error: any ) => { console.error( error ); } );
        }
    }

    /**
     *
     * @returns {*|any}
     */
    findBestReduction (): any {
        const discounts = [];
        this.offers.forEach( ( offer: any ) => {
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
        return discounts.reduce( ( maxOffer: any, offer: any ): any => offer.amount > maxOffer.amount ? offer : maxOffer, discounts[0] );
    }

    /**
     *
     */
    updateSubTotal () {
        if ( this.items.length > 0 ) {
            // update total without reduction (subtotal)
            const reducedSum = this.items.reduce( ( acc: any, item: any ): any => {
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

    /**
     *
     */
    render () {
        if ( this.btnsRemoveItem ) {
            this.btnsRemoveItem.forEach( ( btn: any ) => {
                btn.removeEventListener( 'click', this.removeItemListener );
            } );
        }
        this.content.innerHTML = template( {
            items: this.items.map( ( item: any ): any => {
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

        this.btnsRemoveItem = this.el.querySelectorAll( '.btn-remove-item' );
        this.btnsRemoveItem.forEach( ( btn: any ) => {
            btn.addEventListener( 'click', this.removeItemListener );
        } );
    }

    /**
     *
     * @param e
     * @returns {Promise<void>}
     */
    async onRemoveItem( e: Event ): Promise<void> {
        e.preventDefault();
        const btn: any = e.currentTarget;
        const isbn = btn.getAttribute( 'data-isbn' );


        this.$modal.modal( 'close' );

        await this.removeBook( isbn );

        this.$modal.modal( 'open' );
    }

    /**
     *
     * @param isbn
     * @returns {Promise<any>}
     */
    async removeBook( isbn: string ): Promise<void> {
        return new Promise( async ( resolve: Function ): Promise<void> => {

            const item = this.items.find( ( item: any ): boolean => item.isbn === isbn );

            if ( item ) {
                // Remove one item
                item.quantity --;

                // Remove item if needed
                if ( item.quantity === 0 ) {
                    this.items = this.items.filter( ( item: any ): boolean => item.isbn !== isbn );
                }

                await this.updateCartContent();

                this.emit( 'update-cart' );
            }


            resolve();
        } );
    }

    /**
     *
     * @returns {number}
     */
    get nbItems (): number {
        return this.items.reduce( ( accumulator: number, item: any ): number => accumulator + item.quantity, 0 );
    }

    /**
     *
     * @param {string} isbn
     * @returns {number}
     */
    findNbForItem( isbn: string ): number {
        const item = this.items.find( ( item: any ): boolean => item.isbn === isbn );
        return item ? item.quantity : 0;
    }

    /**
     *
     * @param e
     * @returns {Promise<void>}
     */
    async onEmptyClick ( e: Event ): Promise<void> {
        e.preventDefault();

        this.$modal.modal( 'close' );

        this.items = [];

        await this.updateCartContent();

        this.emit( 'update-cart' );

        this.$modal.modal( 'open' );
    }
}
