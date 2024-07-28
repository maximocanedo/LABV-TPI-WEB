'use strict';

export type Saveable = {
    _lastOfflineSaved?: Date;
}
export type Deletable = {
    active: boolean;
}
export type Identifiable = {
    id: number;
}
export type sex = 'M' | 'F';
export type address = string;
export type Localty = string;
export type Province = string;
export type CommonException = {
    message: string;
    description: string;
    path: string;
}