import { BubbleMenu } from '@tiptap/react';

import { BubbleMenuButton } from './bubble-menu-button';
import { allowedSpacerSize } from '../nodes/spacer';
import {
  BubbleMenuItem,
  EditorBubbleMenuProps,
} from './text-menu/text-bubble-menu';

export function SpacerBubbleMenu(props: EditorBubbleMenuProps) {
  const { editor, appendTo } = props;

  const items: BubbleMenuItem[] = allowedSpacerSize.map((height) => ({
    name: height,
    isActive: () => editor?.isActive('spacer', { height })!,
    command: () => {
      editor?.chain().focus().setSpacer({ height }).run();
    },
  }));

  const bubbleMenuProps: EditorBubbleMenuProps = {
    ...props,
    ...(appendTo ? { appendTo: appendTo.current } : {}),
    shouldShow: ({ editor }) => editor.isActive('spacer'),
    tippyOptions: {
      maxWidth: '100%',
      moveTransition: 'mly-transform 0.15s mly-ease-out',
    },
  };

  return (
    <BubbleMenu
      {...bubbleMenuProps}
      className="mly-flex mly-gap-1 mly-rounded-md mly-border mly-border-slate-200 mly-bg-white mly-p-1 mly-shadow-md"
    >
      {items.map((item, index) => (
        <BubbleMenuButton
          key={index}
          className="!mly-h-7 mly-w-7 mly-shrink-0 mly-p-0"
          iconClassName="mly-w-3 mly-h-3"
          nameClassName="mly-text-xs"
          {...item}
        />
      ))}
    </BubbleMenu>
  );
}
