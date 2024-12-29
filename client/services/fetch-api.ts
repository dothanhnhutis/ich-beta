type FetchApiOpts = Omit<RequestInit, "method" | "body"> & {
  baseUrl?: string;
};

type FetchApiCoreOpts<T = unknown> = FetchApiOpts & {
  baseUrl?: string;
  body?: T;
};

export class FetchApiError extends Error {
  statusCode: number;
  constructor(error: { message: string; statusCode: number }) {
    super(error.message);
    this.statusCode = error.statusCode;
  }
  serializeErrors() {
    return {
      message: this.message,
    };
  }
}

export class FetchApi {
  constructor(private options?: FetchApiOpts) {}

  private async core<T = unknown, B = unknown>(
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
    url: string,
    options?: FetchApiCoreOpts<B>
  ) {
    let body: string | undefined;
    if (options?.body) {
      if (typeof options.body == "string") {
        body = options.body;
        delete options["body"];
      } else if (typeof options.body == "object") {
        body = JSON.stringify(options.body);
        delete options["body"];
      } else {
        throw new Error(
          "body does not support types other than string and object"
        );
      }
    }
    const baseHeaders = {
      "Content-Type": "application/json",
    };
    const baseUrl = this.options?.baseUrl || "";

    const fullUrl = url.startsWith("/")
      ? `${baseUrl}${url}`
      : `${baseUrl}/${url}`;

    const res = await fetch(fullUrl, {
      ...this.options,
      ...options,
      headers: {
        ...baseHeaders,
        ...this.options?.headers,
        ...options?.headers,
      },
      body,
      method,
    });

    if (!res.ok) {
      const data: { message: string; statusCode: number } = await res.json();
      throw new FetchApiError(data);
    }
    const data: T = await res.json();
    const result = {
      headers: res.headers,
      data,
    };
    return result;
  }

  get<T = unknown>(url: string, options?: Omit<RequestInit, "body">) {
    return this.core<T>("GET", url, options);
  }

  post<T = unknown, Body = unknown>(
    url: string,
    body?: Body,
    options?: Omit<RequestInit, "body">
  ) {
    return this.core<T, Body>("POST", url, { ...options, body });
  }

  patch<T = unknown, Body = unknown>(
    url: string,
    body: Body,
    options?: Omit<RequestInit, "body">
  ) {
    return this.core<T, Body>("PATCH", url, { ...options, body });
  }

  put<T = unknown, Body = unknown>(
    url: string,
    body: Body,
    options?: Omit<RequestInit, "body">
  ) {
    return this.core<T, Body>("PUT", url, { ...options, body });
  }

  delete<T = unknown>(url: string, options?: Omit<RequestInit, "body">) {
    return this.core<T>("DELETE", url, { ...options });
  }

  public static instance(opts?: FetchApiOpts): FetchApi {
    return new FetchApi(opts);
  }
}
