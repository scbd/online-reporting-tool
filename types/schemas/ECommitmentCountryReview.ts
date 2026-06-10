
import type { ELstring } from "./base/ELstring";
import type { EUserInfo } from "./base/EUserInfo";
import type { ApiListResponse, MetaWithInfo } from "../api/api-response";

export interface ECommitmentCountryReview {
  identifier: string
  title: ELstring
  government: string
  reviewed?: boolean
  organization: ELstring
  organizationAcronym: ELstring
  meta: {
    createdBy: number
    createdOn: Date
    updatedOn?: Date
    updatedBy?: number,
    //TODO delete over the period of time the new _createdBy and _updatedBy are in place
    createdByInfo?: EUserInfo,
    updatedByInfo?:EUserInfo,
    _createdBy?: EUserInfo,
    _updatedBy?: EUserInfo 
  }
}


export interface CommitmentReviewsQuery {
  identifier?: string, government?: string, realm:string, reviewed?:boolean, reviewStatus?:string
}
export interface CommitmentReviewsStatsQuery extends CommitmentReviewsQuery {
  countryStats?:boolean, organizationStats?:boolean
}
export interface CommitmentReviewsStats {
  all: number
  awaitingReview: number
  reviewed: number
  returned: number
  autoReviewed: number
}

export interface OrganizationStats {
  organization: ELstring
  organizationAcronym: ELstring
  count: number
  stats: CommitmentReviewsStats
}

export interface CountryStats {
  country: string
  stats: CommitmentReviewsStats
}

export interface CommitmentReviewsStatsResponse {
  stats: CommitmentReviewsStats
  organizationStats?: OrganizationStats[]
  countryStats?: CountryStats[]
}