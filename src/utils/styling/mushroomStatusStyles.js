import { X, Check, HelpCircle, AlertCircle, Circle, ImageOff } from 'lucide-vue-next'

export function getStatusKey(status) {
  return status?.toLowerCase().replace(/_/g, '-')
}

export function getStatusStyles(status, t = null) {
  const key = getStatusKey(status)

  const bg = {
    toxic: 'bg-mushroom-toxic',
    psilocybin: 'bg-mushroom-psilocybin',
    'non-psilocybin': 'bg-mushroom-non-psilocybin',
    unknown: 'bg-mushroom-unknown',
    unidentifiable: 'bg-mushroom-unidentifiable',
    'not-processed': 'bg-mushroom-not-processed',
    'bad-pictures': 'bg-mushroom-bad-pictures', 
  }[key] || 'bg-gray-300'

  const text = {
    toxic: 'text-mushroom-toxic-text',
    psilocybin: 'text-mushroom-psilocybin-text',
    'non-psilocybin': 'text-mushroom-non-psilocybin-text',
    unknown: 'text-mushroom-unknown-text',
    unidentifiable: 'text-mushroom-unidentifiable-text',
    'not-processed': 'text-mushroom-not-processed-text',
    'bad-pictures': 'text-mushroom-bad-pictures-text',
  }[key] || 'text-black'

  const border = {
    toxic: 'border-mushroom-toxic-border',
    psilocybin: 'border-mushroom-psilocybin-border',
    'non-psilocybin': 'border-mushroom-non-psilocybin-border',
    unknown: 'border-mushroom-unknown-border',
    unidentifiable: 'border-mushroom-unidentifiable-border',
    'not-processed': 'border-mushroom-not-processed-border',
    'bad-pictures': 'border-mushroom-bad-pictures-border', 
  }[key] || 'border-gray-300'

  const cssVar = {
    PSILOCYBIN: '--color-mushroom-psilocybin',
    NON_PSILOCYBIN: '--color-mushroom-non-psilocybin',
    TOXIC: '--color-mushroom-toxic',
    UNKNOWN: '--color-mushroom-unknown',
    UNIDENTIFIABLE: '--color-mushroom-unidentifiable',
    NOT_PROCESSED: '--color-mushroom-not-processed',
    BAD_PICTURES: '--color-mushroom-bad-pictures',
  }[status]

  const icon = {
    TOXIC: X,
    PSILOCYBIN: HelpCircle,
    NON_PSILOCYBIN: Check,
    UNKNOWN: HelpCircle,
    UNIDENTIFIABLE: AlertCircle,
    NOT_PROCESSED: Circle,
    BAD_PICTURES: ImageOff, 
  }[status] || Circle

  return {
    key,
    bg,
    text,
    border,
    cssVar,
    icon,
    label: t ? t(`mushroomStatus.${status}`) : status
  }
}
