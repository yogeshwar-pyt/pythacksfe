import Bus from '@atom-web/icons-16/Bus';
import NonRefundable from '@atom-web/icons-16/NonRefundable';
import Refundable from '@atom-web/icons-16/Refundable';
import { Column, Row } from '@atom-web/micros';
import { Session } from 'next-auth';
import React from 'react';

import { TransferEntity, CostData } from '@apis/fetchCostDataByTrailId';
import Car from '@components/Icons/Car';
import Timer from '@components/Icons/Timer';
import FullShimmer from '@components/Skeleton/FullShimmer';
import Text from '@components/Text';
import StatusPill from '@components/Trail/StatusPill';
import withSession from '@utils/withSession';
import withTeam from '@utils/withTeam';

import InclusionDate from '../InclusionDate';

const Inclusions = ({
  data,
  expanded,
  isAllChecksMarked,
}: {
  data: TransferEntity;
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
              {`${data.name} ${data.from_to || '--'} to ${
                data.to_desc || '--'
              }`}
            </Text>

            {!expanded ? (
              <Text
                css={{
                  color: '$grey600',
                  fontSize: '$13',
                  lineHeight: '$10i',
                  fontWeight: 600,
                  cursor:'pointer',

                  textDecorationLine: 'underline',
                }}>
                View More
              </Text>
            ) : (
              <Text
                css={{
                  color: '$grey700',
                  fontSize: '$13',
                  lineHeight: '$10i',
                  fontWeight: 400,
                }}>
                {data.prime?.transfer_type}
              </Text>
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
              {data?.identifier === 'BUS_SHARED' ? (
                <Bus css={{ width: 20, height: 20, fill: '$grey500' }} />
              ) : (
                <Car css={{ width: 20, height: 20, fill: '$grey500' }} />
              )}{' '}
              <Text
                css={{
                  fontSize: '$13',
                  lineHeight: '$10i',
                  fontWeight: 400,
                  color: '$grey600',
                  textTransform: 'capitalize',
                }}>
                {data?.identifier
                  ? data.identifier.toLowerCase().replace('_', ' ')
                  : ''}
              </Text>
            </Row>
            <Row css={{ alignItems: 'center', gap: '$4i' }}>
              <Timer css={{ width: 20, height: 20, fill: '$grey500' }} />
              <Text
                css={{
                  fontSize: '$13',
                  lineHeight: '$10i',
                  fontWeight: 400,
                  color: '$grey600',
                }}>
                {`Duration: ${data?.duration ? data.duration : '--'}`}
              </Text>
            </Row>
            <Row css={{ alignItems: 'center', gap: '$4i' }}>
              {data.prime?.refundable ? (
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
                  color: data.prime?.refundable ? '$green300' : '$red300',
                }}>
                {data.prime?.refundable ? 'Refundable' : 'Non Refundable'}
              </Text>
            </Row>
          </Column>
        </Column>
      )}
    </Column>
  );
};

export default withTeam(withSession(Inclusions, FullShimmer), FullShimmer);
