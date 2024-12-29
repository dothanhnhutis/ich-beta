import envs from "@/configs/envs";
import { FetchApi } from "./fetch-api";
import { CreateDisplay, Display, UpdateDisplay } from "@/schema/display.schema";

const displayInstance = new FetchApi({
  baseUrl: envs.NEXT_PUBLIC_SERVER_URL + "/api/v1",
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export const createdDisplayService = async (
  data: CreateDisplay,
  options?: Omit<RequestInit, "body">
) => {
  await displayInstance.post("/displays", data, options);
};

export const updateDisplayService = async (
  displayId: string,
  data: Partial<UpdateDisplay>,
  options?: Omit<RequestInit, "body">
) => {
  return await displayInstance.put<{ message: string }>(
    "/displays/" + displayId,
    data,
    options
  );
};

export const filterDisplaysService = async (
  searchParams: {
    [key: string]: string | string[] | undefined;
  },
  options?: Omit<RequestInit, "body">
) => {
  const data = [];
  for (const key in searchParams) {
    if (typeof searchParams[key] == "string") {
      data.push(`${key}=${searchParams[key]}`);
    } else if (Array.isArray(searchParams[key])) {
      for (const value of searchParams[key]) {
        data.push(`${key}=${value}`);
      }
    }
  }
  return await displayInstance.get<{
    displays: Display[];
    pagination: {
      hasNextPage: number;
      totalPage: number;
      totalItem: number;
    };
  }>(
    data.length > 0 ? "/displays/search?" + data.join("&") : "/displays/search",
    options
  );
};

export const getDisplaysOfDepartment = async (
  departmentId: string,
  options?: Omit<RequestInit, "body">
) => {
  const { data } = await displayInstance.get<{
    displays: Display[];
    pagination: {
      hasNextPage: number;
      totalPage: number;
      totalItem: number;
    };
  }>(
    `/displays/search?enable=true&departmentId=${departmentId}&orderBy=priority.desc&orderBy=createdAt.desc`,
    options
  );

  return data.displays;
};

export const getDisplaysService = async (
  options?: Omit<RequestInit, "body">
) => {
  try {
    return await displayInstance.get<{ displays: Display[] }>(
      "/displays",
      options
    );
  } catch (error: unknown) {
    console.log("getDisplaysService method error: ", error);
    return [];
  }
};

export const getDisplayByIdService = async (
  id: string,
  options?: Omit<RequestInit, "body">
) => {
  try {
    const { data } = await displayInstance.get<Display | null>(
      "/displays/" + id,
      options
    );
    return data;
  } catch (error: unknown) {
    console.log("getDisplayByIdService method error: ", error);
    return null;
  }
};
