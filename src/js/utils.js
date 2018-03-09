// @flow

// $FlowFixMe
HTMLDocument.prototype.ready = (): Promise<any> =>
    new Promise( ( resolve: Function ) => {
        document.readyState === 'complete' ? resolve() : new Promise( ( resolve: Function ) => {
            // $FlowFixMe
            document.onreadystatechange = () => { document.readyState === 'complete' && resolve(); };
        } ).then( resolve() );
    } );

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
    getMap: ( length: number, data: any = null ): Array<any> => {
        if ( !length ) return [];
        return Array.from( { length: length }, (): any => data );
    },

    /**
     * Format in USD currency
     * @param value
     * @returns {string}
     */
    toLocalCurrency: ( value: number ): string => {
        return value.toLocaleString( 'en-US', {
            style: 'currency',
            currency: 'USD',
        } );
    }
};

export default Utils;
