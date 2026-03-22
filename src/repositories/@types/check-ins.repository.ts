import { CheckIn, CheckInUncheckedCreateInput } from "@/@types";

export interface CheckInsRepository {
  findById(id: string): Promise<CheckIn | null>;
  findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null>;
  findManyByUserId(userId: string, page: number): Promise<CheckIn[] | null>;
  countByUserId(userId: string): Promise<number>;
  create(data: CheckInUncheckedCreateInput): Promise<CheckIn>;
  save(checkIn: CheckIn): Promise<CheckIn>;
}
