type ValidErrorCode = 'MISCONFIGURATION' | 'INVALID_PARAMETERS' | 'MALFORMED_REQUEST';

class AdJsError extends Error {
  public code: ValidErrorCode;
  public message: string;

  constructor(code: ValidErrorCode, message: string) {
    super(message);
    this.code = code;
    this.message = message;
  }
}

export default AdJsError;
