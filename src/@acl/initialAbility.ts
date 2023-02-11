import {LocalStorageService} from '@services/utils/localStorage.service'

// ** Initial user ability
export const initialAbility = LocalStorageService.get('ability') || []

export const _ = undefined
