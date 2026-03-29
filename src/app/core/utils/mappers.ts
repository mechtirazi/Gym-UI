import { GymDto, ProductDto, UserVm, NotificationDto } from '../models/api.models';

export interface GymVm extends Omit<GymDto, 'adress'> {
  address: string;
}

export interface ProductVm extends ProductDto {}
export interface NotificationVm extends NotificationDto {}

export function mapUserToVm(dto: any): UserVm {
  if (!dto) return dto;
  return {
    ...dto,
  };
}

export function mapGymDtoToVm(dto: any): GymVm {
  if (!dto) return dto as any;
  const { adress, ...rest } = dto;
  return {
    ...rest,
    address: adress || '',
    owner: dto.owner ? mapUserToVm(dto.owner) : undefined
  };
}

export function mapProductDtoToVm(dto: any): ProductVm {
  if (!dto) return dto as any;
  return { ...dto };
}

export function mapNotificationDtoToVm(dto: any): NotificationVm {
  if (!dto) return dto as any;
  return {
    ...dto,
    user: dto.user ? mapUserToVm(dto.user) : undefined
  };
}
