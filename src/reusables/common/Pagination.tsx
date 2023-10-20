import { FC, useMemo } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import classnames from "classnames";
import "../../styles/pagination.scss";
import { useCustomMediaQuery } from "../../hooks/useCustomMediaQuery";
import { colors } from "../../constants/cssConstant";

/**
 * usage:
 * <Pagination
        className="pagination-bar"
        pagination={pagination}
        currentPage={currentPage}
        onLimitChange={limit => setLimit(limit)}
        onPageChange={page => setCurrentPage(page)}
      />
 */
interface IPagination {
  pagination: {
    next?: { page: number; limit: number };
    prev?: { page: number; limit: number };
    pageTotal: number;
    totalRecords: number;
    count: number;
  };
  onPageChange: (param: any) => void;
  onLimitChange?: (param: any) => void;
  currentPage?: number;
  className?: string;
  siblingCount?: number;
}

export const DOTS = "...";

const range = (start: number, end: number) => {
  let length = end - start + 1;
  return Array.from({ length }, (_, idx) => idx + start);
};

interface IUsePagination {
  totalCount: number;
  pageSize: number;
  siblingCount: number;
  currentPage: number;
  pageTotal: number;
}
export const usePagination = ({
  totalCount,
  pageSize,
  siblingCount = 1,
  currentPage,
  pageTotal,
}: IUsePagination) => {
  const paginationRange = useMemo(() => {
    const totalPageCount = pageTotal || Math.ceil(totalCount / pageSize);
    const numberBeforeDots = 3;
    const dotsFactor = 2;

    // Pages count is determined as siblingCount + firstPage + lastPage + currentPage + 2*DOTS
    const totalPageNumbers = siblingCount + 5;
    /*
      If the number of pages is less than the page numbers we want to show in our
      paginationComponent, we return the range [1..totalPageCount]
    */
    if (totalPageNumbers >= totalPageCount) {
      return range(1, totalPageCount);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(
      currentPage + siblingCount,
      totalPageCount
    );

    /*
      We do not want to show dots if there is only one position left 
      after/before the left/right page count as that would lead to a change if our Pagination
      component size which we do not want
    */
    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPageCount;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      let leftItemCount = numberBeforeDots + dotsFactor * siblingCount;
      let leftRange = range(1, leftItemCount);

      return [...leftRange, DOTS, totalPageCount];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      let rightItemCount = numberBeforeDots + dotsFactor * siblingCount;
      let rightRange = range(
        totalPageCount - rightItemCount + 1,
        totalPageCount
      );
      return [firstPageIndex, DOTS, ...rightRange];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      let middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
    }
  }, [totalCount, pageSize, siblingCount, currentPage, pageTotal]);

  return paginationRange;
};

const Pagination: FC<IPagination> = (props) => {
  const {
    onPageChange,
    onLimitChange,
    pagination,
    siblingCount = 1,
    currentPage,
    className = "",
  }: IPagination = props;
  const { totalRecords, next, prev, count, pageTotal } = pagination;
  const { isMobile } = useCustomMediaQuery();
  const _currentPage = currentPage
    ? currentPage
    : next?.page! - 1 || prev?.page! + 1;

  let paginationRange = usePagination({
    currentPage: _currentPage,
    totalCount: totalRecords,
    siblingCount,
    pageSize: count,
    pageTotal,
  });

  const onNext = () => {
    onPageChange(_currentPage + 1);
  };

  const onPrevious = () => {
    onPageChange(_currentPage - 1);
  };

  const _onLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onPageChange(0);
    onLimitChange?.(+e?.target?.value);
  };

  let lastPage = paginationRange?.[paginationRange?.length - 1];
  const currentShowingStart = (_currentPage - 1) * count + 1 || 1;
  const currentShowingEnd = currentShowingStart - 1 + count || totalRecords;

  return (
    <Box
      textAlign="center"
      alignItems="center"
      justifyContent="space-between"
      display="flex"
      pt={4}
    >
      {!isMobile ? (
        <Box display="flex" alignItems="center">
          <Typography color={colors.textDark} fontSize="14px" pr="1rem">
            <strong>{totalRecords || ""} results</strong>
          </Typography>
          <Typography color={colors.textLight} fontSize="14px">
            Showing {currentShowingStart} to{" "}
            {currentShowingEnd > totalRecords
              ? totalRecords
              : currentShowingEnd}{" "}
            entries
          </Typography>
        </Box>
      ) : null}
      <Box display="flex" alignItems="center">
        <ul
          className={classnames("pagination-container", {
            [className]: className,
          })}
        >
          <li
            className={classnames("pagination-item", {
              disabled: paginationRange?.length === 1 || _currentPage === 1,
            })}
            onClick={onPrevious}
          >
            <div className="arrow left" />
          </li>
          {paginationRange?.map((pageNumber: number | string) => {
            if (pageNumber === DOTS) {
              return (
                <li className="pagination-item dots" key={pageNumber}>
                  &#8230;
                </li>
              );
            }
            return (
              <li
                key={pageNumber}
                className={classnames("pagination-item", {
                  selected:
                    _currentPage?.toString() === "0" ||
                    pageNumber === _currentPage,
                })}
                onClick={() => onPageChange(pageNumber)}
              >
                {pageNumber}
              </li>
            );
          })}

          <li
            className={classnames("pagination-item", {
              disabled:
                paginationRange?.length === 1 || _currentPage === lastPage,
            })}
            onClick={onNext}
          >
            <div className="arrow right" />
          </li>
        </ul>
        {isMobile ? null : (
          <select
            className="select"
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              _onLimitChange(e)
            }
          >
            {[10, 20, 50]?.map((val: number) => {
              return (
                <option value={val} key={val}>
                  {val}
                </option>
              );
            })}
          </select>
        )}
      </Box>
    </Box>
  );
};

export default Pagination;
