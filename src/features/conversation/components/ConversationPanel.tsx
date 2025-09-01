import {
  Box,
  Button,
  Divider,
  Flex,
  HStack,
  Input,
  Text,
  Tooltip,
  useColorModeValue,
  useToast,
  VStack
} from '@chakra-ui/react'
import { useAtom } from 'jotai'
import React, { useEffect, useRef, useState } from 'react'
import {
  conversationInputAtom,
  conversationMessagesAtom,
  isConversationLoadingAtom
} from '../atoms'
import { ConversationMessage, ConversationPanelProps } from '../types'
import { MessageBubble } from './MessageBubble'
import { TypingIndicator } from './TypingIndicator'

export const ConversationPanel: React.FC<ConversationPanelProps> = ({
  onSendMessage,
  pdfData,
  isLoading = false,
  placeholder = 'Ask a question about the PDF...',
  title = 'PDF Assistant',
  height = '500px',
  maxHeight = '600px'
}) => {
  const [messages, setMessages] = useAtom(conversationMessagesAtom)
  const [isProcessing, setIsProcessing] = useAtom(isConversationLoadingAtom)
  const [inputValue, setInputValue] = useAtom(conversationInputAtom)
  const [localLoading, setLocalLoading] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const toast = useToast()

  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')
  const headerBgColor = useColorModeValue('gray.50', 'gray.700')

  const effectiveLoading = isLoading || isProcessing || localLoading

  // Simple ID generator
  const generateId = () =>
    `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, effectiveLoading])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || effectiveLoading) return

    const userMessage: ConversationMessage = {
      id: generateId(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setIsProcessing(true)
    setLocalLoading(true)

    try {
      const response = await onSendMessage(userMessage.content, pdfData)

      const assistantMessage: ConversationMessage = {
        id: generateId(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error sending message:', error)

      const errorMessage: ConversationMessage = {
        id: generateId(),
        role: 'assistant',
        content:
          'Sorry, I encountered an error while processing your request. Please try again.',
        timestamp: new Date()
      }

      setMessages((prev) => [...prev, errorMessage])

      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true
      })
    } finally {
      setIsProcessing(false)
      setLocalLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const clearConversation = () => {
    setMessages([])
    setInputValue('')
  }

  return (
    <Box
      w="full"
      h={height}
      maxH={maxHeight}
      bg={bgColor}
      border="1px"
      borderColor={borderColor}
      borderRadius="lg"
      display="flex"
      flexDirection="column"
      overflow="hidden"
      shadow="md"
    >
      {/* Header */}
      <Box
        px={4}
        py={3}
        bg={headerBgColor}
        borderBottom="1px"
        borderColor={borderColor}
      >
        <Flex justify="space-between" align="center">
          <Text fontWeight="semibold" fontSize="md">
            {title}
          </Text>
          {messages.length > 0 && (
            <Tooltip label="Clear conversation">
              <Button
                size="sm"
                variant="ghost"
                onClick={clearConversation}
                colorScheme="gray"
              >
                Clear
              </Button>
            </Tooltip>
          )}
        </Flex>
      </Box>

      {/* Messages Container */}
      <Box
        flex="1"
        overflowY="auto"
        px={4}
        py={3}
        css={{
          '&::-webkit-scrollbar': {
            width: '6px'
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent'
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#CBD5E0',
            borderRadius: '3px'
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#A0AEC0'
          }
        }}
      >
        {messages.length === 0 ? (
          <Flex
            align="center"
            justify="center"
            h="full"
            direction="column"
            textAlign="center"
            color="gray.500"
          >
            <Text fontSize="lg" mb={2}>
              👋 Hello! How can I help you?
            </Text>
            <Text fontSize="sm">Ask me anything about the PDF document</Text>
          </Flex>
        ) : (
          <VStack spacing={0} align="stretch">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {effectiveLoading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </VStack>
        )}
      </Box>

      <Divider />

      {/* Input Area */}
      <Box p={4}>
        <HStack spacing={3}>
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={effectiveLoading}
            focusBorderColor="primary.500"
            size="md"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || effectiveLoading}
            colorScheme="primary"
            isLoading={effectiveLoading}
            loadingText="Sending"
            size="md"
            px={6}
          >
            Send
          </Button>
        </HStack>
      </Box>
    </Box>
  )
}
