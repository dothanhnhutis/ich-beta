"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  MoreHorizontalIcon,
} from "lucide-react";
import { caculatorPagination, cn } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const STEP_PREV_NEXT = 10;
const DisplayPagination = (pagination: {
  hasNextPage: number;
  totalPage: number;
  totalItem: number;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [limit, setLimit] = React.useState(10);
  const currentPage = searchParams.get("page") || "1";
  const page = parseInt(currentPage);

  React.useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    const take = newSearchParams.get("limit");
    setLimit(take ? parseInt(take) : 10);
  }, [limit, searchParams]);

  return (
    <div className="flex items-center justify-between my-2">
      <div className="flex items-center justify-center text-sm font-medium ">
        {`${(page - 1) * limit + 1} - ${Math.min(
          page * limit,
          pagination.totalItem
        )} trong số
    ${pagination.totalItem}`}
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="h-8 w-8 p-0 md:hidden"
            disabled={page == 1}
            onClick={() => {
              const newSearchParams = new URLSearchParams(
                searchParams.toString()
              );
              newSearchParams.set(
                "page",
                Math.max(1, page - STEP_PREV_NEXT).toString()
              );
              router.push(pathname + "?" + newSearchParams.toString());
            }}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            disabled={page == 1}
            onClick={() => {
              const newSearchParams = new URLSearchParams(
                searchParams.toString()
              );
              newSearchParams.set("page", (page - 1).toString());
              router.push(pathname + "?" + newSearchParams.toString());
            }}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          {caculatorPagination({
            totalPage: pagination.totalPage,
            currentPage: page,
          }).map((p) =>
            p != -1 ? (
              <Button
                key={p}
                onClick={() => {
                  const newSearchParams = new URLSearchParams(
                    searchParams.toString()
                  );
                  newSearchParams.set("page", p.toString());
                  router.push(pathname + "?" + newSearchParams.toString());
                }}
                variant="outline"
                className={cn(
                  "h-8 w-8 p-0",
                  page == p ? "border-primary" : "hidden md:block"
                )}
              >
                <span>{p}</span>
              </Button>
            ) : (
              <div
                key={p}
                className="h-8 w-8 cursor-not-allowed border rounded-lg md:flex justify-center bg-background opacity-50 items-center hidden"
              >
                <span className="sr-only">More pages</span>
                <MoreHorizontalIcon className="h-4 w-4" />
              </div>
            )
          )}

          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            disabled={!pagination.hasNextPage}
            onClick={() => {
              const newSearchParams = new URLSearchParams(
                searchParams.toString()
              );
              newSearchParams.set("page", (page + 1).toString());
              router.push(pathname + "?" + newSearchParams.toString());
            }}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0 md:hidden"
            disabled={!pagination.hasNextPage}
            onClick={() => {
              const newSearchParams = new URLSearchParams(
                searchParams.toString()
              );
              newSearchParams.set(
                "page",
                Math.min(pagination.totalPage, page + STEP_PREV_NEXT).toString()
              );
              router.push(pathname + "?" + newSearchParams.toString());
            }}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRightIcon className="h-4 w-4" />
          </Button>
        </div>

        <Select
          value={`${limit}`}
          onValueChange={(v) => {
            const newSearchParams = new URLSearchParams(
              searchParams.toString()
            );
            newSearchParams.set("limit", v.toString());
            router.push(pathname + "?" + newSearchParams.toString());
          }}
        >
          <SelectTrigger className="h-8">
            <SelectValue placeholder={"10 / page"} />
          </SelectTrigger>
          <SelectContent side="top">
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <SelectItem key={pageSize} value={`${pageSize}`}>
                {pageSize} / page
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default DisplayPagination;
