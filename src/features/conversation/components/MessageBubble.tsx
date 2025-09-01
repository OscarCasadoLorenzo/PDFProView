import { Avatar, Box, HStack, Text, useColorModeValue } from '@chakra-ui/react'
import React from 'react'
import { ConversationMessage } from '../types'

interface MessageBubbleProps {
  message: ConversationMessage
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user'
  const bgColor = useColorModeValue(
    isUser ? 'primary.500' : 'gray.100',
    isUser ? 'primary.600' : 'gray.700'
  )
  const textColor = useColorModeValue(
    isUser ? 'white' : 'gray.800',
    isUser ? 'white' : 'gray.100'
  )

  return (
    <HStack
      spacing={3}
      align="flex-start"
      justify={isUser ? 'flex-end' : 'flex-start'}
      w="full"
      mb={4}
    >
      {!isUser && (
        <Avatar size="sm" name="Assistant" bg="secondary.500" color="white" />
      )}

      <Box
        maxW="70%"
        bg={bgColor}
        color={textColor}
        px={4}
        py={3}
        borderRadius="xl"
        borderBottomRightRadius={isUser ? 'md' : 'xl'}
        borderBottomLeftRadius={isUser ? 'xl' : 'md'}
        position="relative"
      >
        <Text fontSize="sm" whiteSpace="pre-wrap">
          {message.content}
        </Text>

        <Text
          fontSize="xs"
          opacity={0.7}
          mt={1}
          textAlign={isUser ? 'right' : 'left'}
        >
          {message.timestamp.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </Text>
      </Box>

      {isUser && (
        <Avatar size="sm" name="User" bg="primary.500" color="white" />
      )}
    </HStack>
  )
}
