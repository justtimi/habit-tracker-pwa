export function getHabitSlug(name: string): string {
  const lowercase = name.toLowerCase();
  const trimmed = lowercase.trim();
  const hyphen = trimmed.replace(/\s+/g, "-");
  const cleaned = hyphen.replace(/[^a-z0-9-]/g, "");
  return cleaned;
}
