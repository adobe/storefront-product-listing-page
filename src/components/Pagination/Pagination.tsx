import { FunctionComponent } from 'preact';

import { ELLIPSIS, usePagination } from '../../hooks/usePagination';
import { classNames } from '../../utils/dom';
import Chevron from '../../widget-sdk/icons/chevron.svg';

interface PaginationProps {
  onPageChange: (page: number | string) => void;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export const Pagination: FunctionComponent<PaginationProps> = ({
  onPageChange,
  totalPages,
  currentPage,
  pageSize,
}) => {
  const paginationRange = usePagination({
    pageSize,
    currentPage,
    totalPages,
  });

  const onPrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const onNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <ul className="ds-plp-pagination flex justify-center items-center mt-2 mb-6 list-none">
      <Chevron
        className={classNames(
          'h-sm w-sm transform rotate-90',
          currentPage === 1
            ? 'stroke-gray-400 cursor-not-allowed'
            : 'stroke-gray-600 cursor-pointer'
        )}
        onClick={onPrevious}
      />

      {paginationRange?.map((page: number | string) => {
        if (page === ELLIPSIS) {
          return (
            <li
              key={page}
              className="ds-plp-pagination__dots text-gray-500 mx-sm my-auto"
            >
              ...
            </li>
          );
        }

        return (
          <li
            key={page}
            className={classNames(
              'ds-plp-pagination__item flex items-center cursor-pointer text-center text-gray-500 my-auto mx-md',
              currentPage === page
                ? 'ds-plp-pagination__item--current text-black font-medium underline underline-offset-4 decoration-black'
                : ''
            )}
            onClick={() => onPageChange(page)}
          >
            {page}
          </li>
        );
      })}

      <Chevron
        className={classNames(
          'h-sm w-sm transform -rotate-90',
          currentPage === totalPages
            ? 'stroke-gray-400 cursor-not-allowed'
            : 'stroke-gray-600 cursor-pointer'
        )}
        onClick={onNext}
      />
    </ul>
  );
};

export default Pagination;
