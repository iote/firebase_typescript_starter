
export abstract class Predicate {

  public readonly type: 'where' | 'and';

  constructor(type) {
    this.type = type;
  }
  
  abstract build(query: FirebaseFirestore.Query): FirebaseFirestore.Query;
}
