export type ConnectorResult<T> = {
  ok: boolean;
  data?: T;
  error?: string;
};
