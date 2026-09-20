import { FaWhatsapp, FaTelegram, FaDiscord } from 'react-icons/fa'

export const WHATSAPP_GROUP = 'https://chat.whatsapp.com/LUw1SErvcJC4WeLiVO17OM'

export const COMMUNITY = {
  title: 'Komunitas',
  subtitle: 'Gabung dan ngobrol bareng di Ngomongin AI',
  items: [
    { id: 'wa-group', label: 'Grup Ngomongin AI', icon: FaWhatsapp, action: 'open', href: WHATSAPP_GROUP },
    { id: 'wa-channel', label: 'Channel Ngomongin AI', icon: FaWhatsapp, action: 'open', href: 'https://whatsapp.com/channel/0029Vb72vF04dTnAinqyoO3e' },
    { id: 'telegram', label: 'Grup Telegram Ngomongin AI', icon: FaTelegram, action: 'gate', title: 'Grup Telegram Ngomongin AI', message: 'Link grup Telegram belum tersedia.' },
    { id: 'discord', label: 'Discord Ngomongin AI', icon: FaDiscord, action: 'gate', title: 'Discord Ngomongin AI', message: 'Link invite Discord sudah kadaluarsa.' },
  ],
}
