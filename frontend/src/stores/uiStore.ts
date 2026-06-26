"use client";

import { create } from "zustand";

interface UiState {
  isCheckoutOpen: boolean;
  isUpsellOpen: boolean;
  isMenuOpen: boolean;
  openCheckout: () => void;
  closeCheckout: () => void;
  openUpsell: () => void;
  closeUpsell: () => void;
  openMenu: () => void;
  closeMenu: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  isCheckoutOpen: false,
  isUpsellOpen: false,
  isMenuOpen: false,
  openCheckout: () => set({ isCheckoutOpen: true }),
  closeCheckout: () => set({ isCheckoutOpen: false }),
  openUpsell: () => set({ isUpsellOpen: true }),
  closeUpsell: () => set({ isUpsellOpen: false }),
  openMenu: () => set({ isMenuOpen: true }),
  closeMenu: () => set({ isMenuOpen: false }),
}));
