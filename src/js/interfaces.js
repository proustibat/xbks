// @flow

/**
 * @type {IBook}
 * @property {string} cover
 * @property {string} title
 * @property {Array<string>} synopsis
 * @property {string} excerpt
 * @property {number} price
 */
export interface IBook {
    cover: string,
    title: string,
    synopsis: Array<string>,
    excerpt?: ?string,
    price: number
}
