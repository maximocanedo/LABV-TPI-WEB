import {Button} from "../ui/button";
import {EllipsisVertical} from "lucide-react";

export const MenuButton = () => {
    return <Button variant="ghost" size="icon">
        <EllipsisVertical size={"16"}/>
    </Button>
};