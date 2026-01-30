import { Tooltip } from '@atom-web/macros';
import { Column, Row } from '@atom-web/micros';
import { format, parseISO } from 'date-fns';
import isEmpty from 'lodash.isempty';
import Link from 'next/link';
import React from 'react';

import { Trail } from '@apis/fetchNinerChecksQuestions';
import Text from '@components/Text';

const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'closed':
      return '#16A34A';
    case 'reopened':
    case 'on hold':
    case 'open':
      return '#EA580C';
    default:
      return '';
  }
};

const getTicketStatusText = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'closed':
      return 'CLOSED TICKET';
    case 'open':
      return 'OPEN TICKET';
    case 'reopened':
      return 'REOPENED TICKET';
    case 'on hold':
      return 'ONHOLD TICKET';
    default:
      return '--';
  }
};

const getStatusDateText = (status: string, formattedDate: string): string => {
  switch (status.toLowerCase()) {
    case 'closed':
      return `Closed on ${formattedDate}`;
    case 'open':
    case 'reopened':
    case 'on hold':
      return `Raised on ${formattedDate}`;
    default:
      return '--';
  }
};

const NinerTicket = ({ niner }: { niner: Trail }) => {
  const ticket = niner?.niner_ticket || {};

  if (isEmpty(ticket)) {
    return null;
  }

  const closedDate = ticket?.task_completed_on;
  const raisedDate = ticket?.created_at;

  const formattedDate = closedDate
    ? format(parseISO(closedDate), 'MMM d, yyyy')
    : raisedDate
    ? format(parseISO(raisedDate), 'MMM d, yyyy')
    : '';

  const statusColor: string = getStatusColor(ticket.status.name);
  const ticketStatusText: string = getTicketStatusText(ticket.status.name);
  const statusDateText: string = getStatusDateText(
    ticket.status.name,
    formattedDate,
  );

  return (
    <Row
      css={{
        border: '1px solid $grey400',
        borderRadius: '$3',
        padding: '$6i $12i',
        gap: '$6i',
        background: '$grey100',
        alignItems: 'center',
        width: 'fit-content',
        height: '74px',
        minWidth: '200px',
        borderLeft: `3px solid ${statusColor}`,
      }}>
      {!isEmpty(ticket) ? (
        <Link
          style={{
            textDecoration: 'none',
          }}
          href={`/ticketing/task/${ticket?.ticket_id}`}
          target="_blank">
          <Tooltip
            css={{
              zIndex: 5,
              background: '$tooltipBg',
              padding: '$4i',
            }}
            side="bottom"
            delayDuration={0}
            content={'Open in ticketing'}>
            <Column
              css={{
                gap: '$1i',
              }}>
              <Text
                css={{
                  fontSize: '$5i',
                  color: '$grey600',
                  fontWeight: '600',
                  lineHeight: '$10i',
                  letterSpacing: '0.4px',
                  textTransform: 'uppercase',
                }}>
                {ticket?.ticket_id} -{' '}
                <span style={{ color: statusColor }}>{ticketStatusText}</span>
              </Text>
              <Text
                css={{
                  fontSize: '$13',
                  color: '$grey700',
                  fontWeight: '400',
                  lineHeight: '$10i',
                }}>
                {ticket.title}
              </Text>
              <Text
                css={{
                  fontSize: '$13',
                  color: '$grey600',
                  fontWeight: '400',
                  lineHeight: '$10i',
                }}>
                {statusDateText}
              </Text>
            </Column>
          </Tooltip>
        </Link>
      ) : null}
    </Row>
  );
};

export default NinerTicket;
