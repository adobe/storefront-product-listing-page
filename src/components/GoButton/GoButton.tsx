/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import {FunctionComponent} from 'preact';
import '../GoButton/GoButton.css';

export interface GoButtonProps {
    onClick: (e: any) => any;
}

export const GoButton: FunctionComponent<GoButtonProps> = ({
                                                               onClick,
                                                           }: GoButtonProps) => {
    return (
        <div className="ds-sdk-go-button absolute w-full bottom-[0] left-[0]">
            <div
                class="go-button text hover:no-underline bg-black hover:bg-[#f55d66] hover:border-t-[solid_1px_#f55d66]"
                onClick={onClick}>
                GO
            </div>
        </div>
    );
};
