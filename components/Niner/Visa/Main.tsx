import CloseCircle from '@atom-web/icons-16/jsx/CloseCircle';
import { Column, Row } from '@atom-web/micros';

import { CostData, VisaEntity } from '@apis/fetchCostDataByTrailId';
import { CostEntity } from '@apis/fetchNinerChecksQuestions';
import Text from '@components/Text';

import Checks from '../Checks/Main';
import { calculateTotalChecks } from '../utils/calculateTotalChecks';
import { calculateTotalMarkedChecks } from '../utils/calculateTotalMarkedChecks';
import { calculateTotalNotApplicableChecks } from '../utils/calculateTotalNotApplicableChecks';

import Actions from './Actions';
import Inclusions from './Inclusions';

const Visa = ({
  data,
  trailData,
  expandedCardIndex,
  onCardToggle,
  niner,
  ninerRefetch,
}: {
  data: VisaEntity[];
  trailData: CostData;
  expandedCardIndex: number | null;
  onCardToggle: (index: number) => void;
  niner: CostEntity[];
  ninerRefetch: () => void;
}) => {
  const ninerByTrailCostId: { [key: number]: CostEntity[] } = niner.reduce(
    (acc: { [key: number]: CostEntity[] }, item: CostEntity) => {
      const trailCostId = item.trail_cost_id;
      acc[trailCostId] = acc[trailCostId] || [];
      acc[trailCostId].push(item);
      return acc;
    },
    {},
  );
  return (
    <Column css={{ gap: '$6i' }}>
      <Text
        css={{
          fontSize: '$7i',
          color: '$grey700',
          fontWeight: 600,
          lineHeight: '$10i',
        }}>
        Visa
      </Text>
      <Column css={{ gap: '$8i', height: 'auto' }}>
        {data &&
          data.map((visa, index) => {
            const isExpanded = expandedCardIndex === index;
            const ninerData = ninerByTrailCostId[visa.trail_cost_id] || [];
            const totalChecks = calculateTotalChecks(ninerData);
            const totalChecksMarked = calculateTotalMarkedChecks(ninerData);
            const totalNotApplicableCount =
              calculateTotalNotApplicableChecks(ninerData);
            const isAllChecksMarked =
              totalChecks > 0 &&
              totalChecksMarked + totalNotApplicableCount === totalChecks;

            return (
              <Column
                key={index}
                onClick={() => !isExpanded && onCardToggle(index)}
                css={{
                  width: '100%',
                  overflow: 'hidden',
                  border: '1px solid $grey400',
                  borderRadius: '$3',
                  background: '$grey100',
                  cursor: isExpanded ? 'auto' : 'pointer',
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
                      index={index}
                      data={visa}
                      trail={trailData}
                      expanded={isExpanded}
                      isAllChecksMarked={isAllChecksMarked}
                    />
                  </Column>

                  <Column
                    css={{
                      padding: ' $10i $12i',
                      width: '19%',
                      borderRight: '1px solid $grey400',
                    }}>
                    {visa && trailData && (
                      <Actions
                        visaItem={visa}
                        trailData={trailData}
                        expanded={isExpanded}
                      />
                    )}
                  </Column>
                  <Column
                    css={{
                      padding: ' $10i $12i',
                      width: '60%',
                    }}>
                    {totalChecks === 0 ? (
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
                          No Niner checks are available for this visa
                        </Text>
                      </Row>
                    ) : (
                      <Checks
                        expanded={isExpanded}
                        ninerData={ninerData}
                        ninerRefetch={ninerRefetch}
                      />
                    )}
                    {isExpanded && !(totalChecks === 0) && (
                      <Column
                        css={{ cursor: 'pointer', width: 'fit-content' }}
                        onClick={() => onCardToggle(-1)}>
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
            );
          })}
      </Column>
    </Column>
  );
};

export default Visa;
