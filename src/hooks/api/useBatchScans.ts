import { useMutation, useQueryClient } from "@tanstack/react-query";
import { initiateBatchScan } from "../../services/scanService";
import type { BatchScanRequestDto, BatchScanResponseDto } from "../../types/batch";

export const useInitiateBatchScan = () => {
    const qc = useQueryClient();

    return useMutation<BatchScanResponseDto, Error, BatchScanRequestDto>({
        mutationFn: (data) => initiateBatchScan(data),
        onSuccess: () => {
            // Invalidate relevant queries to refresh lists
            qc.invalidateQueries({ queryKey: ["projects"] });
            qc.invalidateQueries({ queryKey: ["my-projects"] });
            qc.invalidateQueries({ queryKey: ["contract-scans"] });
            qc.invalidateQueries({ queryKey: ["application-scans"] });
        },
    });
};
