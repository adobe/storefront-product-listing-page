/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { FunctionComponent } from "preact";

import { EmptyHeart, FilledHeart } from "@/icons";

import { useWishlist } from "../../context";
import { WishlistItem } from "../../types/interface";
import { AddToWishlistPlacement } from "../../types/widget";
import { classNames } from "../../utils/dom";

export interface WishlistButtonProps {
    type: AddToWishlistPlacement;
    productSku: string;
}

export const WishlistButton: FunctionComponent<WishlistButtonProps> = ({ type, productSku }: WishlistButtonProps) => {
    const { isAuthorized, wishlist, addItemToWishlist, removeItemFromWishlist } = useWishlist();
    const wishlistItemStatus: WishlistItem | undefined = wishlist?.items_v2?.items.filter(
        (ws) => ws.product.sku === productSku,
    )[0];
    const isWishlistItem = !!wishlistItemStatus;

    const heart = isWishlistItem ? <FilledHeart /> : <EmptyHeart />;

    const preventBubbleUp = (e: any) => {
        // prevent <a> parent link from firing
        e.stopPropagation();
        e.preventDefault();
    };

    const handleAddWishlist = (e: any) => {
        preventBubbleUp(e);
        const selectedWishlistId = wishlist?.id as string;
        if (isAuthorized) {
            const wishlistItem = {
                sku: productSku,
                quantity: 1,
            };
            addItemToWishlist(selectedWishlistId, wishlistItem);
        } else {
            // FIXME: This will need revisit for AEM/CIF since this url does not exist
            window.location.href = `${window.origin}/customer/account/login/`;
        }
    };

    const handleRemoveWishlist = (e: any) => {
        preventBubbleUp(e);
        if (!wishlistItemStatus) return;
        const selectedWishlistId = wishlist?.id as string;
        removeItemFromWishlist(selectedWishlistId, wishlistItemStatus.id);
    };

    return (
        <div
            className={classNames(
                `ds-sdk-wishlist-${type}-button mt-[-2px]`,
                type !== "inLineWithName" ? "w-[30px] absolute top-0 right-0" : "w-[24px]",
            )}
        >
            <div onClick={isWishlistItem ? handleRemoveWishlist : handleAddWishlist}>{heart}</div>
        </div>
    );
};
