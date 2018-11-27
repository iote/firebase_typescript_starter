import { CloudFunction } from "firebase-functions";

import { Logger } from '../../util/logger/logger.interface';
import { getLogger } from '../../util/logger.util';

import { Context } from '../../context/context.interface';

/**
 * Registrar.
 * 
 * A registrar registers a cloud function to a certain event,
 *  upon which the event needs to be triggered..
 * 
 * The registrar also registers the after action.
 */
export abstract class FunctionRegistrar<T, R>
{ 
  protected _logger: Logger;

  constructor() {
    this._logger = getLogger();
  }

  /**
   * Action before execution of function. Registers the passed function as a cloudfunction.
   */
  abstract register(func: (dataSnap, context) => Promise<R>): CloudFunction<any>;

  /**
   * Convert params of specific registrar into parameters tailored to FunctionHandler
   */
  abstract before(dataSnap, context): { data: T, context: Context };

  /**
   * Wrapper function that wraps a function handler in a cloudfunction of choice..
   * 
   * SEALED! Do not override!
   */
  wrap(func: (data: T, context: Context) => Promise<R>): CloudFunction<any>
  {
    return this.register((data, context) =>
    {
      const params = this.before(data, context);
        
      return func(params.data, params.context)
                .then((r: R) => this.after(r, params.context))
                .catch(this.onError);
                
    });
  }

  /**
   * After action. Prepare an after event such as sending the result back to the user over REST or
   * storing the result on firestore.
   * 
   * @param result
   */
  abstract after(result: R, context: Context): any;

  /**
   * Error handling function.
   * 
   * @param error - The error that occured.
   */
  abstract onError(error: Error): Promise<any>;

}