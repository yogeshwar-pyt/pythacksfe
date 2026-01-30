import { styled } from '@atom-web/core';
import { Box, Row } from '@atom-web/micros';
import { Session } from 'next-auth';
import { useMemo } from 'react';

import { EmployeeWithRole } from '@apis/fetchUser';
import * as Tabs from '@components/Tabs';
import Text from '@components/Text';

import { Entities } from './Data';

const TabButton = styled('button', {
  all: 'unset',
  boxSizing: 'border-box',
  userSelect: 'none',
  marginRight: '$8i',
  '&::before': {
    boxSizing: 'border-box',
  },
  '&::after': {
    boxSizing: 'border-box',
  },
  // Custom reset?
  display: 'inline-flex',
  flexDirection: 'column',
  flexShrink: 0,
  WebkitTapHighlightColor: 'rgba(0,0,0,0)',
  cursor: 'pointer',
  paddingTop: '$6i',
  paddingBottom: '$6i',
  color: '$grey09',
  '&[data-state="active"]': {
    borderBottomColor: '$blue300',
    borderBottomWidth: 3,
    borderBottomStyle: 'solid',
    color: '$colors$blue300',
    fontWeight: '600px',
  },
  '&:focus': {
    borderBottomColor: '$blue300',
    borderBottomWidth: 3,
    borderBottomStyle: 'solid',
    color: '#0084ff',
    fontWeight: 600,
  },
  '@hover': {
    '&:hover': {
      color: '$blue300',
    },
  },
});

type AddTrailMenuProps = {
  session: Session;
  loginUser: EmployeeWithRole;
  onTabChange: (value: React.SetStateAction<Entities>) => void;
  selectedTab: string;
  showFlight: boolean;
  showHotel: boolean;
  showActivity: boolean;
  showTrasnfer: boolean;
  showTrain: boolean;
  showFerry: boolean;
  showPass: boolean;
  showVisa: boolean;
  showInsurance: boolean;
  showCustom: boolean;
  showRentalCar: boolean;
};

const Menu = ({
  onTabChange,
  selectedTab,
  showFlight,
  showHotel,
  showActivity,
  showTrasnfer,
  showTrain,
  showFerry,
  showPass,
  showVisa,
  showInsurance,
  showCustom,
  showRentalCar,
}: AddTrailMenuProps) => {
  const menuList = useMemo(
    () => [
      // {
      //   label: 'Status',
      //   value: 'stats',
      //   show: true,
      // },
      {
        label: 'Gen Checks',
        value: 'generic_checks',
        show: true,
      },
      {
        label: 'Flight',
        value: 'flight',
        show: showFlight,
      },
      {
        label: 'Hotel',
        value: 'hotel',
        show: showHotel,
      },
      {
        label: 'Activity',
        value: 'activity',
        show: showActivity,
      },
      {
        label: 'Train',
        value: 'train',
        show: showTrain,
      },
      {
        label: 'Tranfers',
        value: 'transfer',
        show: showTrasnfer,
      },
      {
        label: 'Insurance',
        value: 'insurance',
        show: showInsurance,
      },
      {
        label: 'Ferry',
        value: 'ferry',
        show: showFerry,
      },
      {
        label: 'Visa',
        value: 'visa',
        show: showVisa,
      },
      {
        label: 'Pass',
        value: 'pass',
        show: showPass,
      },
      {
        label: 'Custom',
        value: 'custom',
        show: showCustom,
      },
      {
        label: 'Rental Car',
        value: 'rental-car',
        show: showRentalCar,
      },
    ],
    [
      showActivity,
      showCustom,
      showFerry,
      showFlight,
      showHotel,
      showInsurance,
      showPass,
      showRentalCar,
      showTrain,
      showTrasnfer,
      showVisa,
    ],
  );

  return (
    <Box
      style={{
        justifyContent: 'flex-start',
      }}>
      <Tabs.Root
        onValueChange={(key: string) => {
          onTabChange(key as Entities);
        }}
        defaultValue={selectedTab || 'stats'}>
        <Tabs.List
          css={{
            overflow: 'hidden',
          }}>
          {menuList
            .filter(menu => menu.show)
            .map((menu, i) => {
              return (
                <Tabs.Trigger value={menu.value} asChild key={i}>
                  <TabButton
                    css={{
                      color:
                        selectedTab === menu.value
                          ? '$colors$grey700'
                          : '$grey500',
                      fontWeight: 500,
                    }}>
                    <Row
                      key={i}
                      align="center"
                      css={{
                        gap: '$2i',
                      }}>
                      <Text
                        css={{
                          color:
                            selectedTab === menu.value
                              ? '$colors$blue300'
                              : '$grey600',
                          fontWeight: 400,
                          lineHeight: '$10i',
                          textTransform: 'capitalize',
                          fontSize: '$13',
                        }}>
                        {menu.label}{' '}
                      </Text>
                    </Row>
                  </TabButton>
                </Tabs.Trigger>
              );
            })}
        </Tabs.List>
      </Tabs.Root>
    </Box>
  );
};

export default Menu;
