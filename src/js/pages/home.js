import Layout from '../layout';

export default class Home {
    constructor ( el ) {
        console.log( 'Hello Home' );
        this.container = el;
        this.layout = null;

        try {
            this.showPage();
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
            this.layout = new Layout();
            this.container.classList.add( 'complete' );
        }
    }
}
