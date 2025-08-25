'use client'

import React, { useState, useEffect } from 'react'
import {
  MessageCircle,
  Send,
  Download,
  Settings,
  CheckCircle,
  Clock,
  AlertCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

// Types for WhatsApp integration
interface WhatsAppMessage {
  id: string
  from: string
  to: string
  content: string
  type: 'incoming' | 'outgoing'
  status: 'sent' | 'delivered' | 'read' | 'failed'
  timestamp: Date
  taskCreated?: boolean
  attachments?: Array<{
    type: 'image' | 'document' | 'audio' | 'video'
    url: string
    filename?: string
  }>
}

interface WhatsAppContact {
  id: string
  name: string
  phone: string
  lastMessage?: Date
  messageCount: number
  isActive: boolean
}

interface WhatsAppStats {
  totalMessages: number
  tasksCreated: number
  activeContacts: number
  responseTime: number
}

// Mock data - in real app this would come from your API
const mockMessages: WhatsAppMessage[] = [
  {
    id: '1',
    from: '+1234567890',
    to: 'business',
    content: '/task Review quarterly budget report',
    type: 'incoming',
    status: 'read',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    taskCreated: true,
  },
  {
    id: '2',
    from: 'business',
    to: '+1234567890',
    content: 'Task created: "Review quarterly budget report"',
    type: 'outgoing',
    status: 'delivered',
    timestamp: new Date(Date.now() - 4 * 60 * 1000),
  },
  {
    id: '3',
    from: '+9876543210',
    to: 'business',
    content: '/status completed project-alpha',
    type: 'incoming',
    status: 'read',
    timestamp: new Date(Date.now() - 10 * 60 * 1000),
  },
]

const mockContacts: WhatsAppContact[] = [
  {
    id: '1',
    name: 'John Doe',
    phone: '+1234567890',
    lastMessage: new Date(Date.now() - 5 * 60 * 1000),
    messageCount: 15,
    isActive: true,
  },
  {
    id: '2',
    name: 'Jane Smith',
    phone: '+9876543210',
    lastMessage: new Date(Date.now() - 10 * 60 * 1000),
    messageCount: 8,
    isActive: false,
  },
]

const mockStats: WhatsAppStats = {
  totalMessages: 234,
  tasksCreated: 47,
  activeContacts: 12,
  responseTime: 2.3,
}

interface MessageBubbleProps {
  message: WhatsAppMessage
}

function MessageBubble({ message }: MessageBubbleProps) {
  const isIncoming = message.type === 'incoming'

  return (
    <div
      className={cn('flex mb-4', isIncoming ? 'justify-start' : 'justify-end')}
    >
      <div
        className={cn(
          'max-w-xs lg:max-w-md px-4 py-2 rounded-lg',
          isIncoming
            ? 'bg-muted text-foreground'
            : 'bg-primary text-primary-foreground'
        )}
      >
        <p className="text-sm">{message.content}</p>

        {message.taskCreated && (
          <div className="mt-2">
            <Badge variant="secondary" className="text-xs">
              <CheckCircle className="w-3 h-3 mr-1" />
              Task Created
            </Badge>
          </div>
        )}

        {message.attachments && message.attachments.length > 0 && (
          <div className="mt-2 space-y-1">
            {message.attachments.map((attachment, index) => (
              <div key={index} className="text-xs opacity-80">
                📎 {attachment.filename || `${attachment.type} attachment`}
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mt-2 text-xs opacity-80">
          <span>{message.timestamp.toLocaleTimeString()}</span>
          {!isIncoming && (
            <div className="flex items-center">
              {message.status === 'sent' && <Clock className="w-3 h-3" />}
              {message.status === 'delivered' && (
                <CheckCircle className="w-3 h-3" />
              )}
              {message.status === 'read' && (
                <CheckCircle className="w-3 h-3 text-blue-400" />
              )}
              {message.status === 'failed' && (
                <AlertCircle className="w-3 h-3 text-red-400" />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

interface ContactListProps {
  contacts: WhatsAppContact[]
  selectedContact: string | null
  onContactSelect: (contactId: string) => void
}

function ContactList({
  contacts,
  selectedContact,
  onContactSelect,
}: ContactListProps) {
  return (
    <div className="space-y-2">
      <h3 className="font-medium text-sm text-muted-foreground mb-3">
        Recent Contacts
      </h3>
      {contacts.map(contact => (
        <div
          key={contact.id}
          className={cn(
            'flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors',
            selectedContact === contact.id
              ? 'bg-primary/10 border border-primary/20'
              : 'hover:bg-muted/50'
          )}
          onClick={() => onContactSelect(contact.id)}
        >
          <div
            className={cn(
              'w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium',
              contact.isActive
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-700'
            )}
          >
            {contact.name
              .split(' ')
              .map(n => n[0])
              .join('')
              .toUpperCase()}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium truncate">{contact.name}</p>
              {contact.isActive && (
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{contact.phone}</p>
            {contact.lastMessage && (
              <p className="text-xs text-muted-foreground">
                Last: {contact.lastMessage.toLocaleString()}
              </p>
            )}
          </div>

          <Badge variant="secondary" className="text-xs">
            {contact.messageCount}
          </Badge>
        </div>
      ))}
    </div>
  )
}

interface CommandHelpProps {
  isOpen: boolean
}

function CommandHelp({ isOpen }: CommandHelpProps) {
  if (!isOpen) return null

  const commands = [
    { command: '/task [description]', description: 'Create a new task' },
    {
      command: '/status [status] [task-id]',
      description: 'Update task status',
    },
    {
      command: '/priority [level] [task-id]',
      description: 'Set task priority',
    },
    { command: '/list', description: 'Show your tasks' },
    { command: '/help', description: 'Show this help' },
  ]

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Available Commands</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {commands.map((cmd, index) => (
          <div key={index} className="text-xs">
            <code className="bg-muted px-2 py-1 rounded text-primary font-mono">
              {cmd.command}
            </code>
            <span className="ml-2 text-muted-foreground">
              {cmd.description}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export interface WhatsAppIntegrationProps {
  className?: string
}

export function WhatsAppIntegration({ className }: WhatsAppIntegrationProps) {
  const [selectedContact, setSelectedContact] = useState<string | null>('1')
  const [newMessage, setNewMessage] = useState('')
  const [showCommands, setShowCommands] = useState(false)
  const [isConnected, setIsConnected] = useState(true)
  const [messages, setMessages] = useState<WhatsAppMessage[]>(mockMessages)

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedContact) return

    const message: WhatsAppMessage = {
      id: Date.now().toString(),
      from: 'business',
      to: selectedContact,
      content: newMessage,
      type: 'outgoing',
      status: 'sent',
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, message])
    setNewMessage('')

    // Simulate message delivery
    setTimeout(() => {
      setMessages(prev =>
        prev.map(msg =>
          msg.id === message.id ? { ...msg, status: 'delivered' } : msg
        )
      )
    }, 1000)

    toast.success('Message sent')
  }

  const handleExportMessages = () => {
    const csv = [
      'ID,From,To,Content,Type,Status,Timestamp,TaskCreated',
      ...messages.map(msg =>
        [
          msg.id,
          msg.from,
          msg.to,
          `"${msg.content.replace(/"/g, '""')}"`,
          msg.type,
          msg.status,
          msg.timestamp.toISOString(),
          msg.taskCreated || false,
        ].join(',')
      ),
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `whatsapp-messages-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    toast.success('Messages exported to CSV')
  }

  const selectedContactData = mockContacts.find(c => c.id === selectedContact)
  const contactMessages = messages.filter(
    msg => msg.from === selectedContact || msg.to === selectedContact
  )

  return (
    <div className={cn('grid grid-cols-1 lg:grid-cols-3 gap-6', className)}>
      {/* Stats Overview */}
      <div className="lg:col-span-3">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <MessageCircle className="w-4 h-4 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">
                    {mockStats.totalMessages}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Total Messages
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{mockStats.tasksCreated}</p>
                  <p className="text-xs text-muted-foreground">Tasks Created</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <div>
                  <p className="text-2xl font-bold">
                    {mockStats.activeContacts}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Active Contacts
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-orange-500" />
                <div>
                  <p className="text-2xl font-bold">
                    {mockStats.responseTime}m
                  </p>
                  <p className="text-xs text-muted-foreground">Avg Response</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Contacts Sidebar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Contacts</span>
            <div className="flex items-center space-x-2">
              <div
                className={cn(
                  'w-2 h-2 rounded-full',
                  isConnected ? 'bg-green-500' : 'bg-red-500'
                )}
              ></div>
              <span className="text-xs text-muted-foreground">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ContactList
            contacts={mockContacts}
            selectedContact={selectedContact}
            onContactSelect={setSelectedContact}
          />
        </CardContent>
      </Card>

      {/* Chat Interface */}
      <div className="lg:col-span-2 space-y-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-base">
                {selectedContactData
                  ? selectedContactData.name
                  : 'Select a contact'}
              </CardTitle>
              {selectedContactData && (
                <CardDescription>{selectedContactData.phone}</CardDescription>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCommands(!showCommands)}
              >
                <Settings className="w-4 h-4 mr-2" />
                Commands
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportMessages}
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <CommandHelp isOpen={showCommands} />

            {/* Messages */}
            <div className="h-96 overflow-y-auto mb-4 border rounded-lg p-4">
              {contactMessages.length > 0 ? (
                contactMessages.map(message => (
                  <MessageBubble key={message.id} message={message} />
                ))
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <div className="text-center">
                    <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No messages yet</p>
                    <p className="text-sm">Start a conversation</p>
                  </div>
                </div>
              )}
            </div>

            {/* Message Input */}
            {selectedContact && (
              <div className="flex space-x-2">
                <Input
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  placeholder="Type a message or use /commands..."
                  onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                  disabled={!isConnected}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || !isConnected}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
