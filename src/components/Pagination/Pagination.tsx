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
  const translation = useTranslation();
  // console.log('!!!next page!!',productsCtx.loadNextPage)
  // console.log('!!!prev page!!',productsCtx.loadPrevPage)
  useEffect(() => {
    const { currentPage, totalPages } = productsCtx;
    if (currentPage > totalPages) {
      onPageChange(totalPages);
    }

    return () => {};
  }, []);
  const onPrevious = () => {
    if (currentPage > 1) {
      onPageChange(productsCtx.loadPrevPage);
    }
  };

  const onNext = () => {
    if (currentPage < totalPages) {
      onPageChange(productsCtx.loadNextPage);
    }
  };
  const paginationTranslation = translation.ProductsCounter.title.replace('{current}', `${productsCtx.items.length}`);
  const counterTranslation=paginationTranslation.replace('{total}', `${productsCtx.totalCount}`);
// console.log('(productsCtx.items.length !=(currentPage * productsCtx.pageSize))',(productsCtx.items.length !=(currentPage * productsCtx.pageSize)));
// console.log('(currentPage * productsCtx.pageSize))',(currentPage * productsCtx.pageSize));
// console.log('productsCtx.items.length',productsCtx.items.length);
// console.log('currentPage',currentPage);
  return (<div className="block w-full">
    {isOnTop && currentPage > 1 && productsCtx.loadPrevPage!=0 && (
        <div>
          <div className='text-center text-[1rem]'>{counterTranslation}</div>
          <button
              className="p-[0.63rem] w-full text-[1rem] border-[solid] border-[1px] border-black bg-black text-white uppercase font-['AvenirNextCyr-Medium'] hover:border-[#f55d66] hover:bg-[#e3787d]"
              onClick={onPrevious}>{translation.PreviousButton.title}</button>
        </div>
    )}


    {!isOnTop && (productsCtx.items.length != productsCtx.totalCount) && productsCtx.loadNextPage <= totalPages && (
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
