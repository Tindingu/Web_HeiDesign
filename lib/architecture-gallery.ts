export type GalleryOrientation = "landscape" | "portrait" | "square";

export type ArchitectureGallerySlot = {
  slotIndex: number;
  orientation: GalleryOrientation;
};

// Fixed template to keep the masonry block visually balanced and consistent.
export const ARCHITECTURE_GALLERY_SLOTS: ArchitectureGallerySlot[] = [
  { slotIndex: 1, orientation: "square" },
  { slotIndex: 2, orientation: "landscape" },
  { slotIndex: 3, orientation: "portrait" },
  { slotIndex: 4, orientation: "square" },
  { slotIndex: 5, orientation: "portrait" },
  { slotIndex: 6, orientation: "square" },
  { slotIndex: 7, orientation: "landscape" },
  { slotIndex: 8, orientation: "portrait" },
  { slotIndex: 9, orientation: "landscape" },
  { slotIndex: 10, orientation: "portrait" },
  { slotIndex: 11, orientation: "square" },
  { slotIndex: 12, orientation: "landscape" },
];

export function getExpectedOrientation(
  slotIndex: number,
): GalleryOrientation | null {
  return (
    ARCHITECTURE_GALLERY_SLOTS.find((slot) => slot.slotIndex === slotIndex)
      ?.orientation ?? null
  );
}

export function isValidArchitectureSlotCount(count: number) {
  return count === ARCHITECTURE_GALLERY_SLOTS.length;
}
