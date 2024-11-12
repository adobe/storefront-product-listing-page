/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import {FunctionComponent} from 'preact';
import '../GoButton/GoButton.css';
import {TranslationContext} from '../../context';
import {useContext} from "preact/hooks";

export interface GoButtonProps {
    onClick: (e: any) => any;
}

export const GoButton: FunctionComponent<GoButtonProps> = ({
                                                               onClick,
                                                           }: GoButtonProps) => {
    const translation = useContext(TranslationContext);
    const translatedText = 'GoButton' in translation ? translation.GoButton.text : 'Go';
    return (
        <div className="ds-sdk-go-button absolute w-full bottom-[0] left-[0]">
            <div
                class="go-button text hover:no-underline bg-black hover:bg-[#904745] hover:border-t-[solid_1px_#f55d66] cursor-pointer"
                onClick={onClick}>
                {translatedText}
            </div>
        </div>
    );
};
