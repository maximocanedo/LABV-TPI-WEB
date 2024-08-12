'use strict';

import { zodResolver } from "@hookform/resolvers/zod";
import { act, ReactNode, useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "src/components/ui/dialog";
import { hour, minute, Schedule, second, weekday } from "src/entity/doctors";
import { z } from "zod";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "src/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "src/components/ui/select";
import { Input } from "src/components/ui/input";
import { Button } from "src/components/ui/button";
import * as doctors from "../../../../actions/doctors";
import { CurrentDoctorContext } from "src/components/page/doctors/CurrentDoctorContext";
import { useToast } from "src/components/ui/use-toast";
import { Spinner } from "src/components/form/Spinner";
 
const formSchema = z.object({
    day: z.string().min(1),
    startTime: z.string().min(1).regex(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/, "Ingrese una hora válida"),
    endTime: z.string().min(1).regex(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/, "Ingrese una hora válida")
});
export interface ScheduleDialogProps {
    children: ReactNode | ReactNode[];
}
const formatHour = (hour: hour, min: minute): string => {
    let x = (y: hour | minute | second | string) => ("0" + y).slice(-2);
    return x(hour) + ":" + x(min);
}
const getStartTimeByDefault = (): [hour, minute, string] => {
    const date: Date = new Date();
    const actualHour: hour = date.getHours() as hour;
    const actualMin: minute = date.getMinutes() as minute;
    const finalHour: hour = (actualHour + (actualMin < 30?0:1) as hour);
    const finalMin: minute = (actualMin < 30 ? 0 : 30) as minute; 
    return [ finalHour, finalMin, formatHour(finalHour, finalMin) ];
}
const getFinishTimeByDefault = (): [hour, minute, string] => {
    const st = getStartTimeByDefault();
    const fh: hour = ((st[0] + 8) % 24) as hour;
    return [ fh, st[1], formatHour(fh, st[1]) ];
}
const weekdays: weekday[] = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];






export const ScheduleDialog = ({ children }: ScheduleDialogProps) => {

    const [ loading, setLoading ] = useState<boolean>(false);
    const [ open, setOpen ] = useState<boolean>(false);

    const {record, updater} = useContext(CurrentDoctorContext);
    if(!record) return null;
    const {toast} = useToast();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            day: weekdays[new Date().getDay()],
            startTime: getStartTimeByDefault()[2],
            endTime: getFinishTimeByDefault()[2]
        },
    });
    const onSubmit = (values: z.infer<typeof formSchema>) => {
        setLoading(true);
        const startTime: string = values.startTime + ":00";
        const endTime: string = values.endTime + ":00";
        const schedule: Schedule = {
            startTime,
            endTime,
            beginDay: values.day as weekday,
            finishDay: (values.endTime <= values.startTime ? weekdays[(weekdays.indexOf(values.day as weekday) + 1) % 7] : values.day) as weekday,
            id: -1,
            active: true
        };
        doctors.addSchedule(schedule, record.file)
            .then(schedules => {
                updater({ ...record, schedules });
                toast({
                    description: "Operación exitosa. "
                });
            })
            .catch(err => {
                toast({
                    variant: "destructive",
                    title: err.path ? err.message : "Algo salió mal. ",
                    description: err.path ? err.description : "Hubo un error al intentar registrar el horario. "
                });
            })
            .finally(() => {
                setLoading(false);
                setOpen(false);
            })
    };


    return (
            <Dialog open={open} onOpenChange={setOpen} >
                <DialogTrigger asChild>
                    { children }
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{!loading && "Registrar un horario"}{loading && "Registrando"}</DialogTitle>
                    </DialogHeader>
                        { !loading && <Form {...form}>
                            <form onSubmit={form.handleSubmit((onSubmit))} className="space-y-8">
                                <div className={"flex flex-col gap-3 pt-3"}>
                                    <FormField
                                        control={form.control}
                                        name="day"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Día</FormLabel>
                                                <FormControl>
                                                    <Select value={field.value} onValueChange={field.onChange}>
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Seleccione día" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="SUNDAY">Domingo</SelectItem>
                                                            <SelectItem value="MONDAY">Lunes</SelectItem>
                                                            <SelectItem value="TUESDAY">Martes</SelectItem>
                                                            <SelectItem value="WEDNESDAY">Miércoles</SelectItem>
                                                            <SelectItem value="THURSDAY">Jueves</SelectItem>
                                                            <SelectItem value="FRIDAY">Viernes</SelectItem>
                                                            <SelectItem value="SATURDAY">Sábado</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormDescription></FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="startTime"
                                        render={({ field }) => (
                                            <FormItem>
                                            <FormLabel>Inicio</FormLabel>
                                            <FormControl>
                                                <Input placeholder="shadcn" {...field} type="time" />
                                            </FormControl>
                                            <FormDescription>
                                                {}
                                            </FormDescription>
                                            <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="endTime"
                                        render={({ field }) => (
                                            <FormItem>
                                            <FormLabel>Fin</FormLabel>
                                            <FormControl>
                                                <Input {...field} type="time" />
                                            </FormControl>
                                            <FormDescription>
                                                { form.getValues().endTime <= form.getValues().startTime && "El horario termina al día siguiente. " }
                                            </FormDescription>
                                            <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="submit" >OK</Button>
                                </div>
                            </form>
                        </Form> }
                        { loading && <div className="grid place-items-center"><Spinner /></div> }
                </DialogContent>
            </Dialog>
    );
}