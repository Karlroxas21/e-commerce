import { HttpParams } from '@angular/common/http';

export const addParamIfDefined = (
  params: HttpParams,
  key: string,
  value: string | number | undefined,
) => {
  if (value !== undefined) {
    return params.set(key, value);
  }

  return params;
};
