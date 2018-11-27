import { env } from '../../environment';

import { Logger } from './logger/logger.interface';

import { ConsoleProductionLogger } from './logger/console-production.logger';
import { ConsoleDebugLogger } from './logger/console-debug.logger';


let _logger = null;

/**
 * @returns The logger for the current config and environment.
 */
export function getLogger(): Logger
{
  // Since environment cannot change within instance of the app, we only initialise once.
  if (!_logger)
  {
    _logger = env.production ? new ConsoleProductionLogger()
                             : new ConsoleDebugLogger();
  }
  
  return _logger;
}