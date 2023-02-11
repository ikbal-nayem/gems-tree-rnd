export interface IAuthInfo {
  accessToken: string;
  refreshToken: string;
  id?: string;
}

export interface IUserRole {
  id: string;
  titleEn: string;
  titleBn: string;
  roleCode: string;
  isDefault: boolean;
}

export interface IOrgPostDTO {
  id: string;
  nameEn: string;
  nameBn: string;
}

export interface IemployeeOrgPost {
  id: string;
  post: IOrgPostDTO;
  organization: IOrgPostDTO;
}

export interface IUserInfo {
  id: string;
  primaryEmail: string;
  primaryMobile: string;
  employeeOrgPost: IemployeeOrgPost;
  post: IOrgPostDTO;
  organization: IOrgPostDTO;
  userName: string;
  nidSmart: string;
  isLocked: boolean;
  isActive: boolean;
  organizationId: string;
  dateOfBirth: number;
  nameEn: string;
  nameBn: string;
  roles: IUserRole[];
  imageUrl: string;
  nidOld: string;
}
