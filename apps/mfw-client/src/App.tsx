import './App.css';
import { LoginForm } from './components/login-form';
import { ModeToggle } from './components/mode-toggle';
import { SignupForm } from './components/signup-form';
import { ThemeProvider } from './components/theme-provider';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <SignupForm />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
