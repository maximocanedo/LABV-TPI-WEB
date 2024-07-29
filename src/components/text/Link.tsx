'use strict';
import {AnchorHTMLAttributes} from "react";

const Link = (props: AnchorHTMLAttributes<HTMLAnchorElement>) => {
    return <a {...props}>{props.children}</a>;
};

export default Link;