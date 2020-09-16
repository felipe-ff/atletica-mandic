import { Role } from '../enums/role.enum';
import { Gender } from '../enums/gender.enum';

export interface User {
    id?: string,
    name?: string,
    email?: string,
    password?: string,
    categories?: string[],
    teaches?: string,
    role?: Role,
    gender?: Gender,
    profileImageUrl?: string,
    registerCode?: string,
    schoolClass?: string,
    verified?: boolean;
    notificationToken?: string;
}