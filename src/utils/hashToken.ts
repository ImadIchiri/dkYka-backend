import crypto from "crypto";

// Used to hash the RefreshToken before saving it to the database.
export const hashToken = (token: string) =>
  crypto.createHash("sha512").update(token).digest("hex");
