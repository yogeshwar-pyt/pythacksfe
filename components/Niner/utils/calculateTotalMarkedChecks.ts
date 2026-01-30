import { CostEntity } from '@apis/fetchNinerChecksQuestions';

export const calculateTotalMarkedChecks = (
  ninerData: CostEntity[] | undefined,
): number => {
  return (
    ninerData?.reduce((acc, data) => {
      const ninerChecksMarked =
        data?.niner_checks?.filter(item => item.checked === 1).length ?? 0;
      return acc + ninerChecksMarked;
    }, 0) ?? 0
  );
};
