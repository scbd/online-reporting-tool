//@ts-nocheck

Array.prototype.removeItem = function(predicate){

    if(!this?.length)
        return;

    let i = 0;

    while (i < this.length) {
        const element = this[i];
        if(predicate(element))
            this.splice(i, 1);
        else
             i++;
    }
}