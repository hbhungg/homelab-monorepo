import { useState } from 'react';
import './App.css';
import { LoginForm } from './components/login-form';
import { SignupForm } from './components/signup-form';
import { ThemeProvider } from './components/theme-provider';
import { Button } from './components/ui/button';

function App() {
  const [show, setShow] = useState('signin');

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="absolute top-4 right-4 flex gap-2">
        <Button variant="outline" onClick={() => setShow('signup')}>
          Sign Up
        </Button>
        <Button variant="outline" onClick={() => setShow('login')}>
          Sign In
        </Button>
      </div>
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          {show === 'signup' ? <SignupForm onSwitchForm={setShow} /> : <LoginForm onSwitchForm={setShow} />}
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
