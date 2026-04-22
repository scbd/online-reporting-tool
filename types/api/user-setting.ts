export interface UserSetting {
  _id: string
  userId: string
  meta: AuditMetadata
  alertFrequency: string
  autoReviewCommitments: boolean
}

export interface AuditMetadata {
  modifiedBy: number
  createdBy: number
  modifiedOn: string
  createdOn: string
  version: number
}
