
import email from 'next-auth/providers/email';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AuthState {
  isAuthenticated: boolean;
  email: string | null;
  token: string | null;
  loginTimestamp: number | null;
  login: (email: string, token: string) => void;
  logout: () => void;
  isSessionValid: () => boolean;
}

const SESSION_DURATION_MS = 25 * 60 * 1000;

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      email: null,
      token: null,
      loginTimestamp: null,

      login: (email: string, token: string) =>
        set({
          isAuthenticated: true,
          email: email,
          token,
          loginTimestamp: Date.now(),
        }),

      logout: () =>
        set({
          isAuthenticated: false,
          email: null,
          token: null,
          loginTimestamp: null,
        }),

      isSessionValid: () => {
        const { isAuthenticated, loginTimestamp } = get();
        if (!isAuthenticated || !loginTimestamp) return false;
        return Date.now() - loginTimestamp <= SESSION_DURATION_MS;
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        email: state.email,
        token: state.token,
        loginTimestamp: state.loginTimestamp,
      }),
    }
  )
);
