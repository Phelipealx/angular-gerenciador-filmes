import { HttpErrorResponse } from '@angular/common/http';

export const setErrorMessage = (error: Error | undefined) => {
  const cause = error?.cause as HttpErrorResponse;

  if (!cause) {
    return '';
  }

  if (cause.status === 0) {
    return 'Network error. Please check your internet connection.';
  }

  if (cause.error?.message) {
    return cause.error.message as string;
  }

  return 'An unexpected error occurred. Please try again later.';
};
