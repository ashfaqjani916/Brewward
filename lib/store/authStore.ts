
// import { create } from 'zustand';
// import { persist, createJSONStorage } from 'zustand/middleware';

// interface AuthState {
//   isAuthenticated: boolean;
//   phoneNumber: string | null;
//   token: string | null;
//   loginTimestamp: number | null;
//   login: (phoneNumber: string, token: string) => void;
//   logout: () => void;
//   isSessionValid: () => boolean;
// }

// const SESSION_DURATION_MS = 25 * 60 * 1000; 

// export const useAuthStore = create<AuthState>()(
//   persist(
//     (set, get) => ({
//       isAuthenticated: false,
//       phoneNumber: null,
//       token: null,
//       loginTimestamp: null,

//       login: (phoneNumber: string, token: string) =>
//         set({
//           isAuthenticated: true,
//           phoneNumber,
//           token,
//           loginTimestamp: Date.now(),
//         }),

//       logout: () =>
//         set({
//           isAuthenticated: false,
//           phoneNumber: null,
//           token: null,
//           loginTimestamp: null,
//         }),

//       isSessionValid: () => {
//         const { isAuthenticated, loginTimestamp } = get();
//         if (!isAuthenticated || !loginTimestamp) return false;
//         return Date.now() - loginTimestamp <= SESSION_DURATION_MS;
//       },
//     }),
//     {
//       name: 'auth-storage',
//       storage: createJSONStorage(() => sessionStorage),
//       partialize: (state) => ({
//         isAuthenticated: state.isAuthenticated,
//         phoneNumber: state.phoneNumber,
//         token: state.token,
//         loginTimestamp: state.loginTimestamp,
//       }),
//     }
//   )
// );
