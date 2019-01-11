export interface Callable {
  id: string
  namespace: string

  uid (): string
}
