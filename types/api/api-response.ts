import type { EUserInfo } from '../schemas/base/EAuthUser'

export interface Meta {
  createdBy: number
  createdOn: Date
  updatedOn?: Date
  updatedBy?: number
}

export interface MetaWithInfo extends Meta {
  _createdBy?: EUserInfo
  _updatedBy?: EUserInfo 
}


export interface ApiListResponse<T> {
  items: T[]
  totalCount: number
  returnedCount: number
  offset: number
  limit: number  
}

