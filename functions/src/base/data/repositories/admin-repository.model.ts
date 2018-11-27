import { IObject } from '../model/object.interface';

import { Query } from '../query/query.model';

/**
 * Repository to be used inside of Firebase Functions. 
 * 
 * Admin powered.
 */
export class AdminRepository<T extends IObject>
{

  constructor(private _collectionName: string,
              private _db: FirebaseFirestore.Firestore)
  { }

  public getDocumentById(id: string): Promise<T>
  {
    return this._db.collection(this._collectionName)
                   .doc(id).get()
                   .then(d => { const obj = <T> d.data(); 
                                obj.id = id; 
                                return obj; 
                   });
  }

  public getDocuments(query: Query): Promise<T[]> {
    return <Promise<T[]>>
      query.__buildForFireStore(this._db.collection(this._collectionName))
           .get()
           .then(this._mergeWithDocId);
  }

  public create(t: T): Promise<T>
  {
    t.createdOn = new Date();
    // Watch out for race conditions. Not single threaded, should find safer RNG
    t.createdBy = 'admin-' + t.createdOn.getTime();

    return this._db.collection(this._collectionName)
                   .add(t)
                   // All values filled here. Safe since will return catch clause on error.
                   .then(v => t);
  }

  public update(t: T): Promise<boolean>
  {
    if (!t.id)
      throw new Error("Trying to update POJO-object. Need active document with database id.");
    
    t.updatedOn = new Date();

    return this._db.collection(this._collectionName)
                        .doc(t.id)
                        .update(t)
                        .then(wr => true);
  }

  /**
   * Gets documents owned by user (user_id field == uid).
   */
  public getUserDocuments(query = new Query(), uid: string): Promise<T[]> {

    query.where('createdBy', '==', uid);

    return this.getDocuments(query);

  }

  /** By default, Firebase does not store document id. We therefore merge documents with their id. */
  private _mergeWithDocId(actions) : T[]
  {
    return actions.map(a => {
      const data = <T> a.payload.doc.data();
            data.id = a.payload.doc.id;
      
      return data;
    });

  }
}
