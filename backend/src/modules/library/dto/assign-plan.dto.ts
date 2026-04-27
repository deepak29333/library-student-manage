import { IsNotEmpty, IsUUID } from 'class-validator';

export class AssignPlanDto {
  @IsUUID('4', { message: 'libraryId must be a valid UUID' })
  @IsNotEmpty({ message: 'libraryId is required' })
  libraryId: string;

  @IsUUID('4', { message: 'billingPlanId must be a valid UUID' })
  @IsNotEmpty({ message: 'billingPlanId is required' })
  billingPlanId: string;
}
