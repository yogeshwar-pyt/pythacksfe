import NonRefundable from '@atom-web/icons-16/NonRefundable';
import Refundable from '@atom-web/icons-16/Refundable';
import Wifi from '@atom-web/icons-16/Wifi';
import { Column, Row } from '@atom-web/micros';
import { format, isValid } from 'date-fns';
import { find } from 'lodash';
import { Session } from 'next-auth';
import React from 'react';

import { City } from '@apis/fetchCities';
import { RentalCarEntity, CostData } from '@apis/fetchCostDataByTrailId';
import Timer from '@components/Icons/Timer';
import FullShimmer from '@components/Skeleton/FullShimmer';
import Text from '@components/Text';
import StatusPill from '@components/Trail/StatusPill';
import useCities from '@hooks/useCities';
import withSession from '@utils/withSession';
import withTeam from '@utils/withTeam';

import InclusionDate from '../InclusionDate';

const Inclusions = ({
  data,
  expanded,
  isAllChecksMarked,
}: {
  data: RentalCarEntity;
  index?: number;
  showSalesHod?: boolean;
  trail: CostData;
  session: Session;
  expanded?: boolean;
  isAllChecksMarked?: boolean;
}) => {
  const cities = useCities();
  const fromCity =
    find(cities, { id: parseInt(data.from_to, 10) }) || ({} as City);
  const toCity =
    find(cities, { id: parseInt(data.to_desc, 10) }) || ({} as City);

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
                    ? `${fromCity.city} → ${toCity.city}`
                    : '--'}
                </Text>
                <Text
                  css={{
                    color: '$grey600',
                    fontSize: '$5i',
                    fontWeight: 400,
                    lineHeight: '$9i',
                    textTransform: 'uppercase',
                  }}>
                  {data.date && data.to_date ? (
                    <>
                      {isValid(new Date(data.date))
                        ? format(new Date(data.date), 'dd/MMM/yyyy')
                        : ''}{' '}
                      →{' '}
                      {isValid(new Date(data.to_date))
                        ? format(new Date(data.to_date), 'dd/MMM/yyyy')
                        : ''}
                    </>
                  ) : (
                    '--'
                  )}
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
                {`Duration: ${data.duration ? `${data.duration} days` : '--'}`}
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
                Insurance :
              </Text>
              <Text
                css={{
                  fontSize: '$13',
                  lineHeight: '$10i',
                  fontWeight: 400,
                  color: '$grey600',
                }}>
                {data?.prime && data.prime.insurance
                  ? data.prime.insurance
                  : '--'}
              </Text>
            </Row>
            {data?.prime.gps ? (
              <Row css={{ alignItems: 'center', gap: '$4i' }}>
                <Wifi css={{ width: 20, height: 20, fill: '$green300' }} />
                <Text
                  css={{
                    fontSize: '$13',
                    lineHeight: '$10i',
                    fontWeight: 400,
                    color: '$green300',
                  }}>
                  GPS
                </Text>
              </Row>
            ) : (
              <Row css={{ alignItems: 'center', gap: '$4i' }}>
                <Wifi css={{ width: 20, height: 20, fill: '$red300' }} />
                <Text
                  css={{
                    fontSize: '$13',
                    lineHeight: '$10i',
                    fontWeight: 400,
                    color: '$red300',
                  }}>
                  No GPS
                </Text>
              </Row>
            )}
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
