// @flow

import Layout from '../layout';
import BooksList from '../components/books-list/books-list';
import Cart from '../components/cart/cart';

/**
 * @param {HTMLElement} el
 */
export default class Home {
    el: any;
    layout: any;
    books: any;
    bookList: any;
    cart: any;

    constructor ( el: any ) {
        console.log( 'Hello Home' );
        this.el = el;
        this.layout = null;
        this.books = null;
        this.bookList = null;
        this.cart = null;

        try {
            this.showPage();
            this.runApp();
        }
        catch ( e ) {
            console.error( `Something's wrong :( ${ e }` );
        }
    }

    /**
     *
     */
    showPage () {
        if ( !this.el ) {
            throw new Error( 'This app must be wrapped in a dom element with a ".main-container" class!' );
        }
        else {
            this.el.classList.add( 'complete' );
        }
    }

    /**
     *
     * @returns {Promise<void>}
     */
    async runApp (): Promise<any> {
        // Menu and all layout stuff with Materialize
        this.layout = new Layout();

        // Display a loader while waiting for the api request
        this.layout.displayMainLoader();

        // Create a Cart component
        // Cart class is a singleton, so init instruction must be called only here !
        this.cart = new Cart();
        // $FlowFixMe
        this.cart.init( document.querySelector( '#cart-container' ) );

        // Create a BooksList component
        this.bookList = new BooksList( this.el.querySelector( '#books-list' ) );

        // Wait for the initialization of the BooksList component
        await this.bookList.init()
            .then( () => {
                // when the BooksList component is ready: display it
                this.bookList
                    .prepare()
                    .display();
            } )
            .catch( ( err: any ) => { console.error( err ); } );

        this.layout.removeMainLoader();
    }
}
