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
  ar_AE,
  bg_BG,
  bn_IN,
  ca_ES,
  cs_CZ,
  da_DK,
  de_DE,
  el_GR,
  en_GA,
  en_GB,
  en_US,
  es_ES,
  es_MX,
  et_EE,
  eu_ES,
  fa_IR,
  fi_FI,
  fr_FR,
  gl_ES,
  hi_IN,
  hu_HU,
  hy_AM,
  id_ID,
  it_IT,
  ja_JA,
  ja_JP,
  ko_KR,
  lt_LT,
  lv_LV,
  nb_NO,
  nl_NL,
  no_NO,
  pt_BR,
  pt_PT,
  ro_RO,
  ru_RU,
  Sorani,
  sv_SE,
  th_TH,
  tr_TR,
  zh_Hans_CN,
  zh_Hant_TW,
} from '../i18n';
import { useStore } from './store';

export type Language = { [key: string]: any };
export type Languages = { [key: string]: Language };

export const languages: Languages = {
  default: en_US,
  ar: ar_AE,
  bg_BG,
  bn: bn_IN,
  ca_ES,
  cs_CZ,
  da_DK,
  de_DE,
  el_GR,
  en_GA,
  en_GB,
  en_US,
  es_ES,
  es_MX,
  et_EE,
  eu_ES,
  fa_IR,
  fi_FI,
  fr_FR,
  gl_ES,
  hi_IN,
  hu_HU,
  hy: hy_AM,
  id_ID,
  it_IT,
  ja_JA,
  ja: ja_JP,
  ko_KR,
  lt_LT,
  lv_LV,
  nb_NO,
  nl_NL,
  nn: no_NO,
  pt_BR,
  pt_PT,
  ro_RO,
  ru_RU,
  Sorani,
  sv_SE,
  th_TH,
  tr_TR,
  zh_Hans_CN,
  zh_Hant_TW,
};
export const TranslationContext = createContext(languages.default);

const useTranslation = () => {
  const translation = useContext(TranslationContext);
  return translation;
};

const Translation: FunctionComponent = ({ children }) => {
  const storeCtx = useStore();

  const getCurrLanguage = () => {
    const languageDetected = storeCtx?.config?.locale ?? '';

    if (Object.keys(languages).includes(languageDetected)) {
      return languageDetected;
    } else if (
      Object.keys(languages).includes(languageDetected.split('_')[0])
    ) {
      return languageDetected.split('_')[0];
    } else if (
      Object.keys(languages).includes(navigator.language.replace('-', '_'))
    ) {
      return navigator.language.replace('-', '_');
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
