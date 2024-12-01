'use strict';

import {Header} from "../commons/Header";
import {DefBackButton} from "../../buttons/DefBackButton";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "../../ui/breadcrumb";
import React, {useState} from "react";
import {PageContent} from "../commons/PageContent";
import * as patients from "../../../actions/patients";
import {Button} from "../../ui/button";
import {SpecialtyButtonSelector} from "../../dialog-selectors/specialty/SpecialtyButtonSelector";
import {z} from "zod";
import {PhoneNumber, PhoneNumberFormat, PhoneNumberUtil} from "google-libphonenumber";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "../../ui/form";
import {Input} from "../../ui/input";
import {UserButtonSelector} from "../../dialog-selectors/users/UserButtonSelector";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "../../ui/select";
import {DatePicker} from "../../form/DatePicker";
import { useNavigate } from "react-router-dom";
import {useCurrentUser} from "../../users/CurrentUserContext";
import {Checkbox} from "../../ui/checkbox";
import {IUser} from "../../../entity/users";
import { Spinner } from "src/components/form/Spinner";
import {useToast} from "../../ui/use-toast";

export interface SignPatientPageProps { }

const p = PhoneNumberUtil.getInstance();
const schema = z.object({
    name: z.string().min(1, "El nombre no debe estar vacío. "),
    surname: z.string().min(1, "El apellido no debe estar vacío. "),
    dni: z.string({ required_error: "Campo requerido" }).regex(/^[0-9]+$/, "Ingrese su D.N.I., sin puntos ni guiones. "),
    birth: z.date({ required_error: "Campo requerido" }),
    address: z.string({ required_error: "Campo requerido" }),
    localty: z.string({ required_error: "Campo requerido" }),
    province: z.string({ required_error: "Campo requerido" }),
    email: z.string().email("Ingrese una dirección de correo electrónico válida. "),
    phone: z.string().superRefine((value, ctx) => {
        try {
            const phone: PhoneNumber = p.parse(value);
            return p.isValidNumber(phone);
        } catch(err ) {
            console.log({err});
            ctx.addIssue({
                // @ts-ignore
                message: err?.message?? "Ingrese un número de teléfono válido",
                code: z.ZodIssueCode.custom
            })
        }
    }).transform(value => {
        const phone: PhoneNumber = p.parse(value);
        return p.format(phone, PhoneNumberFormat.INTERNATIONAL);
    })
}).superRefine(async (data, ctx) => {
    const takenFile = await patients.existsByDNI(data.dni);
    if (takenFile) {
        ctx.addIssue({
            code: "custom",
            path: ["dni"],
            message: "Este paciente ya está registrado."
        });
    }
});



export const SignPatientPage = ({}: SignPatientPageProps) => {

    const [ loading, setLoading ]
        = useState<boolean>(false);
    const navigate = useNavigate();
    const { me } = useCurrentUser();
    const toast = useToast();
    const [ linkMe, setLinkMe ] = useState<boolean>(false);
    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: "",
            surname: "",
            dni: "",
            address: "",
            birth: undefined,
            localty: "",
            province: "",
            email: "",
            phone: ""
        }
    });

    const onSubmit = (values: z.infer<typeof schema>): void => {
        setLoading(true);
        patients.create({
            ...values
        })
            .then(x => {
                toast.toast({
                    title: "Paciente creado exitosamente"
                });
                navigate(`/patients/${x.id}`)
            })
            .catch(err => {
                toast.toast({
                    title: err?.title?? "Error al intentar crear un médico. ",
                    description: err?.message,
                    variant: "destructive"
                });
            })
            .finally(() => {
                setLoading(false);
            });
    }
    if(me == "loading" || me == null) return <></>;
    // @ts-ignore
    return (<>
    <Header>
        <DefBackButton />
    </Header>
    <PageContent>
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink href="/">Inicio</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator/>
                <BreadcrumbItem>
                    <BreadcrumbLink href="/patients">Pacientes</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator/>
                <BreadcrumbItem>
                    <BreadcrumbPage>Registrar un nuevo paciente</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
        <div className={"w-full flex justify-center "}>
            <Form {...form}>
                <form className={"w-full max-w-[700px] grid grid-cols-2 gap-6 gap-x-8 justify-center"} onSubmit={form.handleSubmit(onSubmit)} >
                    <h2 className={"text-3xl text-center font-bold col-span-2"}>Registrar paciente</h2>
                    <FormField
                        control={form.control}
                        name="name"
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
                        name="surname"
                        disabled={loading}
                        render={({field}) => (<FormItem>
                            <FormLabel>Apellido</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>)}
                    />
                    <FormField
                        control={form.control}
                        name="dni"
                        disabled={loading}
                        render={({field}) => (<FormItem>
                            <FormLabel>D.N.I. N.º</FormLabel>
                            <FormControl>
                                <Input type={"text"} inputMode={"numeric"} {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>)}
                    />
                    <FormField
                        control={form.control}
                        name="address"
                        disabled={loading}
                        render={({field}) => (<FormItem>
                            <FormLabel>Dirección</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>)}
                    />
                    <FormField
                        control={form.control}
                        name="localty"
                        disabled={loading}
                        render={({field}) => (<FormItem>
                            <FormLabel>Localidad</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>)}
                    />
                    <FormField
                        control={form.control}
                        name="province"
                        disabled={loading}
                        render={({field}) => (<FormItem>
                            <FormLabel>Provincia</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>)}
                    />

                    <FormField
                        control={form.control}
                        name="email"
                        disabled={loading}
                        render={({field}) => (<FormItem>
                            <FormLabel>Dirección de correo electrónico</FormLabel>
                            <FormControl>
                                <Input type={"email"} {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>)}
                    />
                    <FormField
                        control={form.control}
                        name="phone"
                        disabled={loading}
                        render={({field}) => (<FormItem>
                            <FormLabel>Número de teléfono</FormLabel>
                            <FormControl>
                                <Input type={"tel"} {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>)}
                    />
                    <FormField
                        control={form.control}
                        name="birth"
                        disabled={loading}
                        render={({field}) => (<FormItem>
                            <FormLabel>Fecha de nacimiento</FormLabel>
                            <FormControl>
                                <DatePicker {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>)}
                    />
                    <div className="flex flex-1 mt-4 justify-center items-center col-span-2">
                        <Button disabled={loading} type={"submit"}>
                            {loading && <Spinner className={"w-[12px] h-[12px] mr-2"} />}
                            {!loading ? "Continuar" : "Creando paciente"}</Button>
                    </div>
                    <div className={"h-[150px]"}></div>
                </form>
            </Form>
        </div>


    </PageContent>
    </>
)
}