/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';

import { useProducts, useSensor } from '../../context';
import { ELLIPSIS, usePagination } from '../../hooks/usePagination';
import Chevron from '../../icons/chevron.svg';
import Guillemet from '../../icons/guillemet.svg';

interface PaginationProps {
  onPageChange: (page: number | string) => void;
  totalPages: number;
  currentPage: number;
}

export const Pagination: FunctionComponent<PaginationProps> = ({
  onPageChange,
  totalPages,
  currentPage,
}) => {
  const productsCtx = useProducts();
  const paginationRange = usePagination({
    currentPage,
    totalPages,
  });
  const { screenSize } = useSensor();

  useEffect(() => {
    const { currentPage, totalPages } = productsCtx;
    if (currentPage > totalPages) {
      onPageChange(totalPages);
    }

    return () => {};
  }, []);
  const onPrevious = (evt: Event) => {
    evt.preventDefault();

    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const onNext = (evt: Event) => {
    evt.preventDefault();

    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const onFirst = (evt: Event) => {
    evt.preventDefault();

    if (currentPage > 1) {
      onPageChange(1);
    }
  }

  const onLast = (evt: Event) => {
    evt.preventDefault();

    if (currentPage < totalPages) {
      onPageChange(totalPages);
    }
  }

  return (
    <ul className="ds-plp-pagination flex justify-center items-center list-none gap-[6px] h-[36px] text-[14px] font-normal">
      <li className="border border-solid border-[#ddd] h-[100%]">
        <a 
          href="?p=1"
          className="flex items-center justify-center px-[12px] py-xsmall h-[100%] gap-xxsmall"
          onClick={onFirst}>
          <Guillemet
            className={`h-small w-small transform ${
              currentPage === 1
                ? 'stroke-neutral-600 cursor-not-allowed'
                : 'stroke-brand-700 cursor-pointer'
            }`}
          />
          {screenSize.desktop && <span>First</span>}
        </a>
      </li>
      <li className="border border-solid border-[#ddd] h-[100%]">
        <a 
          className="flex items-center justify-center px-[12px] py-xsmall h-[100%] gap-xxsmall"
          href={`?p=${currentPage - 1}`}
          onClick={onPrevious}>
          <Chevron
            className={`h-sm w-sm transform rotate-90 ${
              currentPage === 1
                ? 'stroke-neutral-600 cursor-not-allowed'
                : 'stroke-brand-700 cursor-pointer'
            }`}
          />
          {screenSize.desktop && <span>Back</span>}
        </a>
      </li>
      

      {paginationRange?.map((page: number | string) => {
        if (page === ELLIPSIS) {
          return (
            <li
              key={page}
              className="ds-plp-pagination__dots text-brand-300 h-[100%] border border-solid border-[#ddd]"
            >
              <button className="flex items-center jupx-[12px] px-[12px] py-xsmall h-[100%]">...</button>
            </li>
          );
        }

        return (
          <li
            key={page}
            className={`ds-plp-pagination__item text-brand-700 h-[100%] border border-solid border-[#ddd] ${
              currentPage === page
                ? 'ds-plp-pagination__item--current bg-black text-white'
                : ''
            }`}
          >
            <a 
              href={`?p=${currentPage}`}
              className="flex items-center jupx-[12px] px-[12px] py-xsmall h-[100%]"
              onClick={(evt: Event) => {
                evt.preventDefault();
                onPageChange(page)
              }}>
              {page}
            </a>
          </li>
        );
      })}
      <li className="border border-solid border-[#ddd] h-[100%]">
        <a 
          href={`?p=${currentPage + 1}`}
          className="flex items-center justify-center px-[12px] py-xsmall h-[100%] gap-xxsmall"
          onClick={onNext}>
          {screenSize.desktop && <span>Next</span>}
          <Chevron
            className={`h-sm w-sm transform -rotate-90 ${
              currentPage === totalPages
                ? 'stroke-neutral-600 cursor-not-allowed'
                : 'stroke-brand-700 cursor-pointer'
            }`}
          />
        </a>
      </li>
      <li className="border border-solid border-[#ddd] h-[100%]">
        <a
          href={`?p=${totalPages}`}
          className="flex items-center justify-center px-[12px] py-xsmall h-[100%] gap-xxsmall"
          onClick={onLast}>
          {screenSize.desktop && <span>Last</span>}
          <Guillemet
            className={`h-small w-small transform rotate-180 ${
              currentPage === totalPages
                ? 'stroke-neutral-600 cursor-not-allowed'
                : 'stroke-brand-700 cursor-pointer'
            }`}
          />
        </a>
      </li>
    </ul>
  );
};

export default Pagination;
