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
            // }, 5000 );
        } );
    }

    urlDiscount ( isbnList = [] ) {
        return `http://henri-potier.xebia.fr/books/${ isbnList.join( ',' ) }/commercialOffers`;
    }
}

export default ApiPotier;
