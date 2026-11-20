import type { EmployeeDocument } from '@/store/hrOperationsStore'

interface StoredDocument extends EmployeeDocument {
  blob: Blob
}

const DATABASE_NAME = 'hr-portal-documents'
const STORE_NAME = 'documents'
const DATABASE_VERSION = 1

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION)
    request.onupgradeneeded = () => {
      const database = request.result
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME, { keyPath: 'id' })
      }
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function saveDocument(document: EmployeeDocument, blob: Blob): Promise<void> {
  const database = await openDatabase()
  await new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, 'readwrite')
    transaction.objectStore(STORE_NAME).put({ ...document, blob } satisfies StoredDocument)
    transaction.oncomplete = () => resolve()
    transaction.onerror = () => reject(transaction.error)
  })
  database.close()
}

export async function openDocument(documentId: string): Promise<void> {
  const preview = window.open('about:blank', '_blank')
  if (!preview) return

  const database = await openDatabase()
  const stored = await new Promise<StoredDocument | undefined>((resolve, reject) => {
    const request = database.transaction(STORE_NAME).objectStore(STORE_NAME).get(documentId)
    request.onsuccess = () => resolve(request.result as StoredDocument | undefined)
    request.onerror = () => reject(request.error)
  })
  database.close()
  if (!stored) {
    preview.close()
    return
  }

  const url = URL.createObjectURL(stored.blob)
  preview.location.href = url
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000)
}

export async function deleteDocument(documentId: string): Promise<void> {
  const database = await openDatabase()
  await new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, 'readwrite')
    transaction.objectStore(STORE_NAME).delete(documentId)
    transaction.oncomplete = () => resolve()
    transaction.onerror = () => reject(transaction.error)
  })
  database.close()
}
