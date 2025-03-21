import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { Toaster } from "@/components/ui/sonner"; // Import Toaster for rendering
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider defaultTheme="system">
      <AuthProvider>
        <Component {...pageProps} />
        <Toaster /> {/* Corrected usage */}
      </AuthProvider>
    </ThemeProvider>
  );
}
