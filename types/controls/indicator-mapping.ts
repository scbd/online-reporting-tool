export interface IndicatorMapping {
  identifier: string
  code: string
  title: string
}
export interface IndicatorData {
  indicatorCode : string
  hasDisaggregation : string
  disaggregation : string
  year : Number
  unit : string
  value : Number
  footnote : string
}