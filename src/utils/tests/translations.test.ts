/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { getCurrLanguage } from '../../context/translation';

// Locales Widgets Support V1
const widgetsLocales = [
  'bg_BG',
  'ca_ES',
  'cs_CZ',
  'da_DK',
  'de_DE',
  'el_GR',
  'en_GB',
  'en_US',
  'es_ES',
  'et_EE',
  'eu_ES',
  'fa_IR',
  'fi_FI',
  'fr_FR',
  'gl_ES',
  'hi_IN',
  'hu_HU',
  'id_ID',
  'it_IT',
  'ja_JP',
  'ko_KR',
  'lt_LT',
  'lv_LV',
  'nb_NO',
  'nl_NL',
  'pt_BR',
  'pt_PT',
  'ro_RO',
  'ru_RU',
  'sv_SE',
  'th_TH',
  'tr_TR',
  'zh_Hans_CN',
  'zh_Hant_TW',
];

//Locales Widgets does not support further info: https://wiki.corp.adobe.com/display/ACDS/Widgets+i18n+Translation
const mockLocales = [
  'ar_AE',
  'ar_SA',
  'ar_MA',
  'ar_EG',
  'bn_IN',
  'hy_AM',
  'en_GA',
  'Sorani',
];

describe('Get language based on passed locale', () => {
  it('returns the detected language from list of locales widgets supports', () => {
    widgetsLocales.forEach((locale) => {
      expect(getCurrLanguage(locale)).toBe(locale);
    });
  });

  it('returns default when locale is not recognized', () => {
    expect(getCurrLanguage('xr_XX')).toBe('default');
  });
});

describe('Get language based on locales Widgets does not support', () => {
  it('returns default when locale is not recognized', () => {
    mockLocales.forEach((locale) => {
      expect(getCurrLanguage(locale)).toBe('default');
    });
  });
});
