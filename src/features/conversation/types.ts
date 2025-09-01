export interface ConversationMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  isLoading?: boolean
}

export interface ConversationPanelProps {
  onSendMessage: (message: string, pdfData?: any) => Promise<string>
  pdfData?: any
  isLoading?: boolean
  placeholder?: string
  title?: string
  height?: string | number
  maxHeight?: string | number
}

export interface ConversationState {
  messages: ConversationMessage[]
  isProcessing: boolean
}
