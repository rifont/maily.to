import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { redirect } from 'next/navigation';
import type { JSONContent } from '@tiptap/core';
import { ENVELOPE_API_KEY, ENVELOPE_ENDPOINT } from '@/utils/constants';
import { EditorPreview } from '@/components/editor-preview';
import type { Database } from '@/types/database';
import { EditorProvider } from '@/stores/editor-store';
import { PreviewEmail } from '@/components/preview-email';
import { CopyEmailHtml } from '@/components/copy-email-html';
import { UpdateEmail } from '@/components/update-email';
import { DeleteEmail } from '@/components/delete-email';

export const dynamic = 'force-dynamic';

interface TemplatePageProps {
  params?: {
    templateId: string;
  };
}

export default async function TemplatePage(props: TemplatePageProps) {
  const { templateId } = props.params || {};

  const cookieStore = cookies();
  const apiKey = cookieStore.get(ENVELOPE_API_KEY)?.value;
  const endpoint = cookieStore.get(ENVELOPE_ENDPOINT)?.value;

  const supabase = createServerComponentClient<Database>({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login');
  }

  if (!templateId) {
    return redirect('/template');
  }

  const { data: template } = await supabase
    .from('mails')
    .select('*')
    .eq('id', templateId)
    .eq('user_id', user.id)
    .single();

  if (!template) {
    return redirect('/template');
  }

  // eslint-disable-next-line camelcase -- This is a prop
  const { preview_text, title } = template;
  let { content } = template;
  content = JSON.parse(content as string);

  return (
    <EditorProvider
      apiKey={apiKey}
      endpoint={endpoint}
      // eslint-disable-next-line camelcase -- This is a prop
      previewText={preview_text || ''}
      subject={title || ''}
    >
      <div className="flex items-center justify-between gap-1.5">
        <div className="flex items-center gap-1.5 mt-6">
          <PreviewEmail />
          <CopyEmailHtml />
        </div>
        <div className="flex items-center gap-1.5 mt-6">
          <DeleteEmail templateId={templateId} />
          <UpdateEmail templateId={templateId} />
        </div>
      </div>
      <EditorPreview
        config={{
          autofocus: 'end',
        }}
        content={content as JSONContent}
      />
    </EditorProvider>
  );
}