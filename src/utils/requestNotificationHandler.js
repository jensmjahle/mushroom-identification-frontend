import {parseJwt} from '@/utils/jwt.js'

let toast
export function injectToastLibrary(vueToast) {
  toast = vueToast
}

export function handleRequestNotification(notif, t, requestId, token) {
  if (!toast || !notif) return

  const isRequestPage = isOnRequestPage(requestId)
  const userType = parseJwt(token).role
  const isUser = userType === 'USER'
  const isAdmin = userType === 'SUPERUSER' || userType === 'MODERATOR'

  const fallback = notif.message || t('notification.default')
  const translated = notif.i18n
      ? t(notif.i18n, {}, { default: fallback })
      : fallback

  const infoIfNotOnRequestPage = ['NEW_CHAT_MESSAGE', 'STATUS_CHANGED', 'MUSHROOM_BASKET_UPDATED']
  const infoIfUser = ['REQUEST_CURRENTLY_UNDER_REVIEW', 'ADMIN_LEFT_REQUEST']
  const infoIfAdmin = ['USER_LOGGED_IN', 'USER_LOGGED_OUT']

  const shouldNotify =
      (isUser && (
          infoIfUser.includes(notif.type) ||
          (infoIfNotOnRequestPage.includes(notif.type) && !isRequestPage)
      )) ||
      (isAdmin && (
          infoIfAdmin.includes(notif.type) ||
          notif.type === 'ADMIN_LEFT_REQUEST'
      ))

  if (shouldNotify) {
    toast.info(translated)
  } else if (
      !infoIfNotOnRequestPage.includes(notif.type) &&
      !infoIfUser.includes(notif.type) &&
      !infoIfAdmin.includes(notif.type)
  ) {
    toast(translated)
  }
}

function isOnRequestPage(requestId) {
  return window.location.pathname === `/request/${requestId}`
}
