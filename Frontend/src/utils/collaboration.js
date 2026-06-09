export function createOperation(type, payload) {
  return {
    id: crypto.randomUUID(),
    type,
    payload,
    timestamp: Date.now(),
    synced: false,
  }
}

export function createSyncQueue() {
  return {
    operations: [],
    futureSyncQueue: [],
  }
}

export function enqueueOperation(queue, operation) {
  return {
    ...queue,
    operations: [...queue.operations, operation],
    futureSyncQueue: [...queue.futureSyncQueue, operation],
  }
}

export const OPERATION_TYPES = {
  CREATE: 'create',
  UPDATE: 'update',
  MOVE: 'move',
  DELETE: 'delete',
}
