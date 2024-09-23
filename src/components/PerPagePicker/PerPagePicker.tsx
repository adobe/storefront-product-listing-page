/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { FunctionalComponent } from "preact";
import { useEffect, useRef } from "preact/hooks";

import { Chevron } from "@/icons";

import { useAccessibleDropdown } from "../../hooks/useAccessibleDropdown";
import { PageSizeOption } from "../../types/interface";

export interface PerPagePickerProps {
    value: number;
    pageSizeOptions: PageSizeOption[];
    onChange: (pageSize: number) => void;
}

export const PerPagePicker: FunctionalComponent<PerPagePickerProps> = ({
    value,
    pageSizeOptions,
    onChange,
}: PerPagePickerProps) => {
    const pageSizeButton = useRef<HTMLButtonElement | null>(null);
    const pageSizeMenu = useRef<HTMLDivElement | null>(null);

    const selectedOption = pageSizeOptions.find((e) => e.value === value);

    const { isDropdownOpen, setIsDropdownOpen, activeIndex, setActiveIndex, select, setIsFocus, listRef } =
        useAccessibleDropdown({
            options: pageSizeOptions,
            value,
            onChange,
        });

    useEffect(() => {
        const menuRef = pageSizeMenu.current;
        const handleBlur = () => {
            setIsFocus(false);
            setIsDropdownOpen(false);
        };

        const handleFocus = () => {
            if (menuRef?.parentElement?.querySelector(":hover") !== menuRef) {
                setIsFocus(false);
                setIsDropdownOpen(false);
            }
        };

        menuRef?.addEventListener("blur", handleBlur);
        menuRef?.addEventListener("focusin", handleFocus);
        menuRef?.addEventListener("focusout", handleFocus);

        return () => {
            menuRef?.removeEventListener("blur", handleBlur);
            menuRef?.removeEventListener("focusin", handleFocus);
            menuRef?.removeEventListener("focusout", handleFocus);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageSizeMenu]);

    return (
        <>
            <div
                ref={pageSizeMenu}
                className="ds-sdk-per-page-picker ml-2 mr-2 relative inline-block text-left bg-gray-100 rounded-md outline outline-1 outline-gray-200 hover:outline-gray-600 h-[32px]"
            >
                <button
                    className="flex items-center justify-center w-full h-full text-sm font-normal text-gray-700 bg-transparent border-none rounded-md group hover:cursor-pointer hover:border-none hover:bg-transparent focus:border-none focus:bg-transparent active:border-none active:bg-transparent active:shadow-none px-sm"
                    ref={pageSizeButton}
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    onFocus={() => setIsFocus(false)}
                    onBlur={() => setIsFocus(false)}
                >
                    {selectedOption ? `${selectedOption.label}` : "24"}
                    <Chevron
                        className={`flex-shrink-0 m-auto ml-sm h-md w-md stroke-1 stroke-gray-600 ${
                            isDropdownOpen ? "" : "rotate-180"
                        }`}
                    />
                </button>
                {isDropdownOpen && (
                    <ul
                        ref={listRef}
                        className="absolute right-0 z-20 w-full mt-2 origin-top-right bg-white rounded-md shadow-2xl ds-sdk-per-page-picker__items hover:cursor-pointer ring-1 ring-black ring-opacity-5 focus:outline-none"
                    >
                        {pageSizeOptions.map((option, i) => (
                            <li
                                key={i}
                                aria-selected={option.value === selectedOption?.value}
                                onMouseOver={() => setActiveIndex(i)}
                                className={`py-xs hover:bg-gray-100 hover:text-gray-900 ${
                                    i === activeIndex ? "bg-gray-100 text-gray-900" : ""
                                }}`}
                            >
                                <a
                                    className={`ds-sdk-per-page-picker__items--item block-display px-md py-sm text-sm mb-0
                                                no-underline active:no-underline focus:no-underline hover:no-underline
                                                hover:text-gray-900 ${
                                                    option.value === selectedOption?.value
                                                        ? "ds-sdk-per-page-picker__items--item-selected font-semibold text-gray-900"
                                                        : "font-normal text-gray-800"
                                                }`}
                                    onClick={() => select(option.value)}
                                >
                                    {option.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </>
    );
};
