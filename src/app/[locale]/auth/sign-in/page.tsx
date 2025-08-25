"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useTranslations } from "next-intl"
import { Building2, Mail } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { OTPInput } from "@/components/form/otp-input"

const createEmailSchema = (t: any) => z.object({
  email: z.string().email(t('validation.invalidEmail')),
})

const createOtpSchema = (t: any) => z.object({
  otp: z.string().min(6, t('validation.invalidOtp')),
})

export default function SignInPage() {
  const t = useTranslations()
  const [step, setStep] = React.useState<"email" | "otp">("email")
  const [email, setEmail] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [canResend, setCanResend] = React.useState(false)
  const [countdown, setCountdown] = React.useState(0)

  const emailSchema = createEmailSchema(t)
  const otpSchema = createOtpSchema(t)

  type EmailFormData = z.infer<typeof emailSchema>
  type OTPFormData = z.infer<typeof otpSchema>

  const emailForm = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" }
  })

  const otpForm = useForm<OTPFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" }
  })

  // Countdown timer for resend functionality
  React.useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [countdown])

  const handleEmailSubmit = async (data: EmailFormData) => {
    setIsLoading(true)
    try {
      // TODO: Integrate with Supabase Auth
      // await supabase.auth.signInWithOtp({ email: data.email })
      
      console.log("Sending OTP to:", data.email)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setEmail(data.email)
      setStep("otp")
      setCountdown(60)
      setCanResend(false)
    } catch (error) {
      console.error("Error sending OTP:", error)
      // TODO: Show error message
    } finally {
      setIsLoading(false)
    }
  }

  const handleOTPSubmit = async (data: OTPFormData) => {
    setIsLoading(true)
    try {
      // TODO: Integrate with Supabase Auth
      // await supabase.auth.verifyOtp({ email, token: data.otp, type: 'email' })
      
      console.log("Verifying OTP:", data.otp, "for email:", email)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // TODO: Redirect to dashboard after successful verification
      console.log("OTP verified successfully")
      
    } catch (error) {
      console.error("Error verifying OTP:", error)
      // TODO: Show error message
      otpForm.setError("otp", { message: t('auth.invalidOtp') })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOTP = async () => {
    if (!canResend) return
    
    setIsLoading(true)
    try {
      // TODO: Integrate with Supabase Auth
      // await supabase.auth.signInWithOtp({ email })
      
      console.log("Resending OTP to:", email)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setCountdown(60)
      setCanResend(false)
      
      // Clear any existing OTP
      otpForm.reset()
    } catch (error) {
      console.error("Error resending OTP:", error)
      // TODO: Show error message
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToEmail = () => {
    setStep("email")
    setEmail("")
    otpForm.reset()
    setCanResend(false)
    setCountdown(0)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="size-12 bg-primary rounded-lg flex items-center justify-center">
              <Building2 className="size-6 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl">
            {step === "email" ? "Tekrar Hoşgeldiniz" : "E-postanızı Kontrol Edin"}
          </CardTitle>
          <CardDescription>
            {step === "email" 
              ? "Hesabınıza giriş yapmak için e-posta adresinizi girin" 
              : `${email} adresine doğrulama kodu gönderdik`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === "email" ? (
            <Form {...emailForm}>
              <form onSubmit={emailForm.handleSubmit(handleEmailSubmit)} className="space-y-4">
                <FormField
                  control={emailForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-posta Adresi</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
                          <Input
                            type="email"
                            placeholder="siz@firma.com"
                            className="pl-10"
                            autoComplete="email"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Kod Gönderiliyor..." : "Doğrulama Kodu Gönder"}
                </Button>
              </form>
            </Form>
          ) : (
            <Form {...otpForm}>
              <form onSubmit={otpForm.handleSubmit(handleOTPSubmit)} className="space-y-6">
                <FormField
                  control={otpForm.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Doğrulama Kodu</FormLabel>
                      <FormControl>
                        <OTPInput
                          length={6}
                          value={field.value}
                          onChange={field.onChange}
                          onComplete={(value) => {
                            field.onChange(value)
                            // Auto-submit when complete
                            if (value.length === 6) {
                              otpForm.handleSubmit(handleOTPSubmit)()
                            }
                          }}
                          autoFocus
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="space-y-4">
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Doğrulanıyor..." : "Kodu Doğrula"}
                  </Button>
                  
                  <div className="text-center space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Kodu almadınız mı?
                    </p>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleResendOTP}
                      disabled={!canResend || isLoading}
                      className="text-sm"
                    >
                      {canResend 
                        ? "Kodu Tekrar Gönder" 
                        : `${countdown}s sonra tekrar gönder`
                      }
                    </Button>
                  </div>
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBackToEmail}
                    className="w-full"
                    disabled={isLoading}
                  >
                    E-postaya Geri Dön
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}