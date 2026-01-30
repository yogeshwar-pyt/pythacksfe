import { CSS } from '@atom-web/core';
import { Drawer } from '@atom-web/macros';
import { Column } from '@atom-web/micros';
import { Session } from 'next-auth';
import React, {
  Suspense,
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react';

import { EmployeeWithRole } from '@apis/fetchUser';
import StyledButton from '@components/Button';
import FullShimmer from '@components/Skeleton/FullShimmer';
import Text from '@components/Text';
import RaiseTicketForm from '@components/Ticketing/RaiseTicket/RaiseTicketForm';

type RaiseTicketProps = {
  session: Session;
  loginUser: EmployeeWithRole;
  trailId?: number;
  onSuccess: (id: number) => void;
  css?: CSS;
};

export type RaiseTicketRefType = {
  open: () => void;
  close: () => void;
};

const RaiseTicketSidePanel = forwardRef<RaiseTicketRefType, RaiseTicketProps>(
  ({ css, session, loginUser, trailId, onSuccess }, internalRef) => {
    const buttonRef = useRef<HTMLButtonElement>(null);

    useImperativeHandle(internalRef, () => ({
      open: () => {
        buttonRef.current?.click();
      },
      close: () => {
        buttonRef.current?.click();
      },
    }));
    return (
      <Drawer.Root>
        <Drawer.Trigger asChild>
          <StyledButton ref={buttonRef} />
        </Drawer.Trigger>
        <Drawer.Content
          overlayZindex={5}
          css={{
            zIndex: 6,
            width: '800px',
            height: '100%',
            overflow: 'auto',
            '> button': {
              top: '$sizes$8i',
              right: '$sizes$8i',
            },
            ...css,
          }}
          side="right">
          <Column css={{ height: '100vh' }}>
            <Column
              css={{
                padding: '$10i $12i',
                borderBottom: '1px solid $colors$grey400',
              }}>
              <Text
                md
                css={{ fontWeight: '$semibold', textTransform: 'capitalize' }}>
                New Ticket
              </Text>
            </Column>
            <Column css={{ height: '100%', width: '100%', overflow: 'hidden' }}>
              <Suspense fallback={<FullShimmer />}>
                <RaiseTicketForm
                  session={session}
                  loginUser={loginUser}
                  onSuccess={id => {
                    buttonRef.current?.click();
                    onSuccess(id);
                  }}
                  trailId={trailId}
                />
              </Suspense>
            </Column>
          </Column>
        </Drawer.Content>
      </Drawer.Root>
    );
  },
);

RaiseTicketSidePanel.displayName = 'RaiseTicket';

export default RaiseTicketSidePanel;
