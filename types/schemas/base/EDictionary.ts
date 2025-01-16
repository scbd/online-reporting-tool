export interface EDictionary<T> {
    [key: string]: T;
}
export interface EDictionaryPair<K, V> {
    key: K;
    value: V;
}