import { default as template } from './bookslist.hbs';
import ApiPotier from '../../services/api-potier';

export default class BooksList {
    constructor ( el ) {
        console.log( 'Hello BooksList' );
        this.el = el;
        this.data = null;
        this.api = new ApiPotier();
    }

    async init () {
        // Wait for the all books data from api
        return new Promise( ( resolve, reject ) => {
            this.api.getAllBooks()
                .then( async ( data ) => {
                    this.data = data;
                    resolve();
                } )
                .catch( reject );
        } );
    }

    display () {
        console.log( 'BooksList.display' );
        const div = document.createElement( 'div' );
        div.innerHTML = template( {
            books: this.data
        } );
        this.el.appendChild( div );
    }
}
