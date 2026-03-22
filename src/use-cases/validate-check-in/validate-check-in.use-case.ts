import { CheckIn } from "@/@types";
import { CheckInsRepository } from "@/repositories";
import { ResourceNotFoundError } from "../errors";

interface ValidateCheckInUseCaseRequest {
  checkInId: string;
}

interface ValidateCheckInUseCaseResponse {
  checkIn: CheckIn;
}

export class ValidateCheckInUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    checkInId,
  }: ValidateCheckInUseCaseRequest): Promise<ValidateCheckInUseCaseResponse> {
    const checkIn = await this.checkInsRepository.findById(checkInId);

    if (!checkIn) {
      throw new ResourceNotFoundError();
    }

    checkIn.validated_at = new Date();

    const newCheckIn = await this.checkInsRepository.save(checkIn);

    return {
      checkIn: newCheckIn,
    };
  }
}
