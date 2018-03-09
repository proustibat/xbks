// @flow
// $FlowFixMe
import { default as template } from './bookslist.hbs';
import ApiPotier from '../../services/api-potier';
import BookPreview from '../book-preview/book-preview';

/**
 * BooksList
 */
export default class BooksList {
    el: any;
    data: any;
    content: any;
    previews: any;
    api: ApiPotier;

    constructor ( el: any ) {
        this.el = el;
        this.data = null;
        this.content = null;
        this.previews = null;
        this.api = new ApiPotier();
    }

    /**
     *
     * @returns {Promise<any>}
     */
    async init (): Promise<void> {
        // Wait for the all books data from api
        return new Promise( ( resolve: Function, reject: Function ) => {
            this.api.getAllBooks()
                .then( async ( data: any ): Promise<void> => {
                    this.data = data;
                    resolve();
                } )
                .catch( reject );
        } );
    }

    /**
     *
     * @returns {BooksList}
     */
    prepare (): BooksList {
        // Booklisting Template
        this.content = document.createElement( 'div' );
        this.content.innerHTML = template( { books: this.data } );

        // Create BookPreview instances
        this.previews = this.data.map( ( data: any ): BookPreview =>
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

    /**
     *
     * @returns {BooksList}
     */
    display (): BooksList {
        // display booklisting template
        this.el.appendChild( this.content.firstChild );

        // display children templates: instances of BookPreview
        this.previews.forEach( ( book: any ) => {
            this.el.querySelector( '.booklisting' ).appendChild( book.el.firstChild );
        } );
        return this;
    }

    /**
     *
     */
    destroy () {
        this.el.remove();
    }
}
