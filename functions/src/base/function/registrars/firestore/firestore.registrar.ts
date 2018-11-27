import { FunctionRegistrar } from "../function-registrar.interface";
import { FirestoreContext } from './context/firestore.context';

/**
 * Firestore registrar. 
 */
export abstract class FirestoreRegistrar<T, R> extends FunctionRegistrar<T, R>
{
  /**
   *  Firestore registration. For registering a function that listens to a firestore event.
   * 
   * @param documentPath - Path to document e.g. 'prospects/{prospectId}'. 
   *                       Can be more extensive path e.g. repository of subcollections.
   */
  constructor(protected _documentPath) { super(); }

  /**
   * Convert params of onCreate to input for CloudHandler
   * 
   * @param data Snapshot of data to create.
   * @param context 
   */
  before(dataSnap: any, context: any): { data: T; context: FirestoreContext; } {
    return {
      data: dataSnap.data(),
      context: { eventContext: context }
    };
  }

  onError(e: Error) {
    this._logger.error(() => `Error occured during execution.\nMsg:${e.message}`);

    return new Promise((_) => 'Error during execution. Fail gracefully.');
  }

  after(result: R, _): any {
    return result;
  }

}