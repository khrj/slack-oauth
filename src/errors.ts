export interface CodedError extends Error {
    code: string // This can be a value from ErrorCode, or WebClient's ErrorCode, or a NodeJS error code
}

/**
 * A dictionary of codes for errors produced by this package.
 */
export enum ErrorCode {
    InstallerInitializationError = "slack_oauth_installer_initialization_error",
    AuthorizationError = "slack_oauth_installer_authorization_error",
    GenerateInstallUrlError = "slack_oauth_generate_url_error",
    HandleInstallCodeStateError = "slack_oauth_handle_code_state_error",
}

export class InstallerInitializationError extends Error implements CodedError {
    public code = ErrorCode.InstallerInitializationError
}

export class GenerateInstallUrlError extends Error implements CodedError {
    public code = ErrorCode.GenerateInstallUrlError
}

export class HandleInstallCodeStateError extends Error implements CodedError {
    public code = ErrorCode.HandleInstallCodeStateError
}

export class AuthorizationError extends Error implements CodedError {
    public code = ErrorCode.AuthorizationError
    public original: Error | undefined

    constructor(message: string, original?: Error) {
        super(message)

        if (original !== undefined) {
            this.original = original
        }
    }
}
