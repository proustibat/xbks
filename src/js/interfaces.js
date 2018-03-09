// @flow
export interface IBook {
    cover: string,
    title: string,
    synopsis: Array<string>,
    excerpt?: ?string,
    price: number
}
