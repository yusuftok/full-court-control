import { toast } from 'sonner'

export function createToastHelpers(t: (key: string, params?: Record<string, any>) => string) {
  return {
    success: (key: string, params?: Record<string, any>) => {
      toast.success(t(key, params))
    },
    error: (key: string, params?: Record<string, any>) => {
      toast.error(t(key, params))
    },
    info: (key: string, params?: Record<string, any>) => {
      toast.info(t(key, params))
    },
    warning: (key: string, params?: Record<string, any>) => {
      toast.warning(t(key, params))
    },
    promise: (
      promise: Promise<any>,
      messages: {
        loading: string
        success: string
        error: string
      }
    ) => {
      return toast.promise(promise, {
        loading: t(messages.loading),
        success: t(messages.success),
        error: t(messages.error)
      })
    }
  }
}