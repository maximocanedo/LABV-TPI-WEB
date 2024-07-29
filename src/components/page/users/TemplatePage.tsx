'use strict';

import {Header} from "../commons/Header";
import {Search} from "lucide-react";
import {Input} from "../../ui/input";
import {PageContent} from "../commons/PageContent";
import {Button} from "../../ui/button";
import React from "react";
import {CurrentUser} from "../../../App";

export interface TemplatePageProps {
    me: CurrentUser;
    clearCurrentUser: () => void;
}
export const TemplatePage = ({me, clearCurrentUser, ...props}: TemplatePageProps) => {

    return (<>
        <Header {...{me, clearCurrentUser}}>
            <div className="w-full flex-1">
                <form>
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"/>
                        <Input
                            type="search"
                            placeholder="Search products..."
                            className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                        />
                    </div>
                </form>
            </div>
        </Header>
        <PageContent>
            <div className="flex items-center">
                <h1 className="text-lg font-semibold md:text-2xl">Inventory</h1>
            </div>
            <div
                className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm"
                x-chunk="dashboard-02-chunk-1"
            >
                <div className="flex flex-col items-center gap-1 text-center">
                    <h3 className="text-2xl font-bold tracking-tight">
                        You have no products
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        You can start selling as soon as you add a product.
                    </p>
                    <Button className="mt-4">Add Product</Button>
                </div>
            </div>
        </PageContent>
    </>)
}