import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field"

export function NotificationsContent() {
  return (
    <div className="w-full max-w-4xl">
      <FieldGroup>
        <FieldSet>
          <FieldLabel>New Feedback</FieldLabel>
          <FieldDescription>
            Get notified when new feedback is submitted to your team.
          </FieldDescription>
          <FieldGroup data-slot="checkbox-group">
            <Field orientation="horizontal">
              <Checkbox id="push-feedback" defaultChecked />
              <FieldLabel htmlFor="push-feedback" className="font-normal">
                Push notifications
              </FieldLabel>
            </Field>
            <Field orientation="horizontal">
              <Checkbox id="email-feedback" defaultChecked />
              <FieldLabel htmlFor="email-feedback" className="font-normal">
                Email notifications
              </FieldLabel>
            </Field>
          </FieldGroup>
        </FieldSet>
        <FieldSeparator />
        <FieldSet>
          <FieldLabel>Feature Requests</FieldLabel>
          <FieldDescription>
            Get notified when feature requests are created or updated.
          </FieldDescription>
          <FieldGroup data-slot="checkbox-group">
            <Field orientation="horizontal">
              <Checkbox id="push-features" />
              <FieldLabel htmlFor="push-features" className="font-normal">
                Push notifications
              </FieldLabel>
            </Field>
            <Field orientation="horizontal">
              <Checkbox id="email-features" />
              <FieldLabel htmlFor="email-features" className="font-normal">
                Email notifications
              </FieldLabel>
            </Field>
          </FieldGroup>
        </FieldSet>
        <FieldSeparator />
        <FieldSet>
          <FieldLabel>Status Updates</FieldLabel>
          <FieldDescription>
            Get notified when feedback or feature request status changes.
          </FieldDescription>
          <FieldGroup data-slot="checkbox-group">
            <Field orientation="horizontal">
              <Checkbox id="push-status" defaultChecked />
              <FieldLabel htmlFor="push-status" className="font-normal">
                Push notifications
              </FieldLabel>
            </Field>
            <Field orientation="horizontal">
              <Checkbox id="email-status" />
              <FieldLabel htmlFor="email-status" className="font-normal">
                Email notifications
              </FieldLabel>
            </Field>
          </FieldGroup>
        </FieldSet>
      </FieldGroup>
    </div>
  )
}
