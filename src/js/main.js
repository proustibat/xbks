// Generated by workflow
import './app-info';

// css
import '../styles/main.scss';

// libs
import 'jquery'; // Materialize-css requires jQuery
import 'materialize-css/dist/js/materialize'; // Materialize
import './utils';

// App and pages
import Home from './pages/home';

// Information message for development mode
if ( process.env.NODE_ENV !== 'production' ) {
    console.warn( 'Looks like we are in development mode!' );
}

document.ready().then( () => {
    // Find JS class to run depending on data-page-slug
    const selector = 'data-page-slug';
    const el = document.querySelector( `[${ selector }]` );
    const SlugClass = el ? { Home }[ el.getAttribute( selector ) ] : null;

    // Instantiation if a class is found
    if ( SlugClass ) {
        new SlugClass( el );
    }
} );