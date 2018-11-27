import { Predicate } from "./predicate";

export class WherePredicate extends Predicate {

  constructor(private _fieldName, private _comparitor, private _value) {
    super('where');
  }

  build(query: FirebaseFirestore.Query): FirebaseFirestore.Query {
    return query.where(this._fieldName, this._comparitor, this._value);
  }

}
