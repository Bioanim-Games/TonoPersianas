import { useSyncExternalStore } from 'react'

export interface NetworkStatus {
  readonly isOnline: boolean
  readonly isOffline: boolean
}

function subscribeToNetworkChanges(onStoreChange: () => void): () => void {
  if (typeof window === 'undefined') {
    return () => {}
  }
  window.addEventListener('online', onStoreChange)
  window.addEventListener('offline', onStoreChange)
  return () => {
    window.removeEventListener('online', onStoreChange)
    window.removeEventListener('offline', onStoreChange)
  }
}

function getNetworkSnapshot(): boolean {
  return typeof navigator === 'undefined' ? true : navigator.onLine
}

function getServerSnapshot(): boolean {
  return true
}

/**
 * Reactive online/offline hook used to gate online-only features such as
 * Live Online Chat and future Checkout/Payment flows.
 */
export function useNetworkStatus(): NetworkStatus {
  const isOnline = useSyncExternalStore(
    subscribeToNetworkChanges,
    getNetworkSnapshot,
    getServerSnapshot,
  )
  return {
    isOnline,
    isOffline: !isOnline,
  }
}
