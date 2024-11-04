interface EDictionary<T> {
    [key: string]: T;
}
interface EDictionaryPair<K, V> {
    key: K;
    value: V;
}