import type { EUserInfo } from "./EUserInfo";
export interface ELockInfo {
    lockID: string;
    lockedOn: Date;
    lockedBy: EUserInfo;
}