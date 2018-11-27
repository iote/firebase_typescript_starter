import { reduce as __reduce } from 'lodash';

import { Context } from '../../context/context.interface';
import { Logger } from '../../util/logger/logger.interface';

import { Guard } from './guard.interface';

/**
   * Applies guards to functions before executing.
   * 
   * @param func   - The function to guard.
   * @param name   - The function name
   * @param logger - Logger to use
   * 
   * @returns    - A function that wraps the guard around the function handler.
   */
export function wrapGaurd<T, R>(func: (data: T, context: Context) => Promise<R>, guards: Guard<T>[], name: string, logger: Logger)
{
  return (data: T, context: Context) =>
  {
    if (__reduce(guards, (prev, guard) => prev && guard.check(data), true))
    {
      logger.log(() => `Guard for func ${name} succeeded. Guard conditions met.`);
      return func(data, context);
    }
    else
    {
      logger.warn(() => `Guard for func ${name} failed. Guard conditions have not been met. Blocking function execution.`);
      throw new Error(`Guard for function  ${name} failed. Halted execution.`);
    }
  }
}