# NeonOS Firestore Security Specification

## Data Invariants
1. **Owner-Only PII Isolation**: `/users/{userId}` contains `email` and account data. Only the owner (`request.auth.uid == userId`) or a verified admin may read or modify it. Blanket reads and `list` queries are forbidden.
2. **Subscription Tamper Protection**: Clients may only initialize `subscriptionTier == 'free'`, `subscriptionStatus == 'active'`, and `stripeCustomerId == ''`. Client updates cannot mutate `subscriptionTier`, `subscriptionStatus`, `stripeCustomerId`, `uid`, or `createdAt`.
3. **Master Gate for Subcollections**: Every write to `/users/{userId}/customProfiles/{profileId}` and `/users/{userId}/cloudSnapshots/{snapshotId}` verifies the parent `/users/{userId}` document exists and matches `request.auth.uid == userId`.
4. **Verified Identity & Strict Timestamps**: All writes require `request.auth != null && request.auth.token.email_verified == true` and enforce `createdAt == request.time` on create and `updatedAt == request.time` on update.
5. **Strict Key Allowlists & Size Bounds**: Every create enforces `hasAll` + `hasOnly`, every update enforces `affectedKeys().hasOnly(...)` wrapped by `isValid[Entity](incoming())`, and every string and array has strict `.size()` bounds.

## The Dirty Dozen Adversarial Payloads (Expected: PERMISSION_DENIED)
1. **Self-Upgrade Subscription Spoofing**: `create /users/uid1` with `subscriptionTier: "lifetime"`.
2. **Shadow Field Injection**: `update /users/uid1` adding `isAdmin: true`.
3. **Cross-User PII Read**: User `uid2` reading `/users/uid1`.
4. **Unverified Email Write**: Auth token with `email_verified: false` writing `/users/uid1`.
5. **ID Poisoning**: Creating `/users/uid1/customProfiles/../../../evil` or >128 chars.
6. **Client Timestamp Forgery**: Creating `/users/uid1` with `createdAt: 2020-01-01T00:00:00Z`.
7. **Orphan Subcollection Write**: Creating `/users/uid1/customProfiles/p1` when `/users/uid1` does not exist.
8. **Immutable Field Mutation**: Updating `ownerId` or `createdAt` on `/users/uid1/customProfiles/p1`.
9. **Array Resource Exhaustion**: Writing `cloudSnapshots` with `missions.size() > 100`.
10. **Value Poisoning on Whitelisted Key**: Updating `gamerTag` to a 500-char string or boolean.
11. **Inquiry Status Tampering**: Non-admin creating `/creatorInquiries/i1` with `status: "reviewed"`.
12. **Blanket Inquiry Scraping**: Non-admin running unrestricted `list` on `/creatorInquiries` without `ownerId == request.auth.uid`.
