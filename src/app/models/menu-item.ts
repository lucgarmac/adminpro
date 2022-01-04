export interface MenuItem {
    title: string;
    icon: string;
    children: MenuItemChild[];
}

export interface MenuItemChild {
    title: string;
    path: string;
}