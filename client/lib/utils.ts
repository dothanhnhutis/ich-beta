import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export async function fileToBase64<T = unknown>(file: File) {
  return new Promise<T>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      resolve(reader.result as T);
    };
    reader.onerror = reject;
  });
}

export function caculatorPagination({
  totalPage,
  currentPage,
  centerItem = 1,
  firstLastItem = 5,
}: {
  totalPage: number;
  currentPage: number;
  centerItem?: number;
  firstLastItem?: number;
}) {
  if (totalPage < 1) totalPage = 1;
  if (currentPage > totalPage || currentPage <= 0) currentPage = 1;
  if (firstLastItem + (centerItem * 2 + 1) >= totalPage) {
    return Array.from({ length: totalPage }, (_, ix) => ix + 1);
  }
  const firstList: number[] = Array.from(
    { length: firstLastItem },
    (_, ix) => ix + 1
  ).filter((v) => v >= 1 && v <= totalPage);
  const lastList: number[] = Array.from(
    { length: firstLastItem },
    (_, ix) => totalPage - firstLastItem + ix + 1
  ).filter((v) => v >= 1 && v <= totalPage);
  const centerList: number[] = Array.from(
    { length: centerItem * 2 + 1 },
    (_, ix) => currentPage - Math.floor((centerItem * 2 + 1) / 2) + ix
  ).filter((v) => v >= 1 && v <= totalPage);
  let result: number[] = [];
  if (firstList.includes(currentPage)) {
    result = [...firstList, ...centerList, -1, totalPage];
  } else if (lastList.includes(currentPage)) {
    result = [1, -1, ...centerList, ...lastList];
  } else {
    result = [1, -1, ...centerList, -1, totalPage];
  }
  return result.filter((v, ix, arr) => v == -1 || arr.indexOf(v) === ix);
}

type SortOrder = "asc" | "desc";

interface SortField<T> {
  key: keyof T;
  order?: SortOrder;
}

export function sortByFields<T>(data: T[], fields: SortField<T>[]): T[] {
  return data.sort((a, b) => {
    for (const field of fields) {
      const { key, order = "asc" } = field;
      const aValue = a[key];
      const bValue = b[key];
      const comparison = aValue > bValue ? 1 : aValue < bValue ? -1 : 0;

      if (comparison !== 0) {
        return order === "asc" ? comparison : -comparison;
      }
    }
    return 0;
  });
}
