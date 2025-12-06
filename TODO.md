# TODO: Fix Apple Carousel Overflow and Arrow Issues

## Issues Identified
- Carousel items overflow horizontally due to container max-width constraint (max-w-3xl = 768px) while 6 cards total ~2400px width
- Arrows not working properly due to scroll amount calculation and potential snap behavior interference
- Cards use w-[75vw] causing overflow on mobile screens

## Plan
- [x] Update card width from w-[75vw] to fixed w-64 (256px) for consistent sizing
- [x] Remove max-w-3xl constraint from carousel container to allow full-width scrolling
- [x] Change scroll amount from clientWidth * 0.8 to fixed 320px for reliable navigation
- [x] Remove snap-x snap-mandatory classes to prevent interference with scrollBy
- [x] Adjust arrow positioning if needed for better visibility

## Files to Edit
- components/ui/apple-cards-carousel.tsx
