interface ResponseMain {
  readonly success: boolean;
}

interface ServiceResponseSuccess extends ResponseMain {
  readonly success: true;
}

export interface ServiceResponseFail extends ResponseMain {
  readonly success: false;
  readonly message?: string;
  readonly fails?: unknown;
}

export type ServiceResponse<T extends object> =
  | (ServiceResponseSuccess & T)
  | ServiceResponseFail;
