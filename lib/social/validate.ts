import { COMMENT_BODY_MAX_LENGTH } from "@/lib/social/constants";

export function validateCommentBody(
  body: string
): { body: string } | { error: string } {
  const trimmed = body.trim();

  if (!trimmed) {
    return { error: "Comment cannot be empty." };
  }

  if (trimmed.length > COMMENT_BODY_MAX_LENGTH) {
    return {
      error: `Comment must be at most ${COMMENT_BODY_MAX_LENGTH} characters.`,
    };
  }

  return { body: trimmed };
}
