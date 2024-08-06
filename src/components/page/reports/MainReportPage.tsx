'use strict';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PageContent } from "../commons/PageContent";
import { Header } from "../commons/Header";
import { useCurrentUser } from "src/components/users/CurrentUserContext";
import { Button } from "src/components/ui/button";
import { SearchIcon } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";

const data = [
    {
        name: 'Domingo',
        pv: 6,
    },
    {
        name: 'Lunes',
        pv: 10,
    },
    {
        name: 'Martes',
        pv: 11,
    },
    {
        name: 'Miercoles',
        pv: 7,
    },
    {
        name: 'Jueves',
        pv: 10,
    },
    {
        name: 'Viernes',
        pv: 9,
    },
    {
        name: 'Sabado',
        pv: 10,
    },
]

type Inputs = {
    startDate: Date
    endDate: Date
    appoinmentStatus: string
}

export const MainReportPage = () => {
    const { me, can } = useCurrentUser();
    const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();
    const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);
    return (
        <>
            <Header>Reportes</Header>
            <PageContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <label htmlFor="startDate">Start Date</label>
                    <input className="Input" type="date" id="startDate" {...register("startDate", { required: true })} />
                    <label htmlFor="endDate">End Date</label>
                    <input className="Input" type="date" id="endDate" {...register("endDate", { required: true })}/>
                    {/* <AppointmentStatusFilterControl></AppointmentStatusFilterControl> */}
                    <Button><SearchIcon />Buscar</Button>
                </form>
                <div className="flex justify-between gap-2 w-full">
                    <ResponsiveContainer width="75%" height={400}>
                        <BarChart
                            width={500}
                            height={300}
                            data={data}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                            barSize={20}
                        >
                            <XAxis dataKey="name" scale="point" padding={{ left: 10, right: 10 }} />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <CartesianGrid strokeDasharray="3 3" />
                            <Bar dataKey="pv" fill="#8884d8" background={{ fill: '#eee' }} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </PageContent>
        </>
    )
}