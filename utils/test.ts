export interface NTransformer<T>{
    transformMe(param:T) : T
}

class MyTransform<T> implements NTransformer<T>{
    
    transformMe(param: T): T {
        throw new Error("Method not implemented.")
    }
}

const lTransform = new MyTransform<string>();
lTransform.transformMe("h");
lTransform.transformMe(23);
// lTransform.toNumber("sdf");
