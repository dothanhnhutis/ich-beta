type CutomFetchOpts = Omit<RequestInit, "method" | "body"> & {
  baseUrl?: string;
};

type CutomFetchCoreOpts<T = any> = CutomFetchOpts & {
  baseUrl?: string;
  body?: T;
};

export class CutomFetch {
  constructor(private options?: CutomFetchOpts) {}

  private async core<T = any, B = any>(
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
    url: string,
    options?: CutomFetchCoreOpts<B>
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
      const data: { message: string } = await res.json();

      // if (res.status >= 500) {
      //   throw new Error("Something went wrong");
      // }
      throw new Error(data.message);
      //   if (res.status >= 500) {
      //     throw new Error("Something went wrong");
      //   }

      //   const data = await res.json();
      //   const result = {
      //     headers: res.headers,
      //     data,
      //   };
      //   return result;
    }
    const data: T = await res.json();
    const result = {
      headers: res.headers,
      data,
    };
    return result;
  }

  get<T = any>(url: string, options?: Omit<RequestInit, "body">) {
    return this.core<T>("GET", url, options);
  }

  post<T = any, Body = any>(
    url: string,
    body?: Body,
    options?: Omit<RequestInit, "body">
  ) {
    return this.core<T, Body>("POST", url, { ...options, body });
  }

  patch<T = any, Body = any>(
    url: string,
    body: Body,
    options?: Omit<RequestInit, "body">
  ) {
    return this.core<T, Body>("PATCH", url, { ...options, body });
  }

  put<T = any, Body = any>(
    url: string,
    body: Body,
    options?: Omit<RequestInit, "body">
  ) {
    return this.core<T, Body>("PUT", url, { ...options, body });
  }

  delete<T = any>(url: string, options?: Omit<RequestInit, "body">) {
    return this.core<T>("DELETE", url, { ...options });
  }

  public static instance(opts?: CutomFetchOpts): CutomFetch {
    return new CutomFetch(opts);
  }
}

export const mainFetch = new CutomFetch({
  baseUrl: "http://localhost:4000/api/v1",
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
