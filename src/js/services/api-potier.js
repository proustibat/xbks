import 'jquery'; // As Materialize-css requires jQuery, I use it also for http request

let instance = null;

class ApiPotier {
    constructor () {
        if ( !instance ) {
            instance = this;
        }
        this.urlAllBooks = 'http://henri-potier.xebia.fr/books';
        return instance;
    }

    getAllBooks () {
        return new Promise( async ( resolve, reject ) => {
            // TODO: remove timeout, here just to test promise and loader display
            // setTimeout( async () => {
            await $.ajax( {
                url: this.urlAllBooks,
                type: 'GET',
                success: data => {
                    // format data to return exactly what models are waiting for
                    const formattedData = data.map( book => {
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

    getOffers ( isbnList ) {
        const url = `http://henri-potier.xebia.fr/books/${ isbnList.join( ',' ) }/commercialOffers`;
        return new Promise( async ( resolve, reject ) => {
            setTimeout( async () => {
                await $.ajax( {
                    url: url,
                    type: 'GET',
                    success: data => { resolve( data.offers ); },
                    error: reject
                } );
            }, 2000 );
        } );
    }
}

export default ApiPotier;
