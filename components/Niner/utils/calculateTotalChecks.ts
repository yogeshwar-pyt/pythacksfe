import { CostEntity } from '@apis/fetchNinerChecksQuestions';

export const calculateTotalChecks = (
  ninerData: CostEntity[] | undefined,
): number => {
  return (
    ninerData?.reduce((acc, data) => {
      const ninerChecksLength = data?.niner_checks?.length ?? 0;
      const remainingLength = data?.remaining?.length ?? 0;
      return acc + ninerChecksLength + remainingLength;
    }, 0) ?? 0
  );
};
