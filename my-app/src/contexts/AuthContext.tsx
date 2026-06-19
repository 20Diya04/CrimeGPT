import axios from 'axios';
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';


interface AuthContextValue {
  user: any;
  isAuth: boolean;
  login: () => Promise<boolean>;
  signup: (data: any) => boolean;
  logout: () => void;
  sendOtp: (phone: string) => Promise<{ ok: boolean; msg: string }>;
  verifyOtp: (phone: string, otp: string) => boolean;
}
interface JwtPayload {
  id: string;
  email: string;
  role: string;
}
const AuthCtx = createContext<AuthContextValue | null>(null);

export const useAuth = () => useContext(AuthCtx)!;

let DB: any[] = [];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [isAuth, setIsAuth] = useState(false);
  const [pending, setPending] = useState<{ phone: string; otp: string } | null>(null);
  const FAST2SMS_KEY = 'YOUR_FAST2SMS_API_KEY_HERE';

  const sendOtp = async (phone: string): Promise<{ ok: boolean; msg: string }> => {
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    setPending({ phone, otp });
    if (FAST2SMS_KEY !== 'YOUR_FAST2SMS_API_KEY_HERE') {
      try {
        const url = `https://www.fast2sms.com/dev/bulkV2?authorization=${FAST2SMS_KEY}&route=otp&variables_values=${otp}&flash=0&numbers=${phone}`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.return === true) return { ok: true, msg: `OTP sent to +91 ${phone}` };
      } catch (_) { }
    }
    alert(`[DEV] OTP for ${phone}: ${otp}\n\nReplace FAST2SMS_KEY in AuthContext to send real SMS.`);
    return { ok: true, msg: `OTP dispatched to ${phone}` };
  };

  const verifyOtp = (phone: string, otp: string) => {
    if (pending?.phone === phone && pending?.otp === otp) {
      setPending(null);
      return true;
    }
    return false;
  };

  const signup = (data: any) => {
    if (DB.find((u: any) => u.email === data.email || u.phone === data.phone)) return false;
    DB.push({ id: Date.now(), ...data });
    return true;
  };

  const login = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      return false;
    }

    try {

      const decoded = jwtDecode<JwtPayload>(token);

      const response = await axios.get(
        `http://localhost:5000/api/User/getUserDataById/${decoded.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === 1) {
        setUser(response.data.data);
        setIsAuth(true);
        return true;
      }

      return false;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuth(false);
  };

  React.useEffect(() => {
    if (DB.length === 0) {
      DB.push({ id: 1, firstName: 'Demo', lastName: 'Officer', email: 'demo@police.gov.in', password: '123456', phone: '9876543210' });
    }
  }, []);




  return (
    <AuthCtx.Provider value={{ user, isAuth, login, signup, logout, sendOtp, verifyOtp }}>
      {children}
    </AuthCtx.Provider>
  );
}
