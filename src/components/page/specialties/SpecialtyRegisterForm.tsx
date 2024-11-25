'use strict';

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {FormControl, FormField, FormItem, FormLabel, Form, FormMessage} from "src/components/ui/form";
import { Input } from "src/components/ui/input";
import { Textarea } from "src/components/ui/textarea";
import { useToast } from "src/components/ui/use-toast";
import { useCurrentUser } from "src/components/users/CurrentUserContext";
import { Permits } from "src/entity/users";
import { z } from "zod";
import {Button} from "../../ui/button";
import * as specialties from "../../../actions/specialties"
import {Spinner} from "../../form/Spinner";

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
        setLoading(true)
        specialties.create({
            name: values.name1,
            description: values.description
        })
            .then(specialty => {
                toast.toast({
                    title: "Especialidad registrada correctamente. "
                });
            })
            .catch(err => {
                toast.toast({
                    title: err.title,
                    description: err.description
                });
            })
            .finally(() => { setLoading(false); })
    };
    if(!me || me == "loading" || !can(Permits.CREATE_SPECIALTY)) return null;
    return <div className={"flex items-start justify-center min-h-screen"} >
        <Form {...form}>
        { /** @ts-ignore */ }
        <form className={"flex flex-col justify-end space-y-6 w-full max-w-[350px]"} onSubmit={form.handleSubmit(onSubmit)}>
            <h2 className={"text-3xl text-center font-bold"}>Agregar una nueva especialidad</h2>

            <FormField
                control={form.control}
                name="name1"
                disabled={loading}
                { /** @ts-ignore **/ ...{} }
                render={({ field }) => (<FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                        <Input {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>)}
                />
            <FormField
                control={form.control}
                name="description"
                disabled={loading}
                // @ts-ignore
                render={({ field }) => (<FormItem>
                    <FormLabel>Descripción</FormLabel>
                    <FormControl>
                    { /** @ts-ignore */ }
                        <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>)}
                />
            <Button
                disabled={loading}
                type={"submit"}>
                { loading && <Spinner className={"w-[24px] h-[24px] mr-2"} /> }
                { !loading ? "Añadir" : "Cargando" }
            </Button>
        </form>
    </Form>
    </div>;
}