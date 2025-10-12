export type Client = {
  // идентификатор
  skIdCurr: number;

  // профиль
  age: number;                 // рассчитан из DAYS_BIRTH
  gender: "M" | "F" | "" | null;
  familyStatus: string;        // NAME_FAMILY_STATUS
  housingType: string;         // NAME_HOUSING_TYPE
  employment: string;          // NAME_INCOME_TYPE
  education: string;           // NAME_EDUCATION_TYPE
  occupation: string;          // OCCUPATION_TYPE
  children: number;            // CNT_CHILDREN
  familyMembers: number;       // CNT_FAM_MEMBERS

  // финансы
  incomeAnnual: number;        // AMT_INCOME_TOTAL
  creditAmount: number;        // AMT_CREDIT
  annuity: number;             // AMT_ANNUITY
  goodsPrice: number;          // AMT_GOODS_PRICE

  // риск-контекст
  extSource1: number | null;
  extSource2: number | null;
  extSource3: number | null;
  regionRatingClient: number | null;
  regionRatingClientWCity: number | null;
};
