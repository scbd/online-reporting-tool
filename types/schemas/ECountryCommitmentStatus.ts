
import type { ELstring } from "./base/ELstring";
import type { EUserInfo } from "./base/EUserInfo";

export interface CountryCommitmentStatus {
  identifier: string
  title: ELstring
  government: string
  endorsed?: boolean
  meta: {
    createdBy: number
    createdOn: Date
    updatedOn?: Date
    updatedBy?: number,
    createdByInfo: EUserInfo,
    updatedByInfo:EUserInfo
  }
}