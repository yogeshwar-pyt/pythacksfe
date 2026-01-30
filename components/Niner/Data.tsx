import { Box, Column, Row } from '@atom-web/micros';
import { useAtom, useAtomValue } from 'jotai';
import sortBy from 'lodash.sortby';
import { Session } from 'next-auth';
import React, {
  Fragment,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useFetchNinerChecksQuestions } from '@actions/useFetchNinerChecksQuestions';
import { useFetchUploadByTrail } from '@actions/useFetchUploadByTrail';
import {
  ActivityEntity,
  CustomEntity,
  FerryEntity,
  FlightEntity,
  InsuranceEntity,
  PassEntity,
  RentalCarEntity,
  StayEntity,
  TrainEntity,
  TransferEntity,
  VisaEntity,
} from '@apis/fetchCostDataByTrailId';
import { CostEntity } from '@apis/fetchNinerChecksQuestions';
import { EmployeeWithRole } from '@apis/fetchUser';
import StyledButton from '@components/Button';
import NinerShimmer from '@components/Skeleton/NinerShimmer';
import QuickActionsShimmer from '@components/Skeleton/QuickActionsShimmer';
import Text from '@components/Text';
import usePermissions from '@hooks/usePermissions';
import {
  isNinerLoadingAtom,
  ninerPercentageAtom,
  trailInfoAtom,
} from '@store/costsheetAtom';

import CostSheetQuickAction from '../Header/CostSheetQuickAction';
import OtherDetails from '../Header/OtherDetails';

import Activities from './Activities/Main';
import Custom from './Custom/Main';
import Ferry from './Ferry/Main';
import Flights from './Flights/Main';
import FollowUp, { FollowUpRefType } from './FollowUp/Main';
import Generics from './Generics/Main';
import Hotels from './Hotels/Main';
import Insurance from './Insurance/Main';
import Menu from './Menu';
import NinerTicket from './NinerTicket';
import Pass from './Pass/Main';
import QuickActions from './QuickActions/Main';
import RentalCar from './RentalCar/Main';
import Train from './Train/Main';
import Transfer from './Transfer/Main';
import { useCardExpand } from './utils/useCardExpand';
import useNinerChecksStats from './utils/useNinerCheckStats';
import Visa from './Visa/Main';

type NinerProps = {
  session: Session;
  loginUser: EmployeeWithRole;
  loginUserReportees: EmployeeWithRole[];
  trailId: number;
};

export type Entities =
  | 'flight'
  | 'hotel'
  | 'activity'
  | 'custom'
  | 'train'
  | 'transfer'
  | 'ferry'
  | 'pass'
  | 'insurance'
  | 'visa'
  | 'loss'
  | 'surprise'
  | 'rental-car'
  | 'generic_checks'
  | 'stats';

const Data = ({ session, loginUser, trailId }: NinerProps) => {
  const can = usePermissions();
  const [data] = useAtomValue(trailInfoAtom);
  const flightRef = useRef<null | HTMLDivElement>(null);
  const hotelRef = useRef<null | HTMLDivElement>(null);
  const activityRef = useRef<null | HTMLDivElement>(null);
  const transferRef = useRef<null | HTMLDivElement>(null);
  const trainRef = useRef<null | HTMLDivElement>(null);
  const passRef = useRef<null | HTMLDivElement>(null);
  const genericRef = useRef<null | HTMLDivElement>(null);
  const insuranceRef = useRef<null | HTMLDivElement>(null);
  const ferryRef = useRef<null | HTMLDivElement>(null);
  const visaRef = useRef<null | HTMLDivElement>(null);
  const surpriseRef = useRef<null | HTMLDivElement>(null);
  const customRef = useRef<null | HTMLDivElement>(null);
  const rentalCarRef = useRef<null | HTMLDivElement>(null);
  const lossRef = useRef<null | HTMLDivElement>(null);
  const statsRef = useRef<null | HTMLDivElement>(null);
  const followupRef = useRef<null | FollowUpRefType>(null);
  const [entityTab, setEntityTab] = useState<Entities>('stats');
  const [, setPercentage] = useAtom(ninerPercentageAtom);
  const [, setNinerLoading] = useAtom(isNinerLoadingAtom);

  const {
    genericCheckCard,
    flightExpandedCardIndex,
    hotelExpandedCardIndex,
    activityExpandedCardIndex,
    ferryExpandedCardIndex,
    visaExpandedCardIndex,
    transferExpandedCardIndex,
    trainExpandedCardIndex,
    rentalCarExpandedCardIndex,
    passExpandedCardIndex,
    insuranceExpandedCardIndex,
    customExpandedCardIndex,
    handleGenericCheckCardToggle,
    handleGenericCheckCardCloseToggle,
    handleFlightCardToggle,
    handleHotelCardToggle,
    handleActivityCardToggle,
    handleFerryCardToggle,
    handleVisaCardToggle,
    handleTransferCardToggle,
    handleTrainCardToggle,
    handleRentalCarCardToggle,
    handleAllCardCollapse,
    handlePassCardToggle,
    handleInsuranceCardToggle,
    handleCustomCardToggle,
  } = useCardExpand();

  const costDataByTrailRes = useMemo(() => {
    if (data) {
      return data;
    }
  }, [data]);

  const {
    data: ninerChecks,
    isLoading: isNinerLoading,
    refetch,
  } = useFetchNinerChecksQuestions({
    authToken: session.accessToken,
    trail_id: trailId,
  });

  const ninerResponse = useMemo(() => ninerChecks?.data, [ninerChecks?.data]);

  const { data: documentsData, isLoading: isDocLoading } =
    useFetchUploadByTrail({
      authToken: session.accessToken,
      trail_id: trailId,
      copy: 0,
    });

  const docs = useMemo(
    () => documentsData?.data?.invoices,
    [documentsData?.data?.invoices],
  );

  const flightsEntity: FlightEntity[] = useMemo(() => {
    const flightData = data?.current_costs
      ? (data.current_costs.filter(item => item.type === 1) as FlightEntity[])
      : [];
    return sortBy(flightData, ['date']);
  }, [data?.current_costs]);

  const hotelEntity: StayEntity[] = useMemo(() => {
    const hotelData = data?.current_costs
      ? (data.current_costs.filter(item => item.type === 2) as StayEntity[])
      : [];
    return sortBy(hotelData, ['date']);
  }, [data?.current_costs]);

  const activityEntity: ActivityEntity[] = useMemo(() => {
    const activityData = data?.current_costs
      ? (data.current_costs.filter(item => item.type === 3) as ActivityEntity[])
      : [];
    return sortBy(activityData, ['date']);
  }, [data?.current_costs]);

  const transferEnity: TransferEntity[] = useMemo(() => {
    const transferData = data?.current_costs
      ? (data.current_costs.filter(item => item.type === 4) as TransferEntity[])
      : [];
    return sortBy(transferData, ['date']);
  }, [data?.current_costs]);

  const trainEntity: TrainEntity[] = useMemo(() => {
    const trainData = data?.current_costs
      ? (data.current_costs.filter(item => item.type === 5) as TrainEntity[])
      : [];
    return sortBy(trainData, ['date']);
  }, [data?.current_costs]);

  const ferryEntity: FerryEntity[] = useMemo(() => {
    const ferryData = data?.current_costs
      ? (data.current_costs.filter(item => item.type === 6) as FerryEntity[])
      : [];
    return sortBy(ferryData, ['date']);
  }, [data?.current_costs]);

  const passEntity: PassEntity[] = useMemo(() => {
    const passData = data?.current_costs
      ? (data.current_costs.filter(item => item.type === 8) as PassEntity[])
      : [];
    return sortBy(passData, ['date']);
  }, [data?.current_costs]);

  const visaEntity: VisaEntity[] = useMemo(() => {
    const visaData = data?.current_costs
      ? (data.current_costs.filter(item => item.type === 9) as VisaEntity[])
      : [];
    return sortBy(visaData, ['date']);
  }, [data?.current_costs]);

  const insuranceEntity: InsuranceEntity[] = useMemo(() => {
    const insuranceData = data?.current_costs
      ? (data.current_costs.filter(
          item => item.type === 10,
        ) as InsuranceEntity[])
      : [];
    return sortBy(insuranceData, ['date']);
  }, [data?.current_costs]);

  const customEntity: CustomEntity[] = useMemo(() => {
    const customerData = data?.current_costs
      ? (data.current_costs.filter(item => item.type === 29) as CustomEntity[])
      : [];
    return sortBy(customerData, ['date']);
  }, [data?.current_costs]);

  const rentalCarEntity: RentalCarEntity[] = useMemo(() => {
    const rentalData = data?.current_costs
      ? (data.current_costs.filter(
          item => item.type === 7,
        ) as RentalCarEntity[])
      : [];
    return sortBy(rentalData, ['date']);
  }, [data?.current_costs]);

  useLayoutEffect(() => {
    if (entityTab === 'flight') {
      flightRef?.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
    if (entityTab === 'hotel') {
      hotelRef?.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
    if (entityTab === 'activity') {
      activityRef?.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
    if (entityTab === 'ferry') {
      ferryRef?.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
    if (entityTab === 'loss') {
      lossRef?.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
    if (entityTab === 'train') {
      trainRef?.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
    if (entityTab === 'transfer') {
      transferRef?.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
    if (entityTab === 'insurance') {
      insuranceRef?.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
    if (entityTab === 'visa') {
      visaRef?.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
    if (entityTab === 'pass') {
      passRef?.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
    if (entityTab === 'custom') {
      customRef?.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
    if (entityTab === 'rental-car') {
      rentalCarRef?.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
    if (entityTab === 'surprise') {
      surpriseRef?.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
    if (entityTab === 'generic_checks') {
      genericRef?.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
    if (entityTab === 'stats') {
      statsRef?.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, [entityTab]);

  const ninerStats = useNinerChecksStats(ninerResponse);
  useEffect(() => {
    if (ninerStats) {
      const { percentage } = ninerStats;
      setPercentage(percentage);
    }
  }, [ninerStats, setPercentage]);
  useEffect(() => {
    setNinerLoading(isNinerLoading);
  }, [isNinerLoading, setNinerLoading]);

  useEffect(() => {
    if (ninerStats) {
      const { percentage } = ninerStats;
      setPercentage(percentage);
    }
  }, [ninerStats, setPercentage]);
  const ninerEntitiesByType: { [key: number]: CostEntity[] } = useMemo(() => {
    const ninerData = ninerResponse?.cost || [];

    return ninerData.reduce(
      (filteredEntities: { [key: number]: CostEntity[] }, item: CostEntity) => {
        const entityType = item.type;
        if (!filteredEntities[entityType]) {
          filteredEntities[entityType] = [];
        }
        filteredEntities[entityType].push(item);
        return filteredEntities;
      },
      {},
    );
  }, [ninerResponse?.cost]);
  const flightNiner: CostEntity[] = ninerEntitiesByType[1] || [];
  const hotelNiner: CostEntity[] = ninerEntitiesByType[2] || [];
  const activityNiner: CostEntity[] = ninerEntitiesByType[3] || [];
  const transferNiner: CostEntity[] = ninerEntitiesByType[4] || [];
  const trainNiner: CostEntity[] = ninerEntitiesByType[5] || [];
  const ferryNiner: CostEntity[] = ninerEntitiesByType[6] || [];
  const passNiner: CostEntity[] = ninerEntitiesByType[8] || [];
  const visaNiner: CostEntity[] = ninerEntitiesByType[9] || [];
  const insuranceNiner: CostEntity[] = ninerEntitiesByType[10] || [];
  const customNiner: CostEntity[] = ninerEntitiesByType[29] || [];
  const rentalCarNiner: CostEntity[] = ninerEntitiesByType[7] || [];

  if (!data || isNinerLoading) {
    return <NinerShimmer />;
  }

  return (
    <Fragment>
      {data ? (
        <Column
          css={{ background: '$grey200', overflow: 'hidden', height: '100%' }}>
          <Row
            css={{
              padding: '0 $12i',
              background: '$grey100',
              borderBottom: '1px solid $grey400',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '$10i',
            }}>
            <Menu
              onTabChange={value => setEntityTab(value)}
              session={session}
              loginUser={loginUser}
              selectedTab={entityTab}
              showFlight={flightsEntity.length !== 0}
              showHotel={hotelEntity.length !== 0}
              showActivity={activityEntity.length !== 0}
              showTrasnfer={transferEnity.length !== 0}
              showTrain={trainEntity.length !== 0}
              showFerry={ferryEntity.length !== 0}
              showPass={passEntity.length !== 0}
              showVisa={visaEntity.length !== 0}
              showInsurance={insuranceEntity.length !== 0}
              showCustom={customEntity.length !== 0}
              showRentalCar={rentalCarEntity.length !== 0}
            />
            <Row css={{ alignItems: 'center' }}>
              {data ? <OtherDetails trailData={data} /> : null}
              <Row css={{ alignItems: 'center', gap: '$4i' }}>
                {can('view:ao:dashboard') ? (
                  <StyledButton
                    onClick={() => followupRef?.current?.open()}
                    primary
                    css={{
                      padding: '$3i $6i',
                      width: 'fit-content',
                    }}>
                    <Text
                      css={{
                        fontSize: '$13',
                        color: '$grey100',
                        fontWeight: '500',
                        lineHeight: '$10i',
                      }}>
                      Add Followup
                    </Text>
                  </StyledButton>
                ) : null}
                {isDocLoading ? (
                  <QuickActionsShimmer />
                ) : (
                  <QuickActions
                    loginUser={loginUser}
                    session={session}
                    trailData={costDataByTrailRes}
                    docs={docs}
                    isDocLoading={isDocLoading}
                    ninerRefetch={refetch}
                    niner={ninerResponse?.trail}
                  />
                )}
              </Row>
            </Row>
          </Row>

          <Column css={{ gap: '$10i', overflow: 'scroll' }}>
            <Column
              css={{ padding: ' 0 $10i', paddingTop: '$10i' }}
              onClick={handleAllCardCollapse}>
              <Box ref={statsRef} />
              <Row css={{ gap: '$10i', alignItems: 'center' }}>
                {/* <NinerStats ninerCheckPercentage={percentage} /> */}
                {ninerResponse && ninerResponse?.trail ? (
                  <NinerTicket niner={ninerResponse?.trail} />
                ) : null}
              </Row>
            </Column>
            {costDataByTrailRes ? (
              <Column css={{ padding: ' 0 $10i' }}>
                <Box ref={genericRef} />
                <Generics
                  trailData={costDataByTrailRes}
                  expandedCard={genericCheckCard}
                  onCardToggle={handleGenericCheckCardToggle}
                  onCardCloseToggle={handleGenericCheckCardCloseToggle}
                  niner={ninerResponse?.trail}
                  ninerRefetch={refetch}
                />
              </Column>
            ) : null}
            {flightsEntity && flightsEntity?.length && costDataByTrailRes ? (
              <Column css={{ padding: ' 0 $10i' }}>
                <Box ref={flightRef} />
                <Flights
                  data={flightsEntity}
                  trailData={costDataByTrailRes}
                  expandedCardIndex={flightExpandedCardIndex}
                  onCardToggle={handleFlightCardToggle}
                  niner={flightNiner}
                  ninerRefetch={refetch}
                />
              </Column>
            ) : null}
            {hotelEntity && hotelEntity.length && costDataByTrailRes ? (
              <Column css={{ padding: ' 0 $10i' }}>
                <Box ref={hotelRef} />
                <Hotels
                  data={hotelEntity}
                  trailData={costDataByTrailRes}
                  expandedCardIndex={hotelExpandedCardIndex}
                  onCardToggle={handleHotelCardToggle}
                  niner={hotelNiner}
                  ninerRefetch={refetch}
                />
              </Column>
            ) : null}
            {activityEntity && activityEntity.length && costDataByTrailRes ? (
              <Column css={{ padding: ' 0 $10i' }}>
                <Box ref={activityRef} />
                <Activities
                  data={activityEntity}
                  trailData={costDataByTrailRes}
                  expandedCardIndex={activityExpandedCardIndex}
                  onCardToggle={handleActivityCardToggle}
                  niner={activityNiner}
                  ninerRefetch={refetch}
                />
              </Column>
            ) : null}
            {transferEnity && transferEnity.length && costDataByTrailRes ? (
              <Column css={{ padding: ' 0 $10i' }}>
                <Box ref={transferRef} />
                <Transfer
                  data={transferEnity}
                  trailData={costDataByTrailRes}
                  expandedCardIndex={transferExpandedCardIndex}
                  onCardToggle={handleTransferCardToggle}
                  niner={transferNiner}
                  ninerRefetch={refetch}
                />
              </Column>
            ) : null}
            {trainEntity && trainEntity.length && costDataByTrailRes ? (
              <Column css={{ padding: ' 0 $10i' }}>
                <Box ref={trainRef} />
                <Train
                  data={trainEntity}
                  trailData={costDataByTrailRes}
                  expandedCardIndex={trainExpandedCardIndex}
                  onCardToggle={handleTrainCardToggle}
                  niner={trainNiner}
                  ninerRefetch={refetch}
                />
              </Column>
            ) : null}
            {ferryEntity && ferryEntity.length && costDataByTrailRes ? (
              <Column css={{ padding: ' 0 $10i' }}>
                <Box ref={ferryRef} />
                <Ferry
                  data={ferryEntity}
                  trailData={costDataByTrailRes}
                  expandedCardIndex={ferryExpandedCardIndex}
                  onCardToggle={handleFerryCardToggle}
                  niner={ferryNiner}
                  ninerRefetch={refetch}
                />
              </Column>
            ) : null}
            {rentalCarEntity && rentalCarEntity.length && costDataByTrailRes ? (
              <Column css={{ padding: ' 0 $10i' }}>
                <Box ref={rentalCarRef} />
                <RentalCar
                  data={rentalCarEntity}
                  trailData={costDataByTrailRes}
                  expandedCardIndex={rentalCarExpandedCardIndex}
                  onCardToggle={handleRentalCarCardToggle}
                  niner={rentalCarNiner}
                  ninerRefetch={refetch}
                />
              </Column>
            ) : null}
            {visaEntity && visaEntity.length && costDataByTrailRes ? (
              <Column css={{ padding: ' 0 $10i' }}>
                <Box ref={visaRef} />
                <Visa
                  data={visaEntity}
                  trailData={costDataByTrailRes}
                  expandedCardIndex={visaExpandedCardIndex}
                  onCardToggle={handleVisaCardToggle}
                  niner={visaNiner}
                  ninerRefetch={refetch}
                />
              </Column>
            ) : null}
            {passEntity && passEntity.length && costDataByTrailRes ? (
              <Column css={{ padding: ' 0 $10i' }}>
                <Box ref={passRef} />
                <Pass
                  data={passEntity}
                  trailData={costDataByTrailRes}
                  expandedCardIndex={passExpandedCardIndex}
                  onCardToggle={handlePassCardToggle}
                  niner={passNiner}
                  ninerRefetch={refetch}
                />
              </Column>
            ) : null}
            {insuranceEntity && insuranceEntity.length && costDataByTrailRes ? (
              <Column css={{ padding: ' 0 $10i' }}>
                <Box ref={insuranceRef} />
                <Insurance
                  data={insuranceEntity}
                  trailData={costDataByTrailRes}
                  expandedCardIndex={insuranceExpandedCardIndex}
                  onCardToggle={handleInsuranceCardToggle}
                  niner={insuranceNiner}
                  ninerRefetch={refetch}
                />
              </Column>
            ) : null}
            {customEntity && customEntity.length && costDataByTrailRes ? (
              <Column css={{ padding: ' 0 $10i' }}>
                <Box ref={customRef} />
                <Custom
                  data={customEntity}
                  trailData={costDataByTrailRes}
                  expandedCardIndex={customExpandedCardIndex}
                  onCardToggle={handleCustomCardToggle}
                  niner={customNiner}
                  ninerRefetch={refetch}
                />
              </Column>
            ) : null}
            <Column>
              <Box css={{ height: 60 }} />
            </Column>
            <FollowUp
              ref={followupRef}
              trailId={costDataByTrailRes?.trail_id || trailId}
              customer={costDataByTrailRes?.customer}
              onUpdate={() => null}
            />
          </Column>
        </Column>
      ) : null}

      {data ? (
        <Column
          css={{
            justifyContent: 'center',
            alignItems: 'center',
            position: 'fixed',
            bottom: 30,
            left: '45%',
          }}>
          <CostSheetQuickAction trailData={data} />
        </Column>
      ) : null}
    </Fragment>
  );
};

export default Data;
