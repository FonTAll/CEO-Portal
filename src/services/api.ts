/// <reference types="vite/client" />
import { ApiResponse } from '../types';

const SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL || '';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export async function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  try {
    const { auth } = await import('./firebase');
    const errInfo: FirestoreErrorInfo = {
      error: error instanceof Error ? error.message : String(error),
      authInfo: {
        userId: auth.currentUser?.uid,
        email: auth.currentUser?.email,
        emailVerified: auth.currentUser?.emailVerified,
        isAnonymous: auth.currentUser?.isAnonymous,
        tenantId: auth.currentUser?.tenantId,
        providerInfo: auth.currentUser?.providerData?.map(provider => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || []
      },
      operationType,
      path
    };
    console.error('Firestore Error Details: ', JSON.stringify(errInfo));
    throw new Error(JSON.stringify(errInfo));
  } catch (secondaryError) {
    if (secondaryError instanceof Error && secondaryError.message.startsWith('{')) {
      throw secondaryError;
    }
    const fallbackErrInfo: FirestoreErrorInfo = {
      error: error instanceof Error ? error.message : String(error),
      authInfo: {},
      operationType,
      path
    };
    console.error('Firestore Error (Fallback): ', JSON.stringify(fallbackErrInfo));
    throw new Error(JSON.stringify(fallbackErrInfo));
  }
}

// Output setup status for easy debugging
console.log('App initialization - GAS Backend URL configured:', !!SCRIPT_URL);

// Cache utility for static data
export const cache = {
  get: (key: string) => {
    const item = localStorage.getItem(`wms_cache_${key}`);
    if (!item) return null;
    const parsed = JSON.parse(item);
    if (Date.now() > parsed.expiry) {
      localStorage.removeItem(`wms_cache_${key}`);
      return null;
    }
    return parsed.data;
  },
  set: (key: string, data: any, ttlMinutes: number = 60) => {
    const expiry = Date.now() + ttlMinutes * 60 * 1000;
    localStorage.setItem(`wms_cache_${key}`, JSON.stringify({ data, expiry }));
  },
  clear: (key?: string) => {
    if (key) localStorage.removeItem(`wms_cache_${key}`);
    else {
      Object.keys(localStorage)
        .filter(k => k.startsWith('wms_cache_'))
        .forEach(k => localStorage.removeItem(k));
    }
  }
};

/**
 * ============================================================================
 * 🌐 Frontend API Client (เชื่อมต่อกับ Google Apps Script)
 * 
 * วิธีการทำงานของระบบนี้:
 * React จะเรียกใช้ฟังก์ชัน api.post() เพื่อดึงหรือบันทึกข้อมูล
 * JSON payload จะถูกแปลงเป็น text/plain เพื่อเลี่ยงปัญหากับ Cloudflare/CORS
 * ============================================================================
 */
export const api = {
  post: async <T = any>(action: string, sheet?: string, data?: any, params?: { limit?: number, offset?: number }): Promise<ApiResponse<T>> => {
    // --- Dual Write to Firebase Logic ---
    if (sheet && data && (action === 'write' || action === 'update' || action === 'delete')) {
      try {
        const { db } = await import('./firebase');
        const { doc, setDoc, deleteDoc } = await import('firebase/firestore');
        
        const operations = (Array.isArray(data) ? data : [data]).map(async (item: any) => {
          if (!item.id) return;
          const docRef = doc(db, sheet, String(item.id));
          const docPath = `${sheet}/${item.id}`;
          
          try {
            if (action === 'write') {
              await setDoc(docRef, item);
            } else if (action === 'update') {
              // Use setDoc with merge to act like update/upsert just in case it doesn't exist
              await setDoc(docRef, item, { merge: true });
            } else if (action === 'delete') {
              await deleteDoc(docRef);
            }
          } catch (error) {
            const opType = action === 'delete' ? OperationType.DELETE : (action === 'update' ? OperationType.UPDATE : OperationType.WRITE);
            await handleFirestoreError(error, opType, docPath);
          }
        });
        
        // Execute Firebase operations in background so it doesn't block the GAS request,
        // or await them. We will await them so errors can be logged but won't block GAS if it fails.
        Promise.allSettled(operations).then((results) => {
          const failures = results.filter(r => r.status === 'rejected');
          if (failures.length > 0) {
            console.error(`Firebase sync reported ${failures.length} errors during ${action} on ${sheet}`);
          } else {
            console.log(`Firebase sync complete for ${action} on ${sheet}`);
          }
        }).catch(err => console.error('Firebase sync final settlement error:', err));
      } catch(err) {
        console.error('Failed to import firebase modules:', err);
      }
    }
    // ------------------------------------

    if (!SCRIPT_URL) {
      console.warn('VITE_APPS_SCRIPT_URL (Google Apps Script Web App URL) is not set. ⚠️ Returning mock response.');
      return mockResponse(action, data);
    }
    
    try {
      // 📝 OPTIMISTIC UI SUPPORT: We use text/plain to avoid preflight (Performance Boost)
      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({ action, sheet, data, ...params }),
      });
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
};

// Mock response for development if URL is not set
const mockResponse = async (action: string, data: any): Promise<ApiResponse> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  if (action === 'login') {
    if ((data.employeeId === 'DEMO' && data.idCard === 'DEMO123456789') || 
        (data.employeeId === 'U001' && data.idCard === 'ADMIN12345678') ||
        (data.employeeId === 'DEV001' && data.idCard === '1234567890123')) {
      const isOperator = data.employeeId === 'DEMO';
      const isSuperAdmin = data.employeeId === 'DEV001';
      return {
        status: 'success',
        data: {
          id: isOperator ? '3' : (isSuperAdmin ? '1' : '2'),
          employeeId: data.employeeId,
          name: isOperator ? 'Demo Operator' : (isSuperAdmin ? 'Super Admin' : 'Demo Admin'),
          role: isOperator ? 'Viewer' : (isSuperAdmin ? 'Developer' : 'Administrator'),
          isDev: isSuperAdmin,
          avatar: 'https://drive.google.com/thumbnail?id=1Z_fRbN9S4aA7OkHb3mlim_t60wIT4huY&sz=w400',
          permissions: {
            canCreate: !isOperator,
            canEdit: !isOperator,
            canApprove: !isOperator,
            canVerify: !isOperator,
          }
        }
      };
    }
    return { status: 'error', message: 'Invalid credentials' };
  }
  
  return { status: 'success', data: [] };
};
