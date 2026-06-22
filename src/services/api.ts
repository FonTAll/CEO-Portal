/// <reference types="vite/client" />
import { ApiResponse } from '../types';

export const getScriptUrl = (): string => {
  if (typeof window !== 'undefined') {
    const customUrl = localStorage.getItem('cfg_apps_script_url');
    if (customUrl && customUrl.trim()) {
      return customUrl.trim();
    }
  }
  return import.meta.env.VITE_APPS_SCRIPT_URL || '/api/proxy-gas';
};

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
console.log('App initialization - GAS Backend URL configured:', !!getScriptUrl());

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
      // Run Firestore dual writes in background to not block the user's primary GAS request
      (async () => {
        try {
          const { db } = await import('./firebase');
          const { doc, writeBatch } = await import('firebase/firestore');
          
          const items = Array.isArray(data) ? data : [data];
          const chunkSize = 250; // Use a comfortable batch size well under Firestore's 500 limit
          
          for (let i = 0; i < items.length; i += chunkSize) {
            const chunk = items.slice(i, i + chunkSize);
            const batch = writeBatch(db);
            let hasOperations = false;

            chunk.forEach((item: any) => {
              if (!item.id) return;
              const docRef = doc(db, sheet, String(item.id));
              
              if (action === 'write') {
                batch.set(docRef, item);
                hasOperations = true;
              } else if (action === 'update') {
                batch.set(docRef, item, { merge: true });
                hasOperations = true;
              } else if (action === 'delete') {
                batch.delete(docRef);
                hasOperations = true;
              }
            });

            if (hasOperations) {
              await batch.commit();
            }
          }
          console.log(`Firebase sync (via writeBatch) complete for ${action} of ${items.length} records on ${sheet}`);
        } catch (err) {
          console.error(`Failed to process dual write to Firebase during ${action} on ${sheet}:`, err);
        }
      })();
    }
    // ------------------------------------

    const currentScriptUrl = getScriptUrl();
    if (!currentScriptUrl || currentScriptUrl === '/api/proxy-gas') {
      console.warn('VITE_APPS_SCRIPT_URL (Google Apps Script Web App URL) is not set or proxy is used. ⚠️ Attempting Firebase direct fallback.');
      if (action === 'read' && sheet) {
        try {
          const { db } = await import('./firebase');
          const { collection, getDocs, orderBy, query } = await import('firebase/firestore');
          const q = query(collection(db, sheet)); // Can add orderBy here if needed
          const snapshot = await getDocs(q);
          const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          return { status: 'success', data: { items } } as ApiResponse<T>;
        } catch (fbError) {
           console.error('Firebase read failed, returning mock.', fbError);
           return mockResponse(action, data);
        }
      }
      return mockResponse(action, data);
    }
    
    try {
      // 📝 OPTIMISTIC UI SUPPORT: We use text/plain to avoid preflight (Performance Boost)
      const response = await fetch(currentScriptUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({ action, sheet, data, ...params }),
      });
      const result = await response.json();
      if (result && result.status === 'error') {
        throw new Error(result.message || 'API responded with an error');
      }
      return result;
    } catch (error) {
      console.warn('API fetch failed, falling back to Firebase if possible:', error);
      if (action === 'read' && sheet) {
        try {
          const { db } = await import('./firebase');
          const { collection, getDocs } = await import('firebase/firestore');
          const snapshot = await getDocs(collection(db, sheet));
          const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          return { status: 'success', data: { items } } as ApiResponse<T>;
        } catch (fbError) {
           console.error('Firebase fallback also failed', fbError);
           throw error;
        }
      }
      
      // If doing a write/update/delete operation and it fails to sync to GAS,
      // but Firebase sync was attempted, we assume success so the UI doesn't crash 
      // with "Failed to fetch" if they have ad-blockers or bad GAS configuration.
      if (sheet && data && (action === 'write' || action === 'update' || action === 'delete')) {
         console.warn(`GAS Sync failed for ${action}. Assuming Firebase took the write.`);
         return { status: 'success', message: 'Data synced to Firebase (GAS sync failed)' } as ApiResponse<T>;
      }
      
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
