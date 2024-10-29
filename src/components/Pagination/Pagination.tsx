/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';

import { useProducts,useTranslation} from '../../context';
import { ELLIPSIS, usePagination } from '../../hooks/usePagination';
import Chevron from '../../icons/chevron.svg';
interface PaginationProps {
  onPageChange: (page: number | string) => void;
  totalPages: number;
  currentPage: number;
  isOnTop:boolean;
}

export const Pagination: FunctionComponent<PaginationProps> = ({
  onPageChange,
  totalPages,
  currentPage, isOnTop
}) => {
  const productsCtx = useProducts();
  const paginationRange = usePagination({
    currentPage,
    totalPages,
  });
  const translation = useTranslation();
  useEffect(() => {
    const { currentPage, totalPages } = productsCtx;
    if (currentPage > totalPages) {
      onPageChange(totalPages);
    }

    return () => {};
  }, []);
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
  const paginationTranslation = translation.ProductsCounter.title.replace('{current}', `${productsCtx.items.length}`);
  const counterTranslation=paginationTranslation.replace('{total}', `${productsCtx.totalCount}`);

  return (<div className="block w-full">
    {isOnTop && currentPage > 1 && (
        <div>
          <div className='text-center text-[1rem]'>{counterTranslation}</div>
          <button
              className="p-[0.63rem] w-full text-[1rem] border-[solid] border-[1px] border-black bg-black text-white uppercase font-['AvenirNextCyr-Medium'] hover:border-[#f55d66] hover:bg-[#e3787d]"
              onClick={onPrevious}>{translation.PreviousButton.title}</button>
        </div>
    )}


    {!isOnTop && (
        <div>
          <div className='text-center text-[1rem]'>{counterTranslation}</div>
          <button
              className='p-[0.63rem] w-full text-[1rem] border-[solid] border-[1px] border-black bg-black text-white uppercase avenir_medium hover:border-[#f55d66] hover:bg-[#e3787d]'
              onClick={onNext}>{translation.ShowMoreButton.title}</button>
        </div>
    )}
  </div>);
};

export default Pagination;
