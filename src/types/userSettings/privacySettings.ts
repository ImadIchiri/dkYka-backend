export enum ProfileVisibility {
  PUBLIC = "PUBLIC",
  FOLLOWERS = "FOLLOWERS",
  PRIVATE = "PRIVATE",
}

export enum PostVisibility {
  PUBLIC = "PUBLIC",
  FOLLOWERS = "FOLLOWERS",
  ONLY_ME = "ONLY_ME",
}

export enum StoryVisibility {
  PUBLIC = "PUBLIC",
  FOLLOWERS = "FOLLOWERS",
  CLOSE_FRIENDS = "CLOSE_FRIENDS",
}

export enum InteractionPermission {
  EVERYONE = "EVERYONE",
  FOLLOWERS = "FOLLOWERS",
  NO_ONE = "NO_ONE",
}

export interface UpdatePrivacySettingsDTO {
  profileVisibility?: ProfileVisibility;
  postVisibility?: PostVisibility;
  storyVisibility?: StoryVisibility;
  allowMessagesFrom?: InteractionPermission;
  allowCommentsFrom?: InteractionPermission;
  allowStoryReplies?: boolean;
  allowStoryReactions?: boolean;
}