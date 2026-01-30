import CloseCircle from '@atom-web/icons-16/jsx/CloseCircle';
import { Column, Row } from '@atom-web/micros';

import { CostData } from '@apis/fetchCostDataByTrailId';
import { Trail } from '@apis/fetchNinerChecksQuestions';
import Text from '@components/Text';

import Actions from './Actions';
import Checks from './Checks/Main';
import Inclusions from './Inclusions';

const Generics = ({
  trailData,
  expandedCard,
  onCardToggle,
  onCardCloseToggle,
  niner,
  ninerRefetch,
}: {
  trailData: CostData;
  expandedCard: boolean;
  onCardToggle: () => void;
  onCardCloseToggle: () => void;
  niner?: Trail;
  ninerRefetch: () => void;
}) => {
  const ninerChecks = niner?.niner_checks ?? [];
  const totalChecksMarked = ninerChecks.reduce((total, item) => {
    return total + (item.checked === 1 || item.not_applicable === 1 ? 1 : 0);
  }, 0);

  const remainingChecksLength = niner?.remaining?.length ?? 0;
  const allChecksLength = ninerChecks.length + remainingChecksLength;
  const isAllChecksMarked =
    allChecksLength > 0 && totalChecksMarked === allChecksLength;

  return (
    <Column css={{ gap: '$6i' }}>
      <Text
        css={{
          fontSize: '$7i',
          color: '$grey700',
          fontWeight: 600,
          lineHeight: '$10i',
        }}>
        Generic Checks
      </Text>
      <Column css={{ gap: '$8i', height: 'auto' }}>
        <Column
          onClick={() => !expandedCard && onCardToggle()}
          css={{
            width: '100%',
            overflow: 'hidden',
            border: '1px solid $grey400',
            borderRadius: '$3',
            background: '$grey100',
            cursor: expandedCard ? 'auto' : 'pointer',
            '&:hover': {
              boxShadow:
                '0px 4px 8px -2px rgba(16, 24, 40, 0.10), 0px 2px 4px -2px rgba(16, 24, 40, 0.06)',
            },
          }}>
          <Row
            css={{
              width: '100%',
              height: '100%',
            }}>
            <Column
              css={{
                borderRight: '1px solid $grey400',
                width: '36%',
                padding: ' $10i $12i',
                gap: '$8i',
              }}>
              <Inclusions
                isAllChecksMarked={isAllChecksMarked}
                trailData={trailData}
              />
            </Column>

            <Column
              css={{
                padding: ' $10i $12i',
                width: '19%',
                borderRight: '1px solid $grey400',
              }}>
              {trailData && (
                <Actions trailData={trailData} expanded={expandedCard} />
              )}
            </Column>
            <Column
              css={{
                padding: ' $10i $12i',
                width: '60%',
              }}>
              {allChecksLength === 0 ? (
                <Row
                  css={{
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    height: '100%',
                    width: '100%',
                    gap: '$3i',
                  }}>
                  <CloseCircle fill="red" />
                  <Text
                    css={{
                      fontSize: '$6i',
                      color: '$red300',
                      fontWeight: 400,
                      lineHeight: '$10i',
                    }}>
                    No Niner checks are available for this generic
                  </Text>
                </Row>
              ) : (
                <Checks
                  expanded={expandedCard}
                  ninerData={niner}
                  ninerRefetch={ninerRefetch}
                />
              )}
              {expandedCard && !(allChecksLength === 0) && (
                <Column
                  css={{ cursor: 'pointer', width: 'fit-content' }}
                  onClick={() => onCardCloseToggle()}>
                  <Text
                    css={{
                      fontSize: '$13',
                      color: '$blue300',
                      fontWeight: '600',
                      lineHeight: '$10i',
                      textDecorationLine: 'underline',
                    }}>
                    View Less
                  </Text>
                </Column>
              )}
            </Column>
          </Row>
        </Column>
      </Column>
    </Column>
  );
};

export default Generics;
