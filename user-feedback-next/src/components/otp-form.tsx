import type React from "react"
import { GalleryVerticalEnd } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp"

export function OTPForm({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form>
        <FieldGroup>
          <div className="flex flex-col items-center gap-3 text-center">
            <a href="#" className="flex flex-col items-center gap-3 font-light">
              <div className="flex size-10 items-center justify-center rounded-lg bg-card border border-border/50">
                <GalleryVerticalEnd className="size-5 text-foreground/90" />
              </div>
              <span className="sr-only">Acme Inc.</span>
            </a>
            <h1 className="text-2xl font-light tracking-tight text-foreground">Enter verification code</h1>
            <FieldDescription className="text-muted-foreground font-light">
              We sent a 6-digit code to your email address
            </FieldDescription>
          </div>
          <Field>
            <FieldLabel htmlFor="otp" className="sr-only">
              Verification code
            </FieldLabel>
            <InputOTP maxLength={6} id="otp" required containerClassName="gap-3">
              <InputOTPGroup className="gap-2 *:data-[slot=input-otp-slot]:h-14 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:rounded-lg *:data-[slot=input-otp-slot]:border *:data-[slot=input-otp-slot]:border-border/50 *:data-[slot=input-otp-slot]:bg-card *:data-[slot=input-otp-slot]:text-lg *:data-[slot=input-otp-slot]:font-light *:data-[slot=input-otp-slot]:transition-all *:data-[slot=input-otp-slot]:hover:border-border">
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator className="text-muted-foreground/40" />
              <InputOTPGroup className="gap-2 *:data-[slot=input-otp-slot]:h-14 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:rounded-lg *:data-[slot=input-otp-slot]:border *:data-[slot=input-otp-slot]:border-border/50 *:data-[slot=input-otp-slot]:bg-card *:data-[slot=input-otp-slot]:text-lg *:data-[slot=input-otp-slot]:font-light *:data-[slot=input-otp-slot]:transition-all *:data-[slot=input-otp-slot]:hover:border-border">
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            <FieldDescription className="text-center text-muted-foreground font-light">
              Didn&apos;t receive the code?{" "}
              <a
                href="#"
                className="text-foreground/90 hover:text-foreground transition-colors underline underline-offset-4"
              >
                Resend
              </a>
            </FieldDescription>
          </Field>
          <Field>
            <Button
              type="submit"
              className="font-normal tracking-wide bg-foreground/95 text-background hover:bg-foreground"
            >
              Verify
            </Button>
          </Field>
        </FieldGroup>
      </form>
      <FieldDescription className="px-6 text-center text-muted-foreground text-sm font-light">
        By clicking continue, you agree to our{" "}
        <a href="#" className="text-foreground/80 hover:text-foreground transition-colors underline underline-offset-4">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="text-foreground/80 hover:text-foreground transition-colors underline underline-offset-4">
          Privacy Policy
        </a>
        .
      </FieldDescription>
    </div>
  )
}
