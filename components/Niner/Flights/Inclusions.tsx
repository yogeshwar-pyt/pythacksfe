import NonRefundable from '@atom-web/icons-16/NonRefundable';
import Refundable from '@atom-web/icons-16/Refundable';
import { Column, Row } from '@atom-web/micros';
import { format, intervalToDuration, minutesToHours } from 'date-fns';
import { Session } from 'next-auth';
import React, { Fragment, useCallback } from 'react';

import {
  FlightDetailsEntity,
  FlightEntity,
  RoutesEntity,
} from '@apis/fetchCostDataByTrailId';
import InternationAirLines from '@components/Icons/InternationalAirlines';
import Luggage from '@components/Icons/Luggage';
import FullShimmer from '@components/Skeleton/FullShimmer';
import Text from '@components/Text';
import StatusPill from '@components/Trail/StatusPill';
import withSession from '@utils/withSession';
import withTeam from '@utils/withTeam';

import InclusionDate from '../InclusionDate';

const Inclusions = ({
  flight,
  inclusion,
  index,
  expanded,
  isFirstInclusion,
  isAllChecksMarked,
}: {
  flight: FlightEntity;
  inclusion: FlightDetailsEntity;
  index: number;
  showSalesHod?: boolean;
  session: Session;
  expanded?: boolean;
  isFirstInclusion?: boolean;
  isAllChecksMarked?: boolean;
}) => {
  const calculateDuration = useCallback((route: RoutesEntity) => {
    if (route.travelDuration.includes(':')) {
      const from = ` ${route.departureDate},${route.departureTime}`;
      const to = ` ${route.arrivalDate},${route.arrivalTime}`;
      const timeDiff = intervalToDuration({
        start: new Date(from),
        end: new Date(to),
      });
      const hrs = timeDiff.hours !== 0 ? `${timeDiff.hours}h` : '';
      const mins = timeDiff.minutes !== 0 ? `${timeDiff.minutes}m` : '';
      return `${hrs} ${mins}`;
    } else {
      const durHrs = minutesToHours(parseInt(route.travelDuration));
      const durMins = parseInt(route.travelDuration) % 60;
      return durHrs !== 0 ? `${durHrs}h ${durMins}m` : `${durMins.toFixed(2)}m`;
    }
  }, []);
  return (
    <Column>
      <Column
        key={index}
        css={{
          gap: '$8i',
          width: '100%',
        }}>
        <Row css={{ gap: '$8i' }}>
          {inclusion?.routes?.[0]?.departureDate ? (
            <InclusionDate
              value={inclusion?.routes[0].departureDate}
              isAllChecksMarked={isAllChecksMarked}
            />
          ) : null}
          <Column css={{ gap: '$2i' }}>
            {inclusion?.routes && inclusion?.routes?.length > 0
              ? inclusion?.routes?.map((route, inx) => {
                  const departure =
                    route.departureDate + ' ' + route?.departureTime;

                  const departureTime = format(new Date(departure), 'hh:mm a');

                  const arrival = route?.arrivalDate + ' ' + route.arrivalTime;
                  const arrivalTime = format(new Date(arrival), 'hh:mm a');
                  if (!expanded && inx === 1) return null;
                  return (
                    <Column key={inx} css={{ gap: '$1i' }}>
                      <Text
                        css={{
                          color: '$grey700',
                          fontSize: '$13',
                          lineHeight: '$10i',
                          fontWeight: 600,
                        }}>
                        {route.carrierName}
                      </Text>
                      <Text
                        css={{
                          color: '$grey700',
                          fontSize: '$13',
                          lineHeight: '$10i',
                          fontWeight: 400,
                        }}>
                        {`${`${departureTime}`} ${
                          route.departureAirportCode
                        }  → ${route.arrivalAirportCode} ${`${arrivalTime}`}`}
                      </Text>
                      <Row css={{ gap: '$2i', alignItems: 'center' }}>
                        <Text
                          css={{
                            color: '$grey700',
                            fontSize: '$13',
                            lineHeight: '$10i',
                            fontWeight: 400,
                          }}>
                          {(inclusion.routes?.length || 0) > 1
                            ? `Layover, ${calculateDuration(route)}`
                            : `Direct, ${calculateDuration(route)} `}
                        </Text>
                        {!expanded && inx === 0 && (
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
                      </Row>
                    </Column>
                  );
                })
              : !expanded && (
                  <Text
                    css={{
                      color: '$grey600',
                      fontSize: '$13',
                      lineHeight: '$10i',
                      textAlign: 'end',
                      fontWeight: 600,
                      textDecorationLine: 'underline',
                      cursor:'pointer',

                    }}>
                    View More
                  </Text>
                )}
          </Column>
        </Row>
        {expanded && (
          <Column css={{ gap: '$8i' }}>
            {isFirstInclusion && (
              <Fragment>
                <Row css={{ gap: '$4i', alignItems: 'center' }}>
                  {flight?.paid === 1 ? (
                    <Column css={{ gap: '$6i' }}>
                      <StatusPill varient="green" title="Booked" />
                    </Column>
                  ) : (
                    <>
                      {flight?.status === 2 ? (
                        <StatusPill varient="yellow" title="Interim Confirm" />
                      ) : null}
                      {flight?.status === 3 ? (
                        <StatusPill varient="red" title="Reject" />
                      ) : null}
                      {flight?.status !== 2 && flight?.status !== 3 ? (
                        <StatusPill varient="black" title="Yet to book" />
                      ) : null}
                    </>
                  )}
                  <StatusPill varient="blue" title={flight?.trail_cost_id} />
                </Row>
              </Fragment>
            )}
            <Column css={{ gap: '$4i' }}>
              {inclusion.routes &&
              inclusion?.routes?.[0]?.freeCheckInBaggage ? (
                <Row css={{ alignItems: 'center', gap: '$4i' }}>
                  <Luggage css={{ width: 20, height: 20, fill: '$grey500' }} />
                  <Text
                    css={{
                      fontSize: '$13',
                      lineHeight: '$10i',
                      fontWeight: 400,
                      color: '$grey600',
                    }}>
                    {`${inclusion?.routes[0]?.freeCabinBaggage || 0} cabin, ${
                      inclusion?.routes[0]?.freeCheckInBaggage
                    } Checkin`}
                  </Text>
                </Row>
              ) : null}

              <Row css={{ alignItems: 'center', gap: '$4i' }}>
                <InternationAirLines
                  css={{ width: 20, height: 20, fill: '$grey500' }}
                />
                <Text
                  css={{
                    fontSize: '$13',
                    lineHeight: '$10i',
                    fontWeight: 400,
                    color: '$grey600',
                  }}>
                  {flight?.prime && flight.prime.international
                    ? 'International'
                    : 'Domestic'}
                </Text>
              </Row>
              <Row css={{ alignItems: 'center', gap: '$4i' }}>
                {flight?.prime && flight?.prime?.refundable ? (
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
                    color:
                      flight?.prime && flight?.prime?.refundable
                        ? '$green300'
                        : '$red300',
                  }}>
                  {flight?.prime && flight?.prime?.refundable
                    ? 'Refundable'
                    : 'Non Refundable'}
                </Text>
              </Row>
            </Column>
          </Column>
        )}
      </Column>
    </Column>
  );
};

export default withTeam(withSession(Inclusions, FullShimmer), FullShimmer);
