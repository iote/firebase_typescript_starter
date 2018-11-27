import { Predicate } from './predicate';
import { WherePredicate } from './where.predicate';

export class Query {

  private _predicates: Predicate[];

  constructor() { this._predicates = []; }

  /**
   * Add where statement to query
   * 
   * @param fieldName  'Targetted fieldname in the database'
   * @param comparitor '==', '>=', >', '<=', '<'
   * @param value      'Value for targetted fieldname
   */
  where(fieldName, comparitor, value) {
    this._addPredicate(new WherePredicate(fieldName, comparitor, value));
    
    return this;
  }

  private _addPredicate(p: Predicate) {
    this._predicates.push(p);
  }

  /** 
   * Builds query for FireStore. 
   * 
   * Warning: Should only be used within the Core Module - Data Package! 
   */
  public __buildForFireStore(collRef: FirebaseFirestore.CollectionReference)
  { 
    let query = <FirebaseFirestore.Query> collRef;

    for (const pred of this._predicates) {
      query = pred.build(query);
    }

    return query;
  }

}
