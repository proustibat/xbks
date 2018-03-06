import Layout from '../layout';
import ApiPotier from '../services/api-potier';

export default class Home {
    constructor ( el ) {
        console.log( 'Hello Home' );
        this.container = el;
        this.loader = null;
        this.layout = null;
        this.api = new ApiPotier();
        this.books = null;

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
        if ( !this.container ) {
            throw new Error( 'This app must be wrapped in a dom element with a ".main-container" class!' );
        }
        else {
            this.container.classList.add( 'complete' );
        }
    }

    async runApp () {
        this.layout = new Layout();
        this.displayMainLoader();
        await this.api.getAllBooks().then( data => { this.books = data; } );
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
        this.container.prepend( this.loader );
    }

    removeMainLoader () {
        this.loader.remove();
    }
}
