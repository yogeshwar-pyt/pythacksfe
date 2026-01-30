import { Column, Row } from '@atom-web/micros';
import { Session } from 'next-auth';
import React from 'react';

import { VisaEntity, CostData } from '@apis/fetchCostDataByTrailId';
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
  data: VisaEntity;
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

            {!expanded && (
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
              <Text
                css={{
                  fontSize: '$13',
                  lineHeight: '$10i',
                  fontWeight: 400,
                  color: '$grey700',
                }}>
                Visa For :
              </Text>
              <Text
                css={{
                  fontSize: '$13',
                  lineHeight: '$10i',
                  fontWeight: 400,
                  color: '$grey600',
                }}>
                {data.prime.visa_for ? data.prime.visa_for : '--'}
              </Text>
            </Row>
            <Row css={{ alignItems: 'center', gap: '$4i' }}>
              <Text
                css={{
                  fontSize: '$13',
                  lineHeight: '$10i',
                  fontWeight: 400,
                  color: '$grey700',
                }}>
                Marital Status :
              </Text>
              <Text
                css={{
                  fontSize: '$13',
                  lineHeight: '$10i',
                  fontWeight: 400,
                  color: '$grey600',
                }}>
                {data.prime.marital_status ? data.prime.marital_status : '--'}
              </Text>
            </Row>
            <Row css={{ alignItems: 'center', gap: '$4i' }}>
              <Text
                css={{
                  fontSize: '$13',
                  lineHeight: '$10i',
                  fontWeight: 400,
                  color: '$grey700',
                }}>
                Occupation :
              </Text>
              <Text
                css={{
                  fontSize: '$13',
                  lineHeight: '$10i',
                  fontWeight: 400,
                  color: '$grey600',
                }}>
                {data.prime.occupation ? data.prime.occupation : '--'}
              </Text>
            </Row>
          </Column>
        </Column>
      )}
    </Column>
  );
};

export default withTeam(withSession(Inclusions, FullShimmer), FullShimmer);
