// pages/index.tsx
export default function Index() {
  // ここでリダイレクト！🔄
  if (typeof window !== 'undefined') {
    window.location.href = '/1';
  }
  return null;
}
