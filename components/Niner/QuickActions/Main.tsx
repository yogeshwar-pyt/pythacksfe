import { Dropdown, Tooltip } from '@atom-web/macros';
import { Row } from '@atom-web/micros';
import { HTTPError } from '@plato/api-core';
import { useAtomValue } from 'jotai';
import isEmpty from 'lodash.isempty';
import { Session } from 'next-auth';
import React, { Suspense, useCallback, useRef } from 'react';
import toast from 'react-hot-toast';

import { useLinkNinerTicketTrail } from '@actions/useLinkNinerTicketTrail';
import { CostData } from '@apis/fetchCostDataByTrailId';
import { Trail } from '@apis/fetchNinerChecksQuestions';
import { Invoices } from '@apis/fetchUploadsByTrail';
import { EmployeeWithRole } from '@apis/fetchUser';
import StyledButton from '@components/Button';
import MoreHoriz from '@components/Icons/MoreHoriz';
import OpenNew from '@components/Icons/OpenNew';
import SmallPdf from '@components/Icons/SmallPdf';
import FullShimmer from '@components/Skeleton/FullShimmer';
import Text from '@components/Text';
import { trailIdAtom } from '@store/costsheetAtom';

import RaiseTicketSidePanel, { RaiseTicketRefType } from '../RaiseTicket';

import PassportSidePanelUpload, {
  PassportSidePanelUploadRefType,
} from './Passports/PassportSidePanel';

const QuickActions = ({
  docs,
  isDocLoading,
  session,
  loginUser,
  ninerRefetch,
  niner,
}: {
  loginUser: EmployeeWithRole;
  session: Session;
  trailData?: CostData;
  docs?: Invoices;
  isDocLoading: boolean;
  ninerRefetch: () => void;
  niner?: Trail;
}) => {
  const passportViewButtonRef = useRef<PassportSidePanelUploadRefType>(null);
  const raiseTicketRef = useRef<RaiseTicketRefType>(null);
  const { linkTicketTrailAsync } = useLinkNinerTicketTrail();
  const openGoogleMap = () => {
    const mapUrl = 'https://www.google.com/maps';
    window.open(mapUrl, '_blank');
  };
  const trailId = useAtomValue(trailIdAtom);
  const isPassportEmpty =
    !docs ||
    !docs.passports?.list ||
    isDocLoading ||
    isEmpty(docs.passports.list);

  const isAlreadyTicketRaised = !isEmpty(niner?.niner_ticket);

  const handleLinkNinerTicket = useCallback(
    async (ticket_id: number) => {
      try {
        const response = await toast.promise(
          linkTicketTrailAsync({
            authToken: session.accessToken,
            trail_id: trailId as number,

            ticket_id,
          }),
          {
            loading: 'Linking ticket..',
            success: 'Linked successfully',
            error: 'Ticket not linked, try again!',
          },
        );
        if (response.status === 'SUCCESS') {
          ninerRefetch();
        }
      } catch (e) {
        if (e) {
          toast.error((e as unknown as HTTPError).message);
        }
      }
    },
    [linkTicketTrailAsync, ninerRefetch, session.accessToken, trailId],
  );

  return (
    <Row>
      <Dropdown.Root>
        <Dropdown.Trigger asChild>
          <StyledButton
            css={{
              padding: '$3i',
              width: 'fit-content',
            }}
            secondary>
            <Tooltip
              css={{
                zIndex: 5,
                background: '$tooltipBg',
                padding: '$4i',
                overflow: 'hidden',
              }}
              side="bottom"
              delayDuration={0}
              content={'Quick Actions'}>
              <Row>
                <MoreHoriz width={20} height={20} />
              </Row>
            </Tooltip>
          </StyledButton>
        </Dropdown.Trigger>

        <Dropdown.Content
          sideOffset={5}
          css={{
            zIndex: 10,
            padding: 0,
          }}>
          <Dropdown.Item
            css={{
              padding: '$4i $6i',
              cursor: isPassportEmpty ? 'not-allowed' : 'pointer',
              opacity: isPassportEmpty ? 0.5 : 1,
            }}>
            <Row
              css={{
                gap: '$6i',
                cursor: 'pointer',
                pointerEvents: isPassportEmpty ? 'none' : 'auto',
              }}
              align={'center'}
              onClick={() => {
                passportViewButtonRef?.current?.open(docs);
              }}>
              <SmallPdf />
              <Text
                css={{
                  color: '$grey600',
                  fontWeight: 400,
                  lineHeight: '$10i',
                  fontSize: '$13',
                }}>
                All Passports
              </Text>
            </Row>
          </Dropdown.Item>
          <Dropdown.Item
            css={{
              padding: '$4i $6i',
              cursor: isAlreadyTicketRaised ? 'not-allowed' : 'pointer',
              opacity: isAlreadyTicketRaised ? 0.5 : 1,
            }}>
            <Row
              css={{
                gap: '$6i',
                cursor: 'pointer',
                pointerEvents: isAlreadyTicketRaised ? 'none' : 'auto',
              }}
              align={'center'}
              onClick={() => raiseTicketRef.current?.open()}>
              <OpenNew />
              <Text
                css={{
                  color: '$grey600',
                  fontWeight: 400,
                  lineHeight: '$10i',
                  fontSize: '$13',
                }}>
                Raise Ticket
              </Text>
            </Row>
          </Dropdown.Item>
          <Dropdown.Item
            css={{
              padding: '$4i $6i',
            }}>
            <Row
              css={{ gap: '$6i', cursor: 'pointer' }}
              align={'center'}
              onClick={openGoogleMap}>
              <OpenNew />
              <Text
                css={{
                  color: '$grey600',
                  fontWeight: 400,
                  lineHeight: '$10i',
                  fontSize: '$13',
                }}>
                Google Map
              </Text>
            </Row>
          </Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Root>
      <PassportSidePanelUpload
        ref={passportViewButtonRef}
        onUpdate={() => {
          // refetch();
        }}
      />
      <Suspense fallback={<FullShimmer />}>
        <RaiseTicketSidePanel
          ref={raiseTicketRef}
          session={session}
          loginUser={loginUser}
          trailId={trailId || undefined}
          onSuccess={id => {
            handleLinkNinerTicket(id);
          }}
        />
      </Suspense>
    </Row>
  );
};

export default QuickActions;
