import NonRefundable from '@atom-web/icons-16/NonRefundable';
import Refundable from '@atom-web/icons-16/Refundable';
import { Column, Row } from '@atom-web/micros';
import { Session } from 'next-auth';
import React from 'react';

import { FerryEntity, CostData } from '@apis/fetchCostDataByTrailId';
import Timer from '@components/Icons/Timer';
import FullShimmer from '@components/Skeleton/FullShimmer';
import Text from '@components/Text';
import StatusPill from '@components/Trail/StatusPill';
import { formatDateFromString } from '@utils/formatDateFromString';
import withSession from '@utils/withSession';
import withTeam from '@utils/withTeam';

import InclusionDate from '../InclusionDate';

const Inclusions = ({
  data,
  expanded,
  isAllChecksMarked,
}: {
  data: FerryEntity;
  index?: number;
  showSalesHod?: boolean;
  trail: CostData;
  session: Session;
  expanded?: boolean;
  isAllChecksMarked?: boolean;
}) => {
  return (
    <Column css={{ gap: '$10i' }}>
      <Column
        css={{
          gap: '$8i',
          width: '100%',
        }}>
        <Row css={{ gap: '$6i' }}>
          <InclusionDate
            value={data.date}
            isAllChecksMarked={isAllChecksMarked}
          />
          <Column css={{ gap: '$2i' }}>
            <Text
              css={{
                color: '$grey700',
                fontSize: '$13',
                lineHeight: '$10i',
                fontWeight: 500,
              }}>
              {data?.name || '--'}
            </Text>

            {!expanded ? (
              <Text
                css={{
                  color: '$grey600',
                  fontSize: '$13',
                  lineHeight: '$10i',
                  fontWeight: 600,
                  textDecorationLine: 'underline',
                  cursor:'pointer',

                }}>
                View More
              </Text>
            ) : (
              <>
                <Text
                  css={{
                    color: '$grey600',
                    fontSize: '$6i',
                    lineHeight: '$10i',
                    fontWeight: 500,
                  }}>
                  {data.from_to && data.to_desc
                    ? `${data.from_to} → ${data.to_desc}`
                    : '--'}
                </Text>
                <Text
                  css={{
                    color: '$grey700',
                    fontSize: '$13',
                    lineHeight: '$10i',
                    fontWeight: 400,
                  }}>
                  {formatDateFromString(data?.date, 'dd/MM/yy')} →{' '}
                  {formatDateFromString(data?.to_date, 'dd/MM/yy')}
                </Text>
              </>
            )}
          </Column>
        </Row>
      </Column>
      {expanded && (
        <Column
          css={{
            gap: '$8i',
            width: '100%',
          }}>
          <Row css={{ gap: '$4i', alignItems: 'center' }}>
            {data?.paid === 1 ? (
              <Column css={{ gap: '$6i' }}>
                <StatusPill varient="green" title="Booked" />
              </Column>
            ) : (
              <>
                {data?.status === 2 ? (
                  <StatusPill varient="yellow" title="Interim Confirm" />
                ) : null}
                {data?.status === 3 ? (
                  <StatusPill varient="red" title="Reject" />
                ) : null}
                {data?.status !== 2 && data?.status !== 3 ? (
                  <StatusPill varient="black" title="Yet to book" />
                ) : null}
              </>
            )}
            <StatusPill varient="blue" title={data?.trail_cost_id} />
          </Row>
          <Column css={{ gap: '$4i' }}>
            <Row css={{ alignItems: 'center', gap: '$4i' }}>
              <Timer css={{ width: 20, height: 20, fill: '$grey500' }} />

              <Text
                css={{
                  fontSize: '$13',
                  lineHeight: '$10i',
                  fontWeight: 400,
                  color: '$grey600',
                }}>
                {`Duration: ${data.duration ? data.duration : '--'}`}
              </Text>
            </Row>
            <Row css={{ alignItems: 'center', gap: '$4i' }}>
              {data?.prime.refundable ? (
                <Refundable
                  css={{ width: 20, height: 20, fill: '$green300' }}
                />
              ) : (
                <NonRefundable
                  css={{ width: 20, height: 20, fill: '$red300' }}
                />
              )}

              <Text
                css={{
                  fontSize: '$13',
                  lineHeight: '$10i',
                  fontWeight: 400,
                  color: data.prime.refundable ? '$green300' : '$red300',
                }}>
                {data?.prime.refundable ? 'Refundable' : 'Non Refundable'}
              </Text>
            </Row>
          </Column>
        </Column>
      )}
    </Column>
  );
};

export default withTeam(withSession(Inclusions, FullShimmer), FullShimmer);
