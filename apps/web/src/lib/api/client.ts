// field error
export interface FieldErrors {
  field: string;
  message: string;
}

// api client error class
export class ApiClientError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly details?: FieldErrors[],
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}

// api envelope interface
interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  status: number;
  data: T;
  error: string | FieldErrors[] | null;
}

// which routes we don't want to refresh
const NO_REFRESH = ['/auth/login', '/auth/register', '/auth/refresh', '/auth/logout'];

// refresh promise
let refreshPromise: Promise<boolean> | null = null;

// refresh session function
function refreshSession(): Promise<boolean> {
  refreshPromise ??= fetch('/api/v1/auth/refresh', { method: 'POST' })
    .then((res) => res.ok)
    .catch(() => false)
    .finally(() => {
      refreshPromise = null;
    });
  return refreshPromise;
}

// apiFetch function -> which is fetch here will be fetched
export async function apiFetch<T>(path: string, init: RequestInit = {}, canRetry = true): Promise<T> {
  const res = await fetch(`/api/v1${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init.headers },
  });

  if (res.status === 401 && canRetry && !NO_REFRESH.includes(path)) {
    if (await refreshSession()) {
      return apiFetch<T>(path, init, false);
    }
  }

  // return body into json format if not then catch error to -> null
  const body = (await res.json().catch(() => null)) as ApiEnvelope<T> | null;

  if (!res.ok) {
    throw new ApiClientError(body?.message ?? 'Request Failed', res.status, Array.isArray(body?.error) ? body.error : undefined);
  }

  return body?.data as T;
}
