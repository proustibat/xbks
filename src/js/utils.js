HTMLDocument.prototype.ready = () => new Promise( resolve => document.readyState === 'complete' ? resolve() : new Promise( resolve => ( document.onreadystatechange = () => document.readyState === 'complete' && resolve() ) ).then( resolve() ) );

/**
 * Utility Functions
 * @type Object
 */
const Utils = {
    /**
     * Returns an array of requested length
     * with data or null object in each cell
     * @param length
     * @param data
     * @returns {*}
     */
    getMap: ( length, data = null ) => {
        if ( !length ) return [];
        return Array.from( { length: length }, () => data );
    },

    /**
     * Format in USD currency
     * @param value
     * @returns {string}
     */
    toLocalCurrency: ( value ) => {
        return value.toLocaleString( 'en-US', {
            style: 'currency',
            currency: 'USD',
        } );
    }
};

export default Utils;
