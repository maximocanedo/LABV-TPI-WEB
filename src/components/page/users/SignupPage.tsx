'use strict';

import { PageContent } from "../commons/PageContent";
import {useToast} from "../../ui/use-toast";
import {useState} from "react";
import { z } from "zod";
import * as users from "../../../actions/users";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "../../ui/form";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Input} from "../../ui/input";
import {Button} from "../../ui/button";
import {Spinner} from "../../form/Spinner";
import {User} from "../../../entity/users";

export interface SignupPageProps {

}
enum SignUpPageTab {
    FORM = "FORM",
    SUCCESS = "SUCCESS",
    ERROR = "ERROR"
}

const schema = z.object({
    name1: z.string().min(1, "El nombre no debe estar vacío. "),
    username: z.string()
        .min(4, "Debe contener al menos cuatro caracteres. ")
        .regex(/^[a-zA-Z][a-zA-Z0-9._]{4,14}$/, "Sólo debe contener letras, números, puntos y guiones bajos. "),
    password: z.string()
        .regex(/^(?=.*?[A-ZÑÇ])(?=.*?[a-zñç])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, "La contraseña, de al menos ocho caracteres, debe contener al menos una mayúscula, una minúscula, un dígito y un caracter especial."),
    repeatPassword: z.string()
})
    .refine((data) => !data.password.includes(data.name1), (x) => ({
        message: `No, ${x.name1}, la contraseña no puede contener tu nombre.`,
        path: ["password"],
    }))
    .refine((data) => !data.password.includes(data.username), (x) => ({
        message: `No @${x.username}, la contraseña no puede contener tu nombre de usuario.`,
        path: ["password"],
    }))
    .superRefine(async (data, ctx) => {
        const usernameExists = await users.existsByUsername(data.username);
        if (usernameExists) {
            ctx.addIssue({
                code: "custom",
                path: ["username"],
                message: "El nombre de usuario ya está en uso."
            });
        }
    });

export const SignupPage = ({}: SignupPageProps) => {
    const toast = useToast();
    const [ tab, setTab ]
        = useState<SignUpPageTab>(SignUpPageTab.FORM);
    const [ loading, setLoading ] = useState<boolean>(false);
    const [ user, setUser ] = useState<User|null>(null);
    const [ fail, setFail ] = useState<any | null>(null);
    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            name1: "",
            username: "",
            password: "",
            repeatPassword: ""
        }
    });
    const onSubmit = (values: z.infer<typeof schema>): void => {
        setLoading(true);
        users.signup({
            name: values.name1,
            username: values.username,
            password: values.password
        })
            .then(user => {
                setUser(user)
                if(user != null) setTab(SignUpPageTab.SUCCESS);
            })
            .catch(err => {
                setFail(err);
                if(err != null) setTab(SignUpPageTab.ERROR);
            })
            .finally(() => { setLoading(false); });
    };
    return <PageContent fullHeight>
        <div className={"flex items-center justify-center min-h-screen"}>
            { tab === SignUpPageTab.FORM && <Form {...form}>
                <form className={"flex flex-col justify-end space-y-6 w-full max-w-[350px]"}
                      onSubmit={form.handleSubmit(onSubmit)}>
                    <h2 className={"text-3xl text-center font-bold"}>¡Registrate!</h2>
                    <FormField
                        control={form.control}
                        name="name1"
                        disabled={loading}
                        render={({field}) => (<FormItem>
                            <FormLabel>Nombre</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>)}
                    />
                    <FormField
                        control={form.control}
                        name="username"
                        disabled={loading}
                        render={({field}) => (<FormItem>
                            <FormLabel>Nombre de usuario</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>)}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        disabled={loading}
                        { /** @ts-ignore **/ ...{}}
                        render={({field}) => (<FormItem>
                            <FormLabel>Contraseña</FormLabel>
                            <FormControl>
                                <Input {...field} type={"password"}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>)}
                    />

                    <FormField
                        control={form.control}
                        name="repeatPassword"
                        disabled={loading}
                        render={({field}) => (<FormItem>
                            <FormLabel>Repita la contraseña</FormLabel>
                            <FormControl>
                                <Input {...field} type={"password"}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>)}
                    />

                    <Button
                        disabled={loading}
                        type={"submit"}>
                        {loading && <Spinner className={"w-[24px] h-[24px] mr-2"}/>}
                        {!loading ? "Creá tu cuenta" : "Cargando"}
                    </Button>
                </form>
            </Form>}
            { tab === SignUpPageTab.SUCCESS &&
                <div className={"flex flex-col items-center justify-end space-y-6 w-full max-w-[350px]"}>
                    <h2 className={"text-3xl text-center font-bold"}>¡Bienvenido!</h2>
                    <p>Ya podés iniciar sesión con tus credenciales. </p>
                    <Button variant={"outline"} onClick={() => {
                        setTab(SignUpPageTab.FORM)
                    }}>Volver</Button>
                </div>
            }
            { tab === SignUpPageTab.ERROR &&
                <div className={"flex flex-col items-center justify-end space-y-6 w-full max-w-[350px]"}>
                    <h2 className={"text-3xl text-center font-bold"}>Error</h2>
                    <p>{ (fail != null && 'message' in fail) ? fail.message : "No hay información sobre el error. "}</p>
                    <Button onClick={() => {
                        setTab(SignUpPageTab.FORM)
                    }}>Reintentar</Button>
                </div>
            }
        </div>
    </PageContent>
        ;
}