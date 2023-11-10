/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import {
  createContext,
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from 'preact/compat';

import {
  de_DE,
  en_US,
  es_MX,
  fr_FR,
  it_IT,
  ja_JA,
  nl_NL,
  no_NO,
  pt_PT,
} from '../i18n';
import { useStore } from './store';

export type Language = { [key: string]: any };
export type Languages = { [key: string]: Language };

export const languages: Languages = {
  default: en_US,
  en: en_US,
  fr: fr_FR,
  es: es_MX,
  de: de_DE,
  it: it_IT,
  ja: ja_JA,
  nl: nl_NL,
  no: no_NO,
  pt: pt_PT,
};
export const TranslationContext = createContext(languages.default);

const useTranslation = () => {
  const translation = useContext(TranslationContext);
  return translation;
};

const Translation: FunctionComponent = ({ children }) => {
  const storeCtx = useStore();

  const getCurrLanguage = () => {
    const languageDetected =
      storeCtx?.config?.locale?.split('_')[0] ||
      navigator.language.split('-')[0];
    if (Object.keys(languages).includes(languageDetected)) {
      return languageDetected;
    }
    return 'default';
  };

  const [currLanguage, setCurrLanguage] = useState(getCurrLanguage);

  useEffect(() => {
    () => setCurrLanguage(getCurrLanguage);
  }, [navigator.language]);

  return (
    <TranslationContext.Provider value={languages[currLanguage]}>
      {children}
    </TranslationContext.Provider>
  );
};
export default Translation;
export { useTranslation };
