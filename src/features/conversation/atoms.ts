import { atom } from 'jotai'
import { ConversationMessage } from './types'

export const conversationMessagesAtom = atom<ConversationMessage[]>([])

export const isConversationLoadingAtom = atom<boolean>(false)

export const conversationInputAtom = atom<string>('')
