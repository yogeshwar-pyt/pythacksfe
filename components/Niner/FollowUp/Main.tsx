import { CSS } from '@atom-web/core';
import { Drawer } from '@atom-web/macros';
import { Column } from '@atom-web/micros';
import { Suspense, forwardRef, useImperativeHandle, useRef } from 'react';

import { Customer } from '@apis/fetchSalesLeadsByType';
import StyledButton from '@components/Button';
import FullShimmer from '@components/Skeleton/FullShimmer';
import Text from '@components/Text';

import FollowUpForm from './Form';

type FollowUpProps = {
  onUpdate: () => void;
  css?: CSS;
  trailId: number;
  customer?: Customer;
};

export type FollowUpRefType = {
  open: () => void;
  close: () => void;
};
const FollowUp = forwardRef<FollowUpRefType, FollowUpProps>(
  ({ css, trailId, customer }, internalRef) => {
    const openButtonRef = useRef<HTMLButtonElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);

    useImperativeHandle(internalRef, () => ({
      open: () => {
        openButtonRef.current?.click();
      },
      close: () => {
        closeButtonRef.current?.click();
      },
    }));

    return (
      <Drawer.Root>
        <Drawer.Trigger asChild>
          <StyledButton ref={openButtonRef} />
        </Drawer.Trigger>
        <Drawer.Close asChild>
          <StyledButton ref={closeButtonRef} />
        </Drawer.Close>
        <Drawer.Content
          overlayZindex={5}
          css={{
            zIndex: 6,
            width: '500px',
            height: '100%',
            overflow: 'auto',
            '> button': {
              top: '$sizes$8i',
              right: '$sizes$8i',
            },
            ...css,
          }}
          side="right">
          <Column
            css={{
              height: '100%',
              overflow: 'hidden',
              width: '100%',
            }}>
            <Column
              css={{
                padding: '$8i $12i',
                borderBottom: '1px solid $colors$grey400',
                alignSelf: 'stretch',
              }}>
              <Text
                css={{
                  fontWeight: 700,
                  textTransform: 'capitalize',
                  lineHeight: '$12i',
                  color: '$grey700',
                  fontSize: '$8i',
                }}>
                {trailId} - {customer?.name || ''}
              </Text>
            </Column>
            <Suspense fallback={<FullShimmer />}>
              <FollowUpForm
                onClose={() => closeButtonRef.current?.click()}
                trailId={trailId}
              />
            </Suspense>
          </Column>
        </Drawer.Content>
      </Drawer.Root>
    );
  },
);

FollowUp.displayName = 'FollowUp';

export default FollowUp;
