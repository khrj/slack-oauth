import { Logger, LogLevel, ConsoleLogger } from 'https://deno.land/x/slack_logger@3.0.0/mod.ts'
export type { Logger } from 'https://deno.land/x/slack_logger@3.0.0/mod.ts'
export { LogLevel } from 'https://deno.land/x/slack_logger@3.0.0/mod.ts'

let instanceCount = 0

/**
 * INTERNAL interface for getting or creating a named Logger.
 */
export function getLogger(name: string, level: LogLevel, existingLogger?: Logger): Logger {
    // Get a unique ID for the logger.
    const instanceId = instanceCount
    instanceCount += 1

    // Set up the logger.
    const logger: Logger = (() => {
        if (existingLogger !== undefined) { return existingLogger }
        return new ConsoleLogger()
    })()
    logger.setName(`${name}:${instanceId}`)
    if (level !== undefined) {
        logger.setLevel(level)
    }

    return logger
}