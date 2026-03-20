import { CheckIn, CheckInUncheckedCreateInput } from "@/@types";

export interface CheckInsRepository {
  create(data: CheckInUncheckedCreateInput): Promise<CheckIn>;
}
