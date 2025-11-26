// src/core/eventBus.ts
export class EventBus {
  private listeners: Map<string, Array<(data: any) => Promise<void>>> =
    new Map()

  subscribe(event: string, callback: (data: any) => Promise<void>) {
    if (!this.listeners.has(event)) this.listeners.set(event, [])
    this.listeners.get(event)!.push(callback)
  }

  async publish(event: string, payload: any) {
    const subs = this.listeners.get(event)
    if (!subs || subs.length === 0) return

    for (const callback of subs) {
      await callback(payload) // garante ordem de execução
    }
  }
}
