import {
  AlertTriangle,
  HelpCircle,
  CheckCircle,
  Info,
  Circle,
  ImageOff
} from 'lucide-vue-next'

export function getBasketBadgeStyles(badge) {
  const key = badge?.toLowerCase()

  const styleMap = {
    'toxic_mushroom_present': {
      bg: 'bg-mushroom-toxic',
      text: 'text-mushroom-toxic-text',
      border: 'border border-mushroom-toxic-border',
      icon: AlertTriangle
    },
    'all_mushrooms_are_toxic': {
      bg: 'bg-mushroom-toxic',
      text: 'text-mushroom-toxic-text',
      border: 'border border-mushroom-toxic-border',
      icon: AlertTriangle
    },
    'psychoactive_mushroom_present': {
      bg: 'bg-mushroom-psilocybin',
      text: 'text-mushroom-psilocybin-text',
      border: 'border border-mushroom-psilocybin-border',
      icon: HelpCircle
    },
    'all_mushrooms_are_psilocybin': {
      bg: 'bg-mushroom-psilocybin',
      text: 'text-mushroom-psilocybin-text',
      border: 'border border-mushroom-psilocybin-border',
      icon: HelpCircle
    },
    'non_psilocybin_mushroom_present': {
      bg: 'bg-mushroom-non-psilocybin',
      text: 'text-mushroom-non-psilocybin-text',
      border: 'border border-mushroom-non-psilocybin-border',
      icon: CheckCircle
    },
    'all_mushrooms_are_non_psilocybin': {
      bg: 'bg-mushroom-non-psilocybin',
      text: 'text-mushroom-non-psilocybin-text',
      border: 'border border-mushroom-non-psilocybin-border',
      icon: CheckCircle
    },
    'unknown_mushroom_present': {
      bg: 'bg-mushroom-unknown',
      text: 'text-mushroom-unknown-text',
      border: 'border border-mushroom-unknown-border',
      icon: Info
    },
    'all_mushrooms_are_unknown': {
      bg: 'bg-mushroom-unknown',
      text: 'text-mushroom-unknown-text',
      border: 'border border-mushroom-unknown-border',
      icon: Info
    },
    'unidentifiable_mushroom_present': {
      bg: 'bg-mushroom-unidentifiable',
      text: 'text-mushroom-unidentifiable-text',
      border: 'border border-mushroom-unidentifiable-border',
      icon: HelpCircle
    },
    'all_mushrooms_are_unidentifiable': {
      bg: 'bg-mushroom-unidentifiable',
      text: 'text-mushroom-unidentifiable-text',
      border: 'border border-mushroom-unidentifiable-border',
      icon: HelpCircle
    },
    'bad_pictures_present': {
      bg: 'bg-mushroom-bad-pictures',
      text: 'text-mushroom-bad-pictures-text',
      border: 'border border-mushroom-bad-pictures-border',
      icon: ImageOff
    },
    'all_mushrooms_processed': {
      bg: 'bg-button3',
      text: 'text-button3-meta',
      border: 'border border-button3-border',
      icon: CheckCircle
    },
    'no_mushrooms_processed': {
      bg: 'bg-button2',
      text: 'text-button2-meta',
      border: 'border border-button2-border',
      icon: Circle
    }
  }

  return styleMap[key] || {
    bg: 'bg-gray-300',
    text: 'text-black',
    border: 'border border-gray-300',
    icon: Circle
  }
}
