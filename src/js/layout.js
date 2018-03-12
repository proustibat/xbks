// @flow
import EventEmitter from 'events';
import { default as $ } from 'jquery'; // As Materialize-css requires jQuery (here use for sideNav)

/**
 * Layout
 */
export default class Layout extends EventEmitter {
    static instance: any;
    loader: any;
    buttonsListener: any;
    menuButtons: any;

    constructor (): Layout {
        super();
        if ( !Layout.instance ) {
            Layout.instance = this.init();
        }
        return Layout.instance;
    }

    /**
     *
     * @returns {Layout}
     */
    init (): Layout {
        this.loader = null;
        this.createMainLoader();
        return this;
    }

    /**
     *
     */
    createMainLoader () {
        this.loader = document.createElement( 'div' );
        this.loader.setAttribute( 'class', 'main-loader progress' );
        const contentLoader = document.createElement( 'div' );
        contentLoader.setAttribute( 'class', 'indeterminate' );
        this.loader.appendChild( contentLoader );
    }

    /**
     *
     */
    displayMainLoader () {
        // $FlowFixMe
        document.body.prepend( this.loader );
    }

    /**
     *
     */
    removeMainLoader () {
        this.loader.remove();
    }
}
