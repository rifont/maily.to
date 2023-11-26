'use client';

import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';
import { Asterisk, Loader2 } from 'lucide-react';
import { sendTestEmailAction } from '@/actions/email';
import { useEditorStrore } from '@/stores/use-editor';
import { useEmailStrore } from '@/stores/use-email';
import { useServerAction } from '@/utils/use-server-action';

interface SubmitButtonProps {
  disabled?: boolean;
}

function SubmitButton(props: SubmitButtonProps) {
  const { disabled } = props;
  const { pending } = useFormStatus();

  return (
    <button
      className="rounded-md bg-white px-2 py-1 text-sm text-black hover:bg-gray-100 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={disabled || pending}
      type="submit"
    >
      {pending ? (
        <Loader2 className="inline-block mr-1 animate-spin" size={16} />
      ) : (
        <Asterisk className="inline-block mr-1" size={16} />
      )}
      Send Email
    </button>
  );
}

export function SendTestEmail() {
  const { json, previewText } = useEditorStrore();
  const { subject, from, replyTo, to } = useEmailStrore();

  const [action] = useServerAction(sendTestEmailAction, (result) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- Result is always there
    const { error } = result!;
    if (error) {
      toast.error(error?.message || 'Something went wrong');
      return;
    }

    toast.success('Email sent successfully');
  });

  return (
    <form action={action}>
      <input name="subject" type="hidden" value={subject} />
      <input name="from" type="hidden" value={from} />
      <input name="replyTo" type="hidden" value={replyTo} />
      <input name="to" type="hidden" value={to} />
      <input name="json" type="hidden" value={JSON.stringify(json) || ''} />
      <input name="previewText" type="hidden" value={previewText} />
      <SubmitButton disabled={!json} />
    </form>
  );
}
