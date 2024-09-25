/*
Copyright 2024 Adobe
All Rights Reserved.
NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { FunctionComponent } from "preact";

import { useProducts } from "@/context";
import { GridView, ListView } from "@/icons";
import { handleViewType } from "@/utils/handleUrlFilters";

export const ViewSwitcher: FunctionComponent = () => {
    const { viewType, setViewType } = useProducts();

    const handleClick = (viewType: string): void => {
        handleViewType(viewType);
        setViewType(viewType);
    };

    return (
        <div className="flex justify-between">
            <button
                className={`flex items-center ${
                    viewType === "gridview" ? "bg-gray-100" : ""
                } ring-black ring-opacity-5  p-sm text-sm h-[32px] border border-gray-300`}
                onClick={() => handleClick("gridview")}
            >
                <GridView className="h-[20px] w-[20px]" />
            </button>
            <button
                className={`flex items-center ${
                    viewType === "listview" ? "bg-gray-100" : ""
                } ring-black ring-opacity-5 p-sm text-sm h-[32px] border border-gray-300`}
                onClick={() => handleClick("listview")}
            >
                <ListView className="h-[20px] w-[20px]" />
            </button>
        </div>
    );
};
