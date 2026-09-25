export function getStorageKey(): string {
  return process.env.NEXT_PUBLIC_STORAGE_KEY ?? "groupproject1:v1";
}
