export interface GlossaryTriggerRect {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export interface GlossaryViewport {
  width: number;
  height: number;
}

export interface GlossaryPopoverLayout {
  left: number;
  width: number;
  maxHeight: number;
  top?: number;
  bottom?: number;
}

const MOBILE_BREAKPOINT = 640;
const VIEWPORT_MARGIN = 12;
const POPOVER_GAP = 8;
const DESKTOP_WIDTH = 320;
const ESTIMATED_HEIGHT = 180;

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(Math.max(value, minimum), maximum);
}

export function getGlossaryPopoverLayout(
  trigger: GlossaryTriggerRect,
  viewport: GlossaryViewport,
): GlossaryPopoverLayout {
  const availableWidth = Math.max(0, viewport.width - VIEWPORT_MARGIN * 2);
  const width = Math.min(DESKTOP_WIDTH, availableWidth);

  // A bottom sheet is more predictable on phones: long definitions never run
  // off either side, regardless of where the inline term wraps.
  if (viewport.width < MOBILE_BREAKPOINT) {
    return {
      left: VIEWPORT_MARGIN,
      bottom: VIEWPORT_MARGIN,
      width,
      maxHeight: Math.max(0, viewport.height - VIEWPORT_MARGIN * 2),
    };
  }

  const centeredLeft = (trigger.left + trigger.right - width) / 2;
  const left = clamp(
    centeredLeft,
    VIEWPORT_MARGIN,
    Math.max(VIEWPORT_MARGIN, viewport.width - width - VIEWPORT_MARGIN),
  );
  const roomBelow = viewport.height - trigger.bottom - POPOVER_GAP - VIEWPORT_MARGIN;
  const roomAbove = trigger.top - POPOVER_GAP - VIEWPORT_MARGIN;
  const showAbove = roomBelow < ESTIMATED_HEIGHT && roomAbove > roomBelow;
  const maxHeight = Math.max(0, Math.min(
    viewport.height - VIEWPORT_MARGIN * 2,
    showAbove ? roomAbove : roomBelow,
  ));

  return showAbove
    ? {
        left,
        bottom: viewport.height - trigger.top + POPOVER_GAP,
        width,
        maxHeight,
      }
    : {
        left,
        top: trigger.bottom + POPOVER_GAP,
        width,
        maxHeight,
      };
}
