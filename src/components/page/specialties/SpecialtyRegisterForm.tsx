'use strict';

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Form } from "react-router-dom";
import { FormControl, FormField, FormItem, FormLabel } from "src/components/ui/form";
import { Input } from "src/components/ui/input";
import { useToast } from "src/components/ui/use-toast";
import { useCurrentUser } from "src/components/users/CurrentUserContext";
import { Permits } from "src/entity/users";
import { z } from "zod";

export interface SpecialtyRegisterFormProps {

}

const schema = z.object({
    name1: z.string().min(3, "El nombre debe contener al menos tres carcteresl"),
    description: z.string().min(3)
});


export const SpecialtyRegisterForm = ({}: SpecialtyRegisterFormProps) => {
    const { me, can } = useCurrentUser();
    const toast = useToast();
    const [ loading, setLoading ] = useState<boolean>(false);
    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            name1: "",
            description: ""
        }
    });
    const onSubmit = (values: z.infer<typeof schema>) => {
        console.table(values);
    };
    if(!me || me == "loading" || !can(Permits.CREATE_SPECIALTY)) return null;
    return <Form {...form}>
        { /** @ts-ignore */ }
        <form onSubmit={form.handleSubmit(onsubmit)}>
            <FormField
                control={form.control}
                name="name1"
                { /** @ts-ignore **/ ...{} }
                render={({ field }) => (<FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                        <Input {...field} />
                    </FormControl>
                </FormItem>)} 
                />
            <FormField
                control={form.control}
                name="description"
                // @ts-ignore
                render={({ field }) => (<FormItem>
                    <FormLabel>Descripción</FormLabel>
                    <FormControl>
                    { /** @ts-ignore */ }
                        <Textarea {...field} />
                    </FormControl>
                </FormItem>)}
                />
        </form>
    </Form>;
}