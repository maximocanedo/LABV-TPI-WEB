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
import * as doctors from "../../../actions/doctors";
import {Specialty} from "../../../entity/specialties";
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
import * as users from "../../../actions/users";
import {IUser} from "../../../entity/users";
import { Spinner } from "src/components/form/Spinner";

export interface SignDoctorPageProps { }

const p = PhoneNumberUtil.getInstance();
const schema = z.object({
    name: z.string().min(1, "El nombre no debe estar vacío. "),
    surname: z.string().min(1, "El apellido no debe estar vacío. "),
    file: z.number(),
    specialty: z
        .object({ name: z.string(), id: z.number(), description: z.string(), active: z.boolean() })
        .refine(x => x != null, "La especialidad no puede estar vacía. ")
        .refine(x => x.active, "Elija una especialidad habilitada. "),
    user: z
        .object({ username: z.string(), active: z.boolean() })
        .refine(x => x.active, "Elija un usuario habilitado. "),
    sex: z.enum(["M", "F"]),
    birth: z.date(),
    localty: z.string(),
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
    const takenFile = await doctors.existsByFile(data.file);
    if (takenFile) {
        ctx.addIssue({
            code: "custom",
            path: ["file"],
            message: "Este legajo ya está en uso por otro médico."
        });
    }
});



export const SignDoctorPage = ({}: SignDoctorPageProps) => {

    const [ loading, setLoading ] = useState<boolean>(false);
    const navigate = useNavigate();
    const { me } = useCurrentUser();
    const [ linkMe, setLinkMe ] = useState<boolean>(false);
    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: "",
            surname: "",
            file: 0,
            specialty: undefined,
            user: undefined,
            sex: 'M',
            birth: undefined,
            localty: "",
            email: "",
            phone: ""
        }
    });

    const onSubmit = (values: z.infer<typeof schema>): void => {
        setLoading(true);
        doctors.create({
            ...values
        })
            .then(x => {
                navigate(`/doctors/${x.file}`)
            })
            .catch(err => {

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
                    <BreadcrumbLink href="/doctors">Médicos</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator/>
                <BreadcrumbItem>
                    <BreadcrumbPage>Registrar un nuevo médico</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
        <div className={"w-full flex justify-center "}>
            <Form {...form}>
                <form className={"w-full max-w-[700px] grid grid-cols-2 gap-6 gap-x-8 justify-center"} onSubmit={form.handleSubmit(onSubmit)} >
                    <h2 className={"text-3xl text-center font-bold col-span-2"}>Registrar médico</h2>
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
                        name="file"
                        disabled={loading}
                        render={({field}) => (<FormItem>
                            <FormLabel>N.º de legajo</FormLabel>
                            <FormControl>
                                <Input type={"number"} step={1} {...field}
                                       onChange={(e) => {
                                           const valueAsNumber = e.target.valueAsNumber?? Number(e.target.value);
                                           field.onChange(valueAsNumber);
                                       }} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>)}
                    />
                    <FormField
                        control={form.control}
                        name="specialty"
                        disabled={loading}
                        render={({field}) => (<FormItem>
                            <FormLabel>Especialidad</FormLabel>
                            <FormControl>
                                <SpecialtyButtonSelector disabled={loading} value={field.value?? undefined} onChange={field.onChange} nullable={false}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>)}
                    />
                    <FormField
                        control={form.control}
                        name="sex"
                        disabled={loading}
                        render={({field}) => (<FormItem>
                            <FormLabel>Sexo</FormLabel>
                            <FormControl>
                                <Select disabled={loading} value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Sexo"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="M">Masculino</SelectItem>
                                        <SelectItem value="F">Femenino</SelectItem>
                                    </SelectContent>
                                </Select>
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
                                <DatePicker value={field.value} onChange={field.onChange} />
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
                                <Input type={"email"} value={field.value} onChange={field.onChange} />
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
                                <Input type={"tel"} value={field.value} onChange={field.onChange} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>)}
                    />
                    <FormField
                        control={form.control}
                        name="user"
                        disabled={loading}
                        render={({field}) => (<FormItem>
                            <FormLabel>Usuario asociado</FormLabel>
                            <FormControl>
                                { /** @ts-ignore */}
                                <UserButtonSelector
                                    disabled={loading || linkMe}
                                    { /** @ts-ignore */...{} }
                                    value={linkMe ? me as IUser : field.value}
                                    onChange={field.onChange}
                                    nullable={false} />
                            </FormControl>
                            <FormMessage/>
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-2 ">
                                <FormControl>
                                    <Checkbox id="terms" value={linkMe ? "on" : "off"} onCheckedChange={(x) => {
                                        if (x === "indeterminate") setLinkMe(false)
                                        else {
                                            setLinkMe(x)
                                            if(x) field.onChange(me as IUser)
                                        }
                                    }}/>
                                </FormControl>
                                <label htmlFor={"terms"} className="leading-none space-y-2">
                                    <FormLabel>Vincular mi cuenta</FormLabel>
                                    { linkMe && me.doctor && <FormDescription>
                                        Esto desvinculará el doctor actual.
                                    </FormDescription>}
                                </label>
                            </FormItem>
                        </FormItem>)}
                    />
                    <div className="flex flex-1 mt-4 justify-center items-center col-span-2">
                        <Button type={"submit"}>
                            {loading && <Spinner className={"w-[12px] h-[12px] mr-2"} />}
                            Continuar</Button>
                    </div>
                    <div className={"h-[150px]"}></div>
                </form>
            </Form>
        </div>


    </PageContent>
    </>
)
}