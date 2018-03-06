import Layout from '../layout';
import BooksList from '../components/books-list/books-list';

export default class Home {
    constructor ( el ) {
        console.log( 'Hello Home' );
        this.el = el;
        this.loader = null;
        this.layout = null;
        this.books = null;
        this.bookList = null;

        this.createMainLoader();

        try {
            this.showPage();
            this.runApp();
        }
        catch ( e ) {
            console.error( `Something's wrong :( ${ e }` );
        }
    }

    showPage () {
        if ( !this.el ) {
            throw new Error( 'This app must be wrapped in a dom element with a ".main-container" class!' );
        }
        else {
            this.el.classList.add( 'complete' );
        }
    }

    async runApp () {
        // Menu and all layout stuff with Materialize
        this.layout = new Layout();

        // Display a loader while waiting for the api request
        this.displayMainLoader();

        // Create a BooksList component
        this.bookList = new BooksList( this.el.querySelector( '#books-list' ) );

        // wait for the initialization of the BooksList component
        await this.bookList.init()
            .then( () => {
                // when the BooksList component is ready: display it
                this.bookList.display();
            } )
            .catch( err => { console.error( err ); } );

        this.removeMainLoader();
    }

    createMainLoader () {
        this.loader = document.createElement( 'div' );
        this.loader.setAttribute( 'class', 'main-loader progress' );
        const contentLoader = document.createElement( 'div' );
        contentLoader.setAttribute( 'class', 'indeterminate' );
        this.loader.appendChild( contentLoader );
    }

    displayMainLoader () {
        this.el.prepend( this.loader );
    }

    removeMainLoader () {
        this.loader.remove();
    }
}
