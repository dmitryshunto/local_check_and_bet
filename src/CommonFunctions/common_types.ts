export type ObjectKeys<T> = keyof T

export interface TypeWithStringKey {
    [key: string]: any
}