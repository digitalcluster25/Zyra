// Type definitions for Preline
declare global {
  interface Window {
    HSStaticMethods?: {
      autoInit: () => void;
      autoInit: (el?: HTMLElement | string) => void;
    };
    HSOverlay?: any;
    HSDropdown?: any;
    HSAccordion?: any;
    HSTabs?: any;
    HSCollapse?: any;
    HSCarousel?: any;
    HSTooltip?: any;
    HSScrollspy?: any;
    HSSelect?: any;
    HSRemoveElement?: any;
    HSInputNumber?: any;
    HSTogglePassword?: any;
    HSToggleCount?: any;
    HSPinInput?: any;
    HSFileUpload?: any;
    HSCopyMarkup?: any;
    HSCombobox?: any;
    HSTreeView?: any;
  }
}

export {};

