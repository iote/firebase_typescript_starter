import { RepositoryFactory } from '../../data/repository.factory';

import { Logger } from '../../util/logger/logger.interface';
import { getLogger } from '../../util/logger.util';

import { Context } from '../../context/context.interface';

/**
 * The handler which contains the logic of a Firebase Function of type T (input) -> R (result).
 * 
 * @param T: The data expected by the function 
 * @param R: The result returned from the function
 */
export abstract class FunctionHandler<T, R>
{
  protected _logger: Logger;

  protected _tools = {
    getRepository: RepositoryFactory.create
  };

  constructor() { 
    this._logger = getLogger();
  }

  
  
  /** Contains the actual logic */ 
  public abstract execute(data: T, context: Context): Promise<R>;

}