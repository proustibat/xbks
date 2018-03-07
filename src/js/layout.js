import EventEmitter from 'events';

export default class Layout extends EventEmitter {
    constructor () {
        super();
        if ( !Layout.instance ) {
            Layout.instance = this.init();
        }
        return Layout.instance;
    }

    init () {
        this.initMenu();
        return this;
    }

    initMenu () {
        // Initialize collapse button
        $( '.button-collapse' ).sideNav( {
            menuWidth: 300,
            edge: 'left',
            closeOnClick: true,
            draggable: true
            // onOpen: $el => { console.log( 'Menu is open', $el[0] ) },
            // onClose: $el => { console.log( 'Menu is close', $el[0] ) },
        } );
        // Initialize collapsible (uncomment the line below if you use the dropdown variation)
        // $('.collapsible').collapsible();

        // Clicks on items
        this.buttonsListener = this.onMenuItem.bind( this );
        this.menuButtons = document.querySelectorAll( '.nav-wrapper .btn-js' );
        this.listenMenu();
    }

    listenMenu () {
        this.menuButtons.forEach( btn => btn.addEventListener( 'click', this.buttonsListener ) );
    }

    onMenuItem ( e ) {
        const role = e.currentTarget.getAttribute( 'data-role' );
        if ( role === 'cart' ) {
            this.emit( 'open-cart' );
            e.preventDefault();
        }
    }
}
