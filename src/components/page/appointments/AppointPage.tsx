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
import React, {useEffect, useState} from "react";
import {PageContent} from "../commons/PageContent";
import * as appointments from "../../../actions/appointments";
import {Button} from "../../ui/button";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "../../ui/form";
import {useNavigate} from "react-router-dom";
import {useCurrentUser} from "../../users/CurrentUserContext";
import {Spinner} from "src/components/form/Spinner";
import {useToast} from "../../ui/use-toast";
import {DoctorButtonSelector} from "../../dialog-selectors/doctors/DoctorButtonSelector";
import {PatientButtonSelector} from "../../dialog-selectors/patients/PatientButtonSelector";
import {SpecialtyButtonSelector} from "../../dialog-selectors/specialty/SpecialtyButtonSelector";
import { AppointmentFreeDateSelector } from "./AppointmentFreeDateSelector";
import {IdentifiableDoctor, IDoctor} from "../../../entity/doctors";
import {Deletable} from "../../../entity/commons";
import {Specialty} from "../../../entity/specialties";
import { AppointmentFreeTimeSelector } from "./AppointmentFreeTimeSelector";
import {IPatient} from "../../../entity/patients";

export interface AppointPageProps { }

const schema = z.object({
    specialty: z
        .number()
        .nullable()
        .refine((val) => val !== null, { message: "Elija una especialidad. " }),
    doctor: z
        .number()
        .nullable()
        .refine((val) => val !== null, { message: "Elija un médico. " }),
    patient: z
        .string()
        .nullable()
        .refine((val) => val !== null, { message: "Elija un paciente. " }),
    date: z
        .date({ required_error: "Campo requerido" })
        .nullable()
        .refine((val) => val !== null, { message: "Elija una fecha. " }),
    time: z
        .string()
        .nullable()
        .refine((val) => val !== null, { message: "Elija una hora. " }),
});



export const AppointPage = ({}: AppointPageProps) => {

    const [ loading, setLoading ]
        = useState<boolean>(false);
    const [ doctor, setDoctor] = useState<IDoctor | null>();
    const [ specialty, setSpecialty ] = useState<Specialty | null>(null);
    const [ date, setDate ] = useState<Date | null>(null);
    const [ time, setTime ] = useState<string | null>(null);
    const [ patient, setPatient ] = useState<IPatient | null>(null);
    const navigate = useNavigate();
    const { me } = useCurrentUser();
    const toast = useToast();
    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            patient: null,
            doctor: null,
            date: null,
            time: null,
            specialty: null
        }
    });
    // const doctor: IdentifiableDoctor & Deletable = form.watch("doctor");
    // const date: Date = form.watch("date");
    useEffect(() => {
        form.setValue("specialty", specialty?.id?? null)
        if(specialty?.id !== doctor?.specialty?.id) {
            setDoctor(null);
        }
    }, [ specialty ]);
    useEffect(() => {
        form.setValue("doctor", doctor?.file?? null);
        setDate(null);
    }, [ doctor ]);
    useEffect(() => {
        form.setValue("patient", patient?.dni?? null);
    }, [ patient ]);
    useEffect(() => {
        form.setValue("date", date);
        setTime(null);
    }, [ date ]);
    useEffect(() => {
        form.setValue("time", time);
    }, [ time ]);

    const onSubmit = (values: z.infer<typeof schema>): void => {
        setLoading(true);
        console.info(values);
        if(!values.date || !values.time || !patient || !doctor) return;
        const dateAndTime: Date = new Date(values.date);
        const [ hours, minutes ] = values.time.split(":").map(Number);
        dateAndTime.setHours(hours, minutes);
        appointments.create({
            date: dateAndTime,
            patient,
            remarks: "",
            doctor: { id: doctor.id, file: doctor.file }
        })
            .then(x => {
                toast.toast({
                    title: "Turno creado exitosamente"
                });
                navigate(`/appointments/${x.id}`)
            })
            .catch(err => {
                toast.toast({
                    title: err?.title?? "Error al intentar crear un turno. ",
                    description: err?.message,
                    variant: "destructive"
                });
            })
            .finally(() => {
                setLoading(false);
            }); //*/
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
                    <BreadcrumbLink href="/appointments">Turnos</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator/>
                <BreadcrumbItem>
                    <BreadcrumbPage>Registrar un nuevo turno</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
        <div className={"w-full flex justify-center "}>
            <Form {...form}>
                <form className={"w-full max-w-[700px] grid grid-cols-2 gap-6 gap-x-8 justify-center"} onSubmit={form.handleSubmit(onSubmit)} >
                    <h2 className={"text-3xl text-center font-bold col-span-2"}>Agendar un turno</h2>
                    <FormField
                        control={form.control}
                        name="specialty"
                        disabled={loading}
                        render={({field}) => (<FormItem>
                            <FormLabel>Especialidad</FormLabel>
                            <FormControl>
                                { /** @ts-ignore */}
                                <SpecialtyButtonSelector disabled={field.disabled} value={specialty} onChange={setSpecialty} nullable={false} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>)}
                    />
                    <FormField
                        control={form.control}
                        name="doctor"
                        disabled={loading}
                        render={({field}) => (<FormItem>
                            <FormLabel>Médico</FormLabel>
                            <FormControl>
                                { /** @ts-ignore */}
                                <DoctorButtonSelector disabled={field.disabled} specialty={specialty} value={doctor} onChange={setDoctor} filterByUnassigned={false} nullable={false} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>)}
                    />
                    <FormField
                        control={form.control}
                        name="patient"
                        disabled={loading}
                        render={({field}) => (<FormItem>
                            <FormLabel>Paciente</FormLabel>
                            <FormControl>
                                { /** @ts-ignore */}
                                <PatientButtonSelector disabled={field.disabled} value={patient} onChange={
                                    setPatient
                                } nullable={false} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>)}
                    />
                    <FormField
                        control={form.control}
                        name="date"
                        disabled={loading}
                        render={({field}) => (<FormItem>
                            <FormLabel>Fecha</FormLabel>
                            <FormControl>
                                <AppointmentFreeDateSelector disabled={field.disabled}
                                    doctor={doctor?? undefined}
                                    value={date?? undefined}
                                    { /** @ts-ignore */ ...{}}
                                    onChange={x => setDate(x?? null)}
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>)}
                    />
                    <FormField
                        control={form.control}
                        name="time"
                        disabled={loading}
                        render={({field}) => (<FormItem>
                            <FormLabel>Hora</FormLabel>
                            <FormControl>
                                <AppointmentFreeTimeSelector disabled={field.disabled}
                                    doctor={doctor?? undefined}
                                    date={date ?? undefined}
                                    value={time?? undefined}
                                    { /** @ts-ignore */ ...{}}
                                    onChange={x => setTime(x ?? null)}
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>)}
                    />
                    <div className="flex flex-1 mt-4 justify-center items-center col-span-2">
                        <Button disabled={loading} type={"submit"}>
                            {loading && <Spinner className={"w-[12px] h-[12px] mr-2"} />}
                            {!loading ? "Agendar" : "Agendando"}</Button>
                    </div>
                    <div className={"h-[150px]"}></div>
                </form>
            </Form>
        </div>


    </PageContent>
    </>
)
}