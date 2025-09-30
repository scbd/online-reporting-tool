
import type { ELstring } from "./base/ELstring";
import type { EUserInfo } from "./base/EUserInfo";

export interface StakeholderEndorsement {
  identifier: string
  title: ELstring
  country: string
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