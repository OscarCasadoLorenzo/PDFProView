import {
  DocumentAnalysisRequest,
  DocumentAnalysisResponse,
  OpenAIConfig,
  documentAnalysisSchema
} from './types'

/**
 * OpenAI service for document analysis with structured outputs
 * Extracts document data with coordinates using OpenAI's structured output feature
 */
export class OpenAIDocumentService {
  private apiKey: string
  private model: string
  private maxTokens: number
  private temperature: number
  private baseUrl = 'https://api.openai.com/v1/chat/completions'

  constructor(config: OpenAIConfig) {
    this.apiKey = config.apiKey
    this.model = config.model || 'gpt-4o-2024-08-06' // Model that supports structured outputs
    this.maxTokens = config.maxTokens || 1500
    this.temperature = config.temperature || 0.1 // Low temperature for consistent extraction
  }

  /**
   * Analyze PDF content and extract structured data with coordinates
   * @param request - The analysis request containing user query and PDF data
   * @returns Promise<DocumentAnalysisResponse> - Structured response with coordinates
   */
  async analyzeDocument(
    request: DocumentAnalysisRequest
  ): Promise<DocumentAnalysisResponse> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'system',
              content: this.buildSystemPrompt()
            },
            {
              role: 'user',
              content: this.buildUserPrompt(request)
            }
          ],
          max_tokens: this.maxTokens,
          temperature: this.temperature,
          response_format: {
            type: 'json_schema',
            json_schema: {
              name: 'document_analysis',
              schema: documentAnalysisSchema,
              strict: true
            }
          }
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(
          `OpenAI API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`
        )
      }

      const data = await response.json()

      if (!data.choices?.[0]?.message?.content) {
        throw new Error('No response content from OpenAI')
      }

      const parsedResponse: DocumentAnalysisResponse = JSON.parse(
        data.choices[0].message.content
      )

      // Validate the response structure
      this.validateResponse(parsedResponse)

      return parsedResponse
    } catch (error) {
      console.error('OpenAI document analysis error:', error)
      throw new Error(
        `Failed to analyze document: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  /**
   * Build the system prompt for document analysis
   */
  private buildSystemPrompt(): string {
    return `You are an expert document analysis AI that extracts specific information from PDF documents with precise coordinate mapping.

Your task is to:
1. Analyze the provided PDF content (both text and structured data if available)
2. Extract relevant data points based on the user's query
3. Use actual coordinates from structured data when available, or provide realistic estimates
4. Return structured data with confidence scores

Guidelines for coordinate handling:
- When structured data is provided: Use the actual x,y coordinates from text blocks
- When only text is available: Estimate coordinates based on typical document layouts
- X coordinates: 0-600 (left to right across page width)
- Y coordinates: 0-800 (top to bottom down page height)
- Page numbers: Start from 1
- Consider text block positions, font sizes, and document structure

For each extracted data point, provide:
- Precise coordinates (actual when available, estimated otherwise)
- Clear description of the data type
- The exact text content found
- Appropriate confidence scoring based on data source quality

Priority: Use structured coordinate data when available for maximum accuracy.`
  }

  /**
   * Build the user prompt with specific query and PDF content
   */
  private buildUserPrompt(request: DocumentAnalysisRequest): string {
    let prompt = `User Query: "${request.user_query}"\n\n`

    if (request.pdf_metadata) {
      prompt += `PDF Metadata:\n`
      prompt += `- Filename: ${request.pdf_metadata.filename}\n`
      prompt += `- Pages: ${request.pdf_metadata.page_count}\n\n`
    }

    if (
      request.pdf_structured_data &&
      request.pdf_structured_data.text_blocks.length > 0
    ) {
      prompt += `PDF Structured Data (Text Blocks with Coordinates):\n`
      prompt += `Total text blocks: ${request.pdf_structured_data.text_blocks.length}\n`
      request.pdf_structured_data.text_blocks
        .slice(0, 20)
        .forEach((block, index) => {
          prompt += `Block ${index + 1}: "${block.text}" at (${block.x}, ${block.y}) on page ${block.page}\n`
        })
      if (request.pdf_structured_data.text_blocks.length > 20) {
        prompt += `... and ${request.pdf_structured_data.text_blocks.length - 20} more blocks\n`
      }
      prompt += `\n`
    }

    if (request.pdf_text_content) {
      prompt += `PDF Text Content:\n${request.pdf_text_content}\n\n`
    }

    prompt += `Please analyze this document and extract the requested information. ${
      request.pdf_structured_data
        ? 'Use the actual coordinates from the structured data for maximum accuracy.'
        : 'Provide realistic coordinate estimates for where each piece of information would appear in the document.'
    }`

    return prompt
  }

  /**
   * Validate the response structure
   */
  private validateResponse(response: DocumentAnalysisResponse): void {
    if (!response.extracted_data) {
      throw new Error('Invalid response: missing extracted_data')
    }

    if (!Array.isArray(response.extracted_data.coordinates)) {
      throw new Error('Invalid response: coordinates must be an array')
    }

    // Validate each coordinate entry
    response.extracted_data.coordinates.forEach((coord, index) => {
      if (typeof coord.x !== 'number' || typeof coord.y !== 'number') {
        throw new Error(
          `Invalid coordinate at index ${index}: x and y must be numbers`
        )
      }

      if (typeof coord.page !== 'number' || coord.page < 1) {
        throw new Error(
          `Invalid coordinate at index ${index}: page must be a positive number`
        )
      }

      if (!coord.text || !coord.description) {
        throw new Error(
          `Invalid coordinate at index ${index}: text and description are required`
        )
      }
    })

    if (
      typeof response.extracted_data.confidence_score !== 'number' ||
      response.extracted_data.confidence_score < 0 ||
      response.extracted_data.confidence_score > 1
    ) {
      throw new Error(
        'Invalid response: confidence_score must be a number between 0 and 1'
      )
    }
  }

  /**
   * Test the connection to OpenAI API
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          Authorization: `Bearer ${this.apiKey}`
        }
      })
      return response.ok
    } catch {
      return false
    }
  }
}

/**
 * Factory function to create OpenAI service instance
 */
export function createOpenAIService(
  apiKey: string,
  config?: Partial<OpenAIConfig>
): OpenAIDocumentService {
  return new OpenAIDocumentService({
    apiKey,
    ...config
  })
}
