'use strict';

import React, {DetailedHTMLProps} from "react";
import {Sheet, SheetContent, SheetTrigger} from "../../ui/sheet";
import {Button} from "../../ui/button";
import {Menu} from "lucide-react";
import {LateralMenu} from "./LateralMenu";
import {LoginButtonSection} from "../../login/LoginButtonSection";
import {CurrentUser} from "../../../App";
import {useCurrentUser} from "../../users/CurrentUserContext";
export interface HeaderProps extends DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> {
}
export const Header = ({children, ...props}: HeaderProps) => {
    return (<header {...props} className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className="shrink-0 md:hidden"
                >
                    <Menu className="h-5 w-5"/>
                    <span className="sr-only">Toggle navigation menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
                <LateralMenu isInModal={true} />
                <div className="mt-auto">
                    <LoginButtonSection />
                </div>
            </SheetContent>
        </Sheet>
        {children}
    </header>)
}