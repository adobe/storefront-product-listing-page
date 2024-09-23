/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { useEffect, useRef, useState } from "preact/hooks";

import { PageSizeOption, SortOption } from "../types/interface";

const registerOpenDropdownHandlers = ({
    options,
    activeIndex,
    setActiveIndex,
    select,
}: {
    options: SortOption[] | PageSizeOption[];
    activeIndex: number;
    setActiveIndex: (index: number) => void;
    select: (value: string | number | null) => void;
}) => {
    const optionsLength = options.length;
    const keyDownCallback = (e: KeyboardEvent) => {
        e.preventDefault();

        switch (e.key) {
            case "Up":
            case "ArrowUp":
                e.preventDefault();
                setActiveIndex(activeIndex <= 0 ? optionsLength - 1 : activeIndex - 1);
                return;
            case "Down":
            case "ArrowDown":
                e.preventDefault();
                setActiveIndex(activeIndex + 1 === optionsLength ? 0 : activeIndex + 1);
                return;
            case "Enter":
            case " ": // Space
                e.preventDefault();
                select(options[activeIndex].value);
                return;
            case "Esc":
            case "Escape":
                e.preventDefault();
                select(null);
                return;
            case "PageUp":
            case "Home":
                e.preventDefault();
                setActiveIndex(0);
                return;
            case "PageDown":
            case "End":
                e.preventDefault();
                setActiveIndex(options.length - 1);
                return;
        }
    };
    document.addEventListener("keydown", keyDownCallback);
    return () => {
        document.removeEventListener("keydown", keyDownCallback);
    };
};

const registerClosedDropdownHandlers = ({ setIsDropdownOpen }: { setIsDropdownOpen: (value: boolean) => void }) => {
    const keyDownCallback = (e: KeyboardEvent) => {
        switch (e.key) {
            case "Up":
            case "ArrowUp":
            case "Down":
            case "ArrowDown":
            case " ": // Space
            case "Enter":
                e.preventDefault();
                setIsDropdownOpen(true);
        }
    };
    document.addEventListener("keydown", keyDownCallback);
    return () => {
        document.removeEventListener("keydown", keyDownCallback);
    };
};

const isSafari = () => {
    const chromeInAgent = navigator.userAgent.indexOf("Chrome") > -1;
    const safariInAgent = navigator.userAgent.indexOf("Safari") > -1;
    return safariInAgent && !chromeInAgent;
};

export const useAccessibleDropdown = ({
    options,
    value,
    onChange,
}: {
    options: SortOption[] | PageSizeOption[];
    value: string | number;
    onChange: (value: any) => void;
}) => {
    const [isDropdownOpen, setIsDropdownOpenInternal] = useState(false);
    const listRef = useRef<HTMLUListElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isFocus, setIsFocus] = useState(false);
    const select = (value: any) => {
        if (value) {
            onChange && onChange(value);
        }
        setIsDropdownOpen(false);
        setIsFocus(false);
    };

    const setIsDropdownOpen = (v: boolean) => {
        if (v) {
            const selected = options?.findIndex((o) => o.value === value);

            setActiveIndex(selected < 0 ? 0 : selected);
            if (listRef.current && isSafari()) {
                requestAnimationFrame(() => {
                    listRef?.current?.focus();
                });
            }
        } else if (listRef.current && isSafari()) {
            requestAnimationFrame(() => {
                (listRef?.current?.previousSibling as HTMLUListElement)?.focus();
            });
        }
        setIsDropdownOpenInternal(v);
    };

    useEffect(() => {
        if (isDropdownOpen) {
            return registerOpenDropdownHandlers({
                activeIndex,
                setActiveIndex,
                options,
                select,
            });
        }
        if (isFocus) {
            return registerClosedDropdownHandlers({
                setIsDropdownOpen,
            });
        }
    }, [isDropdownOpen, activeIndex, isFocus]);

    return {
        isDropdownOpen,
        setIsDropdownOpen,
        activeIndex,
        setActiveIndex,
        select,
        setIsFocus,
        listRef,
    };
};
