type ValidErrorCode = 'Misconfiguration' | 'Invalid Parameters' | 'Malformed Request';

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
