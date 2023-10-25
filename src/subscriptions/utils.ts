import { createHash } from "crypto";

export const createAccountHash = (account: string): string => {
    const hash = createHash('sha512');
    hash.update(account);
    return hash.digest('hex');
}