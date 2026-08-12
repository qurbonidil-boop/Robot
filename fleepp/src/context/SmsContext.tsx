import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SmsMessage } from '@/types';
import { initialSmsHistory } from '@/data/sms';

const STORAGE_KEY = 'fleepp.sms.history';

interface SmsContextValue {
  messages: SmsMessage[];
  sendSms: (input: { studentId: string; parentId: string; text: string; sentByUserId: string }) => SmsMessage;
  messagesForStudent: (studentId: string) => SmsMessage[];
}

const SmsContext = createContext<SmsContextValue | undefined>(undefined);

export function SmsProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<SmsMessage[]>(initialSmsHistory);

  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        try {
          setMessages(JSON.parse(raw));
        } catch {
          // ignore corrupt cache, keep defaults
        }
      }
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(messages)).catch(() => {});
  }, [messages]);

  const sendSms: SmsContextValue['sendSms'] = ({ studentId, parentId, text, sentByUserId }) => {
    const newMessage: SmsMessage = {
      id: `sms-${Date.now()}`,
      studentId,
      parentId,
      text,
      sentAt: new Date().toISOString(),
      sentByUserId,
      status: 'дар роҳ',
    };
    setMessages((prev) => [newMessage, ...prev]);

    // Simulate a delivery confirmation after a short delay, like a real SMS gateway callback.
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) => (m.id === newMessage.id ? { ...m, status: 'дастрас шуд' } : m))
      );
    }, 1800);

    return newMessage;
  };

  const messagesForStudent = (studentId: string) =>
    messages.filter((m) => m.studentId === studentId).sort((a, b) => b.sentAt.localeCompare(a.sentAt));

  const value = useMemo(() => ({ messages, sendSms, messagesForStudent }), [messages]);

  return <SmsContext.Provider value={value}>{children}</SmsContext.Provider>;
}

export function useSms(): SmsContextValue {
  const ctx = useContext(SmsContext);
  if (!ctx) throw new Error('useSms бояд дар дохили SmsProvider истифода шавад.');
  return ctx;
}
