/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { createContext, FunctionComponent } from "preact";
import { useContext, useEffect, useState } from "preact/hooks";

import { getGraphQL } from "../api/graphql";
import { ADD_TO_WISHLIST, REMOVE_FROM_WISHLIST } from "../api/mutations";
import { GET_CUSTOMER_WISHLISTS } from "../api/queries";
import { Wishlist, WishlistAddItemInput, WishlistResponse } from "../types/interface";
import { useStore } from "./store";

export interface WishlistAttributesContext {
    isAuthorized: boolean;
    wishlist: Wishlist | undefined;
    allWishlist: Wishlist[] | [];
    addItemToWishlist: (wishlistId: string, wishlistItem: WishlistAddItemInput) => void;
    removeItemFromWishlist: (wishlistId: string, wishlistItemIds: string) => void;
}

const WishlistContext = createContext({} as WishlistAttributesContext);

const useWishlist = (): WishlistAttributesContext => {
    return useContext(WishlistContext);
};

const WishlistProvider: FunctionComponent = ({ children }) => {
    const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
    const [allWishlist, setAllWishlist] = useState<Wishlist[] | []>([]);
    const [wishlist, setWishlist] = useState<Wishlist>();
    const { storeViewCode, config } = useStore();

    useEffect(() => {
        getWishlists();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getWishlists = async () => {
        const { data } = (await getGraphQL(GET_CUSTOMER_WISHLISTS, {}, storeViewCode, config?.baseUrl)) || {};
        const wishlistResponse: WishlistResponse = data?.customer;
        const isAuthorized = !!wishlistResponse;

        setIsAuthorized(isAuthorized);
        if (isAuthorized) {
            // TODO: MSRCH-4278
            // We'll need to add a way to select a wishlist
            // // FIXME: first Wishlist is temporary solution for QA as working concept
            const firstWishlist = wishlistResponse.wishlists[0];
            setWishlist(firstWishlist);
            setAllWishlist(wishlistResponse.wishlists);
        }
    };

    const addItemToWishlist = async (wishlistId: string, wishlistItem: WishlistAddItemInput) => {
        const { data } =
            (await getGraphQL(
                ADD_TO_WISHLIST,
                {
                    wishlistId,
                    wishlistItems: [wishlistItem],
                },
                storeViewCode,
                config?.baseUrl,
            )) || {};
        const wishlistResponse: Wishlist = data?.addProductsToWishlist.wishlist;
        setWishlist(wishlistResponse);
    };

    const removeItemFromWishlist = async (wishlistId: string, wishlistItemsIds: string) => {
        const { data } =
            (await getGraphQL(
                REMOVE_FROM_WISHLIST,
                {
                    wishlistId,
                    wishlistItemsIds: [wishlistItemsIds],
                },
                storeViewCode,
                config?.baseUrl,
            )) || {};
        const wishlistResponse: Wishlist = data?.removeProductsFromWishlist.wishlist;
        setWishlist(wishlistResponse);
    };

    const wishlistContext: WishlistAttributesContext = {
        isAuthorized,
        wishlist,
        allWishlist,
        addItemToWishlist,
        removeItemFromWishlist,
    };

    return <WishlistContext.Provider value={wishlistContext}>{children}</WishlistContext.Provider>;
};

export { useWishlist, WishlistProvider };
