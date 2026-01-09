import { BlockedUserService } from "./blockedUser";
import { PrivacySettingsService } from "./privacySettings";

export async function canSendMessage(senderId: string, receiverId: string) {
  const blockedService = new BlockedUserService();
  const privacyService = new PrivacySettingsService();

  // 1. Vérifier le blocage
  if (await blockedService.isBlocked(senderId, receiverId)) {
    return false;
  }

  // 2. Vérifier la privacy du receiver
  const settings = await privacyService.getByUser(receiverId);
  if (!settings) return false;

  if (settings.allowMessagesFrom === "NO_ONE") return false;

  // FOLLOWERS → à vérifier avec la table Follow
  return true;
}