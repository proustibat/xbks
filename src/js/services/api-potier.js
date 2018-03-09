// @flow
import { default as $ } from 'jquery'; // As Materialize-css requires jQuery, I use it also for http request

import { IBook } from '../interfaces';

let instance = null;
const urlAllBooks = 'http://henri-potier.xebia.fr/books';

class ApiPotier {
    constructor () {
        if ( !instance ) {
            instance = this;
        }
        return instance;
    }

    getAllBooks (): Promise<Array<IBook>> {
        return new Promise( async ( resolve: Function, reject: Function ) => {
            // TODO: remove timeout, here just to test promise and loader display
            // setTimeout( async () => {
            await $.ajax( {
                url: urlAllBooks,
                type: 'GET',
                success: ( data: any ) => {
                    // format data to return exactly what models are waiting for
                    const formattedData = data.map( ( book: IBook ) => {
                        book.excerpt = book.synopsis && book.synopsis.length > 0 ? book.synopsis[0] : null;
                        return book;
                    } );
                    resolve( formattedData );
                },
                error: reject
            } );
            // }, 3000 );
        } );
    }

    getOffers ( isbnList: Array<string> ): Promise<Array<any>> {
        const url = `http://henri-potier.xebia.fr/books/${ isbnList.join( ',' ) }/commercialOffers`;
        return new Promise( async ( resolve: Function, reject: Function ) => {
            // setTimeout( async () => {
            await $.ajax( {
                url: url,
                type: 'GET',
                success: ( data: any ) => { resolve( data.offers ); },
                error: reject
            } );
            // }, 2000 );
        } );
    }
}

export default ApiPotier;
