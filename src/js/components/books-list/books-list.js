import { default as template } from './bookslist.hbs';
import ApiPotier from '../../services/api-potier';
import BookPreview from '../book-preview/book-preview';

export default class BooksList {
    constructor ( el ) {
        this.el = el;
        this.data = null;
        this.content = null;
        this.previews = null;
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

    prepare () {
        // Booklisting Template
        this.content = document.createElement( 'div' );
        this.content.innerHTML = template( { books: this.data } );

        // Create BookPreview instances
        this.previews = this.data.map( data =>
            new BookPreview( {
                isbn: data.isbn,
                cover: data.cover,
                price: data.price,
                synopsis: data.synopsis,
                title: data.title,
                excerpt: data.excerpt
            } )
                .prepare()

        );
        return this;
    }

    display () {
        // display booklisting template
        this.el.appendChild( this.content.firstChild );

        // display children templates: instances of BookPreview
        this.previews.forEach( book => {
            this.el.querySelector( '.booklisting' ).appendChild( book.el.firstChild );
        } );
        return this;
    }

    destroy () {
        this.el.remove();
    }
}
