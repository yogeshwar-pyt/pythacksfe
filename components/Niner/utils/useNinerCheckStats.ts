import { useEffect, useState } from 'react';

import { NinerChecks } from '@apis/fetchNinerChecksQuestions';

export interface NinerChecksStats {
  totalChecks: number;
  checkedChecks: number;
  notApplicableChecks: number;
  percentage: number;
}

const useNinerChecksStats = (
  ninerChecksData: NinerChecks | null | undefined,
): NinerChecksStats | null => {
  const [stats, setStats] = useState<NinerChecksStats | null>(null);

  useEffect(() => {
    if (ninerChecksData) {
      let totalChecks = 0;
      let checkedChecks = 0;
      let notApplicableChecks = 0;

      if (ninerChecksData.cost) {
        ninerChecksData.cost.forEach(entity => {
          if (entity.niner_checks) {
            totalChecks += entity.niner_checks.length;
            checkedChecks += entity.niner_checks.filter(
              check => check?.checked === 1 || check?.not_applicable === 1,
            ).length;
            notApplicableChecks += entity.niner_checks.filter(
              check => check?.not_applicable === 1,
            ).length;
          }
          if (entity.remaining) {
            totalChecks += entity.remaining.length;
          }
        });
      }

      if (ninerChecksData.trail) {
        if (ninerChecksData.trail.niner_checks) {
          totalChecks += ninerChecksData.trail.niner_checks.length;
          checkedChecks += ninerChecksData.trail.niner_checks.filter(
            check => check?.checked === 1 || check?.not_applicable === 1,
          ).length;
          notApplicableChecks += ninerChecksData.trail.niner_checks.filter(
            check => check?.not_applicable === 1,
          ).length;
        }
        if (ninerChecksData.trail.remaining) {
          totalChecks += ninerChecksData.trail.remaining.length;
        }
      }

      const percentage =
        totalChecks === 0 ? 0 : Math.round((checkedChecks / totalChecks) * 100);

      setStats({ totalChecks, checkedChecks, notApplicableChecks, percentage });
    } else {
      setStats(null);
    }
  }, [ninerChecksData]);

  return stats;
};

export default useNinerChecksStats;
