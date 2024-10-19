import { BaseButton } from '@/editor/components/base-button';
import { cn } from '@/editor/utils/classname';
import { BubbleMenuItem } from './text-menu/text-bubble-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

export function BubbleMenuButton(item: BubbleMenuItem) {
  const { tooltip } = item;

  const content = (
    <BaseButton
      variant="ghost"
      size="sm"
      onClick={item.command}
      data-state={item?.isActive?.()}
      className={cn(
        'mly-px-2.5 disabled:mly-cursor-not-allowed',
        item?.className
      )}
      type="button"
      disabled={item.disbabled}
    >
      {item.icon ? (
        <item.icon
          className={cn('shrink-0 mly-h-3.5 mly-w-3.5', item?.iconClassName)}
        />
      ) : (
        <span
          className={cn(
            'mly-text-sm mly-font-medium mly-text-slate-600',
            item?.nameClassName
          )}
        >
          {item.name}
        </span>
      )}
    </BaseButton>
  );

  if (tooltip) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent sideOffset={8}>{tooltip}</TooltipContent>
      </Tooltip>
    );
  }

  return content;
}
