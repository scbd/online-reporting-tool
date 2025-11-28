export interface IndicatorMapping {
  identifier: string
  code: string
  title: string
}
export interface IndicatorData {
  indicatorCode : string
  hasDisaggregation : boolean
  disaggregationType:string
  disaggregation : string
  year : Number
  unit : string
  value : Number
  footnote : string
}