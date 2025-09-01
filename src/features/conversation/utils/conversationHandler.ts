import { FileInfoType, OCRMark, PDFStructuredData } from '@/data/types'
import { createOpenAIService } from '@/services/openai'

/**
 * Configuration for the PDF conversation handler
 */
export interface ConversationConfig {
  openaiApiKey: string
  model?: string
  maxTokens?: number
  temperature?: number
}

/**
 * Enhanced conversation handler that uses OpenAI structured outputs
 * to analyze PDF content and extract coordinate-based information
 */
export class PDFConversationHandler {
  private openaiService: ReturnType<typeof createOpenAIService>
  private onMarkersExtracted?: (markers: OCRMark[]) => void

  constructor(
    config: ConversationConfig,
    onMarkersExtracted?: (markers: OCRMark[]) => void
  ) {
    this.openaiService = createOpenAIService(config.openaiApiKey, {
      model: config.model,
      maxTokens: config.maxTokens,
      temperature: config.temperature
    })
    this.onMarkersExtracted = onMarkersExtracted
  }

  /**
   * Handle conversation messages with PDF context
   * @param message - User's message/query
   * @param pdfData - PDF file information and content with structured data
   * @returns Promise<string> - AI response with extracted information
   */
  async handleMessage(
    message: string,
    pdfData?: FileInfoType & {
      textContent?: string
      structuredData?: PDFStructuredData
    }
  ): Promise<string> {
    console.log('handleMessage called with message:', message)
    console.log('PDF Data:', pdfData)
    try {
      // Validate inputs
      if (!message.trim()) {
        throw new Error('Message cannot be empty')
      }

      // Test OpenAI connection
      const isConnected = await this.openaiService.testConnection()
      if (!isConnected) {
        throw new Error(
          'Unable to connect to OpenAI API. Please check your API key.'
        )
      }

      // Prepare request data with structured PDF content
      const analysisRequest = {
        user_query: message,
        pdf_text_content: pdfData?.textContent || 'No text content available',
        pdf_structured_data: pdfData?.structuredData
          ? {
              text_blocks: pdfData.structuredData.textBlocks,
              page_count: pdfData.structuredData.pageCount,
              extraction_info: pdfData.structuredData.metadata
            }
          : undefined,
        pdf_metadata: pdfData
          ? {
              filename: pdfData.name,
              page_count: pdfData.structuredData?.pageCount || 1
            }
          : undefined
      }

      // Analyze document with OpenAI
      const analysisResponse =
        await this.openaiService.analyzeDocument(analysisRequest)

      // Extract OCR markers from OpenAI response and notify callback
      const ocrMarkers: OCRMark[] =
        analysisResponse.extracted_data.coordinates.map(
          (coord: any, index: number) => ({
            id: coord.id || index + 1,
            page: coord.page,
            x: coord.x,
            y: coord.y,
            description: coord.description || 'Found data',
            text: coord.text
          })
        )

      // Call the callback to update markers if provided
      if (this.onMarkersExtracted && ocrMarkers.length > 0) {
        this.onMarkersExtracted(ocrMarkers)
      }

      console.log('Extracted OCR markers:', ocrMarkers)

      // Format response for user
      return this.formatResponse(analysisResponse, message)
    } catch (error) {
      console.error('PDF Conversation Handler Error:', error)

      // Return user-friendly error messages
      if (error instanceof Error) {
        if (error.message.includes('API key')) {
          return 'Please configure your OpenAI API key to enable document analysis.'
        }
        if (error.message.includes('rate limit')) {
          return 'Rate limit exceeded. Please try again in a moment.'
        }
        if (error.message.includes('quota')) {
          return 'API quota exceeded. Please check your OpenAI billing.'
        }
        return `I encountered an error: ${error.message}`
      }

      return 'I apologize, but I encountered an unexpected error. Please try again.'
    }
  }

  /**
   * Format the OpenAI response into a user-friendly message
   */
  private formatResponse(analysisResponse: any, originalQuery: string): string {
    const { extracted_data } = analysisResponse
    const { coordinates, summary, confidence_score } = extracted_data

    let response = `## Analysis Results\n\n`
    response += `**Query:** ${originalQuery}\n\n`
    response += `**Summary:** ${summary}\n\n`

    if (coordinates && coordinates.length > 0) {
      response += `**Found ${coordinates.length} relevant data point(s):**\n\n`

      coordinates.forEach((coord: any, index: number) => {
        response += `${index + 1}. **${coord.description}**\n`
        response += `   • Text: "${coord.text}"\n`
        response += `   • Location: Page ${coord.page}, Position (${coord.x}, ${coord.y})\n`
        response += `   • ID: ${coord.id}\n\n`
      })
    } else {
      response += `No specific coordinate data was found for your query.\n\n`
    }

    response += `**Confidence Score:** ${Math.round(confidence_score * 100)}%\n\n`

    if (confidence_score < 0.7) {
      response += `*Note: Low confidence score. The results may not be entirely accurate.*`
    }

    return response
  }

  /**
   * Extract coordinates from the last analysis (useful for marking on PDF)
   */
  getLastExtractedCoordinates(): any[] {
    // This would store the last analysis results
    // For now, return empty array - could be enhanced with state management
    return []
  }
}

/**
 * Factory function to create a conversation handler
 */
export function createPDFConversationHandler(
  config: ConversationConfig,
  onMarkersExtracted?: (markers: OCRMark[]) => void
): PDFConversationHandler {
  return new PDFConversationHandler(config, onMarkersExtracted)
}

/**
 * Simple wrapper function that matches the ConversationPanel's expected signature
 */
export function createConversationMessageHandler(
  apiKey: string,
  onMarkersExtracted?: (markers: OCRMark[]) => void
) {
  const handler = createPDFConversationHandler(
    { openaiApiKey: apiKey },
    onMarkersExtracted
  )

  return async (message: string, pdfData?: any): Promise<string> => {
    return handler.handleMessage(message, pdfData)
  }
}
