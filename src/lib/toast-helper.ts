import { toast } from 'sonner'

type ToastParams = Record<string, string | number | boolean>

export function createToastHelpers(
  t: (key: string, params?: ToastParams) => string
) {
  return {
    success: (key: string, params?: ToastParams) => {
      toast.success(t(key, params))
    },
    error: (key: string, params?: ToastParams) => {
      toast.error(t(key, params))
    },
    info: (key: string, params?: ToastParams) => {
      toast.info(t(key, params))
    },
    warning: (key: string, params?: ToastParams) => {
      toast.warning(t(key, params))
    },
    promise: <T>(
      promise: Promise<T>,
      messages: {
        loading: string
        success: string
        error: string
      }
    ) => {
      return toast.promise(promise, {
        loading: t(messages.loading),
        success: t(messages.success),
        error: t(messages.error),
      })
    },
  }
}
