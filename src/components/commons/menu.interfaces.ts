'use strict';

export type MenuOption = {
    icon?: any;
    label: string;
    handler?: () => void;
    url?: string;
    nav?: string;
    condition?: boolean;
    copy?: string;
    submenu?: MenuOption[];
};