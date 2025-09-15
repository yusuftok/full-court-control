import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'

// Types for WhatsApp webhook payload
interface WhatsAppMessage {
  id: string
  from: string
  timestamp: string
  type: 'text' | 'image' | 'document' | 'audio' | 'video'
  text?: {
    body: string
  }
  image?: {
    id: string
    mime_type: string
    caption?: string
  }
  document?: {
    id: string
    filename: string
    mime_type: string
    caption?: string
  }
}

interface WhatsAppWebhookPayload {
  object: string
  entry: Array<{
    id: string
    changes: Array<{
      value: {
        messaging_product: string
        metadata: {
          display_phone_number: string
          phone_number_id: string
        }
        messages?: WhatsAppMessage[]
        statuses?: Array<{
          id: string
          status: 'sent' | 'delivered' | 'read' | 'failed'
          timestamp: string
          recipient_id: string
        }>
      }
      field: string
    }>
  }>
}

type Attachment =
  | {
      type: 'image'
      id: string
      mimeType: string
    }
  | {
      type: 'document'
      id: string
      filename: string
      mimeType: string
    }

interface MessageStatus {
  id: string
  status: 'sent' | 'delivered' | 'read' | 'failed'
  timestamp: string
  recipient_id: string
}

// Verify webhook token (WhatsApp requires this for security)
const WEBHOOK_VERIFY_TOKEN =
  process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN || 'your-verify-token'
const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN

// GET request for webhook verification
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  if (mode === 'subscribe' && token === WEBHOOK_VERIFY_TOKEN) {
    console.log('WhatsApp webhook verified successfully')
    return new NextResponse(challenge, { status: 200 })
  }

  return NextResponse.json({ error: 'Verification failed' }, { status: 403 })
}

// POST request for receiving webhook events
export async function POST(request: NextRequest) {
  try {
    const headersList = await headers()
    const signature = headersList.get('x-hub-signature-256')

    // In production, verify the webhook signature
    // const body = await request.text()
    // if (!verifyWebhookSignature(body, signature)) {
    //   return NextResponse.json({ error: 'Invalid signature' }, { status: 403 })
    // }

    const payload: WhatsAppWebhookPayload = await request.json()

    // Process the webhook payload
    for (const entry of payload.entry) {
      for (const change of entry.changes) {
        if (change.field === 'messages') {
          const { messages, metadata } = change.value

          if (messages) {
            for (const message of messages) {
              await processIncomingMessage(message, metadata.phone_number_id)
            }
          }

          // Handle message status updates
          if (change.value.statuses) {
            for (const status of change.value.statuses) {
              await processMessageStatus(status)
            }
          }
        }
      }
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('WhatsApp webhook error:', error)
    return NextResponse.json(
      { error: 'errors.internalServerError' },
      { status: 500 }
    )
  }
}

async function processIncomingMessage(
  message: WhatsAppMessage,
  phoneNumberId: string
) {
  console.log(`Processing message from ${message.from}:`, message)

  try {
    // Parse message content based on type
    let messageContent: string = ''
    const attachments: Attachment[] = []

    switch (message.type) {
      case 'text':
        messageContent = message.text?.body || ''
        break
      case 'image':
        if (message.image) {
          messageContent = message.image.caption || 'Image received'
          attachments.push({
            type: 'image',
            id: message.image.id,
            mimeType: message.image.mime_type,
          })
        }
        break
      case 'document':
        if (message.document) {
          messageContent =
            message.document.caption || `Document: ${message.document.filename}`
          attachments.push({
            type: 'document',
            id: message.document.id,
            filename: message.document.filename,
            mimeType: message.document.mime_type,
          })
        }
        break
    }

    // Process commands or create tasks based on message content
    await processMessageCommands(message.from, messageContent, attachments)

    // Send acknowledgment (optional)
    // await sendWhatsAppMessage(phoneNumberId, message.from, 'Message received and processed!')
  } catch (error) {
    console.error('Error processing message:', error)
  }
}

async function processMessageCommands(
  from: string,
  content: string,
  attachments: Attachment[]
) {
  const lowerContent = content.toLowerCase().trim()

  // Parse task creation commands
  if (lowerContent.startsWith('/task ') || lowerContent.startsWith('task: ')) {
    const taskName = content.replace(/^\/(task|Task:?\s*)/i, '').trim()
    await createTaskFromMessage(from, taskName, attachments)
    return
  }

  // Parse status updates
  if (lowerContent.startsWith('/status ')) {
    const statusUpdate = content.replace(/^\/status\s*/i, '').trim()
    await processStatusUpdate(from, statusUpdate)
    return
  }

  // Parse priority updates
  if (lowerContent.startsWith('/priority ')) {
    const priorityUpdate = content.replace(/^\/priority\s*/i, '').trim()
    await processPriorityUpdate(from, priorityUpdate)
    return
  }

  // Default: treat as general message/note
  await createNoteFromMessage(from, content, attachments)
}

async function createTaskFromMessage(
  from: string,
  taskName: string,
  attachments: Attachment[]
) {
  // This would integrate with your task management system
  const task = {
    id: `whatsapp-task-${Date.now()}`,
    name: taskName,
    description: `Created via WhatsApp from ${from}`,
    status: 'pending' as const,
    priority: 'medium' as const,
    source: 'whatsapp',
    attachments,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  // Here you would save to your database
  console.log('Creating task from WhatsApp:', task)

  // You could also send a confirmation message back
  // await sendWhatsAppMessage(phoneNumberId, from, `Task created: "${taskName}"`)
}

async function processStatusUpdate(from: string, statusContent: string) {
  // Parse status updates like "completed task #123" or "in-progress project alpha"
  console.log(`Processing status update from ${from}: ${statusContent}`)

  // Implementation would depend on your task management logic
}

async function processPriorityUpdate(from: string, priorityContent: string) {
  // Parse priority updates like "high task #123" or "urgent project alpha"
  console.log(`Processing priority update from ${from}: ${priorityContent}`)

  // Implementation would depend on your task management logic
}

async function createNoteFromMessage(
  from: string,
  content: string,
  attachments: Attachment[]
) {
  const note = {
    id: `whatsapp-note-${Date.now()}`,
    content,
    from,
    attachments,
    createdAt: new Date(),
  }

  console.log('Creating note from WhatsApp:', note)
  // Save to your notes/communications system
}

async function processMessageStatus(status: MessageStatus) {
  console.log('Message status update:', status)
  // Update delivery status in your system
}

// Helper function to send WhatsApp messages (for responses)
async function sendWhatsAppMessage(
  phoneNumberId: string,
  to: string,
  message: string
) {
  if (!WHATSAPP_ACCESS_TOKEN) {
    throw new Error('WhatsApp access token not configured')
  }

  const url = `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`

  const payload = {
    messaging_product: 'whatsapp',
    to,
    text: { body: message },
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error(`WhatsApp API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Failed to send WhatsApp message:', error)
    throw error
  }
}

// Helper function available within this module

// Helper function to verify webhook signature (implement in production)
function verifyWebhookSignature(
  payload: string,
  signature: string | null
): boolean {
  if (!signature) return false

  // Implement HMAC-SHA256 verification using your app secret
  // const expectedSignature = crypto
  //   .createHmac('sha256', WHATSAPP_APP_SECRET)
  //   .update(payload)
  //   .digest('hex')

  // return signature === `sha256=${expectedSignature}`

  return true // Simplified for demo
}
