/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { FunctionComponent } from 'preact';

import { useTranslation } from '../../context/translation';

export interface ApplyFilterButtonProps {
    displayFilter: () => void;
    title?: string;
}
export const ApplyFilterButton: FunctionComponent<ApplyFilterButtonProps> = ({
  displayFilter,
  title,
}: ApplyFilterButtonProps) => {
  const translation = useTranslation();
    return (
        <div className="ds-sdk-filter-button">
            <button
                className="bg-black text-white ring-black ring-opacity-5 text-[0.875rem] rounded-[0.7rem] w-[9.45rem] h-[2.6rem] font-['FuturaBT-Light']"
                onClick={displayFilter}
            >
                {title}
            </button>
        </div>
        )
};
