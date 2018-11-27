import { CloudFunction } from 'firebase-functions';

import { Logger } from '../util/logger/logger.interface';
import { getLogger } from '../util/logger.util';

import { FunctionHandler } from './handler/function-handler.class';
import { FunctionRegistrar } from './registrars/function-registrar.interface';

import { Guard } from './guard/guard.interface';
import { wrapGaurd } from './guard/wrap-gaurd.util';
import { Context } from '../context/context.interface';

/**
 * A conceptual representation of a Google Cloud function which contains the logic of a Firebase Function of type T (input) -> R (result).
 * 
 * @param T: The data expected by the function 
 * @param R: The result returned from the function
 */
export class GCFunction<T, R> {

  protected _logger: Logger;

  constructor(private _name: string,
              private _registrar: FunctionRegistrar<T, R>,
              private _guards   : Guard<T>[],
              private _handler  : FunctionHandler<T,R>) 
  {
    this._logger = getLogger();
  }

  /**
   * Turns the registered function into an actual cloud function.
   */
  build(): CloudFunction<any>
  {
    // Start with the inner core function which is the handler logic or this._handler.execute
    // From there, move up the chain by adding extra layers and steps.

    // 1) Wrap the guard around the handler. If the guard fails halt execution and throw an error. 
                                                                      // Handler loses scope because of wrapping. Explicitely bind it to its scope. 
                                                                      // Needs a cast too to ensure not breaking the types. R is lost "=> Promise<{}>"
    const gaurdedFunc = wrapGaurd(<(data: T, context: Context) => Promise<R>> this._handler.execute.bind(this._handler),
                                  this._guards,
                                  this._name,
                                  this._logger);

    // 2) Register function onto Firebase
    const registeredFunc = this._registrar.wrap(gaurdedFunc);

    // 3) Return built function
    return registeredFunc;
  }

}